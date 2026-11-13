/**
 * Time Coin 원장 (순수 함수).
 *
 * - 1시간 = 1 Time Coin
 * - 거래 확정 시 이용자 코인 LOCK → 완료 시 제공자에게 정산
 * - 취소 시 LOCK 해제
 * - tradeId 기준으로 LOCK / 정산은 각각 1회만 허용 (중복 정산 방지)
 *
 * 현재는 프론트 mock 상태에서 사용하며, NestJS API 연동 시
 * 동일한 규칙을 서버 트랜잭션으로 옮기고 프론트는 결과만 반영한다.
 */
import type { CoinTx, CoinTxType, ID, Result, Wallet } from "@/types";

export interface LedgerState {
  wallets: Record<ID, Wallet>;
  txs: CoinTx[];
  /** tradeId → 잠금 정보 */
  locks: Record<ID, { userId: ID; amount: number }>;
  /** 정산 완료된 tradeId */
  settledTradeIds: ID[];
}

export type LedgerError =
  | "INVALID_AMOUNT"
  | "WALLET_NOT_FOUND"
  | "INSUFFICIENT_BALANCE"
  | "ALREADY_LOCKED"
  | "NOT_LOCKED"
  | "ALREADY_SETTLED"
  | "SELF_TRADE";

type LedgerResult = Result<LedgerState, LedgerError>;

const fail = (error: LedgerError, message: string): LedgerResult => ({ ok: false, error, message });

export const available = (w: Wallet) => w.balance - w.locked;

let seq = 0;
const txId = () => `tx_${Date.now().toString(36)}_${(seq++).toString(36)}`;

function makeTx(
  wallet: Wallet,
  type: CoinTxType,
  amount: number,
  memo: string,
  tradeId?: ID,
  now = new Date().toISOString(),
): CoinTx {
  return {
    id: txId(),
    userId: wallet.userId,
    type,
    amount,
    tradeId,
    memo,
    balanceAfter: wallet.balance,
    createdAt: now,
  };
}

function isValidAmount(amount: number) {
  return Number.isInteger(amount) && amount > 0;
}

/** 거래 확정 시 이용자 코인을 잠근다. */
export function lockCoins(
  state: LedgerState,
  input: { tradeId: ID; userId: ID; amount: number; memo?: string },
): LedgerResult {
  const { tradeId, userId, amount } = input;
  if (!isValidAmount(amount)) return fail("INVALID_AMOUNT", "코인 수량이 올바르지 않습니다.");
  if (state.settledTradeIds.includes(tradeId))
    return fail("ALREADY_SETTLED", "이미 정산이 완료된 거래입니다.");
  if (state.locks[tradeId]) return fail("ALREADY_LOCKED", "이미 코인이 잠긴 거래입니다.");

  const wallet = state.wallets[userId];
  if (!wallet) return fail("WALLET_NOT_FOUND", "코인 지갑을 찾을 수 없습니다.");
  if (available(wallet) < amount)
    return fail(
      "INSUFFICIENT_BALANCE",
      `사용 가능한 코인이 부족합니다. (필요 ${amount} / 보유 ${available(wallet)})`,
    );

  const next: Wallet = { ...wallet, locked: wallet.locked + amount };
  return {
    ok: true,
    value: {
      ...state,
      wallets: { ...state.wallets, [userId]: next },
      locks: { ...state.locks, [tradeId]: { userId, amount } },
      txs: [makeTx(next, "lock", amount, input.memo ?? "거래 확정 · 코인 잠금", tradeId), ...state.txs],
    },
  };
}

/** 거래 취소 시 잠금을 해제한다. */
export function releaseLock(state: LedgerState, tradeId: ID, memo = "거래 취소 · 잠금 해제"): LedgerResult {
  const lock = state.locks[tradeId];
  if (!lock) return fail("NOT_LOCKED", "잠긴 코인이 없는 거래입니다.");
  const wallet = state.wallets[lock.userId];
  if (!wallet) return fail("WALLET_NOT_FOUND", "코인 지갑을 찾을 수 없습니다.");

  const next: Wallet = { ...wallet, locked: wallet.locked - lock.amount };
  const locks = { ...state.locks };
  delete locks[tradeId];
  return {
    ok: true,
    value: {
      ...state,
      wallets: { ...state.wallets, [lock.userId]: next },
      locks,
      txs: [makeTx(next, "unlock", lock.amount, memo, tradeId), ...state.txs],
    },
  };
}

/** 거래 완료 시 잠긴 코인을 제공자에게 정산한다. (tradeId당 1회) */
export function settleTrade(state: LedgerState, input: { tradeId: ID; providerId: ID }): LedgerResult {
  const { tradeId, providerId } = input;
  if (state.settledTradeIds.includes(tradeId))
    return fail("ALREADY_SETTLED", "이미 정산이 완료된 거래입니다.");
  const lock = state.locks[tradeId];
  if (!lock) return fail("NOT_LOCKED", "잠긴 코인이 없어 정산할 수 없습니다.");
  if (lock.userId === providerId) return fail("SELF_TRADE", "본인과의 거래는 정산할 수 없습니다.");

  const payer = state.wallets[lock.userId];
  const payee = state.wallets[providerId];
  if (!payer || !payee) return fail("WALLET_NOT_FOUND", "코인 지갑을 찾을 수 없습니다.");

  const nextPayer: Wallet = {
    ...payer,
    balance: payer.balance - lock.amount,
    locked: payer.locked - lock.amount,
  };
  const nextPayee: Wallet = { ...payee, balance: payee.balance + lock.amount };
  const locks = { ...state.locks };
  delete locks[tradeId];
  const now = new Date().toISOString();

  return {
    ok: true,
    value: {
      wallets: { ...state.wallets, [payer.userId]: nextPayer, [payee.userId]: nextPayee },
      locks,
      settledTradeIds: [...state.settledTradeIds, tradeId],
      txs: [
        makeTx(nextPayee, "earn", lock.amount, "재능 제공 완료 · 코인 적립", tradeId, now),
        makeTx(nextPayer, "spend", lock.amount, "재능 이용 완료 · 코인 사용", tradeId, now),
        ...state.txs,
      ],
    },
  };
}
