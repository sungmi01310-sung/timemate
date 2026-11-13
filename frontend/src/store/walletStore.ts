"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ID, Result, Wallet } from "@/types";
import {
  available,
  lockCoins,
  releaseLock,
  settleTrade,
  type LedgerError,
  type LedgerState,
} from "@/lib/coin/ledger";
import { mockCoinTxs, mockLocks, mockWallets } from "@/mocks/data";

/**
 * Time Coin 상태.
 * [MOCK] 원장 계산을 클라이언트에서 수행한다.
 *        API 연동 시 각 액션은 서버 호출 후 응답(지갑/내역)으로 상태를 교체한다.
 */
interface WalletStore extends LedgerState {
  lock: (input: { tradeId: ID; userId: ID; amount: number }) => Result<void, LedgerError>;
  release: (tradeId: ID) => Result<void, LedgerError>;
  settle: (input: { tradeId: ID; providerId: ID }) => Result<void, LedgerError>;
  reset: () => void;
}

const initialLedger = (): LedgerState => ({
  wallets: Object.fromEntries(mockWallets.map((w) => [w.userId, { ...w }])),
  txs: [...mockCoinTxs],
  locks: { ...mockLocks },
  settledTradeIds: [],
});

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => {
      const apply = (r: Result<LedgerState, LedgerError>): Result<void, LedgerError> => {
        if (!r.ok) return r;
        set(r.value);
        return { ok: true, value: undefined };
      };
      return {
        ...initialLedger(),
        lock: (input) => apply(lockCoins(get(), input)),
        release: (tradeId) => apply(releaseLock(get(), tradeId)),
        settle: (input) => apply(settleTrade(get(), input)),
        reset: () => set(initialLedger()),
      };
    },
    {
      name: "tm-wallet",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ wallets, txs, locks, settledTradeIds }) => ({ wallets, txs, locks, settledTradeIds }),
    },
  ),
);

const EMPTY_WALLET: Wallet = { userId: "", balance: 0, locked: 0 };

/** 특정 사용자 지갑 요약 */
export function useWallet(userId: ID | undefined) {
  const wallet = useWalletStore((s) => (userId ? s.wallets[userId] : undefined)) ?? EMPTY_WALLET;
  return { ...wallet, available: available(wallet) };
}
