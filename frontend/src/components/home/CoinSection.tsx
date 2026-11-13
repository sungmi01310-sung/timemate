"use client";

import { ArrowRightLeft, Clock, Lock } from "lucide-react";
import { Button } from "@/components/common";
import { CoinCard } from "@/components/domain";
import { useAuthStore } from "@/store/authStore";
import { useWallet } from "@/store/walletStore";

/**
 * SECTION 03. 나의 Time Coin
 * - 회원: 닉네임 + CoinCard (표시만. 잔액 변경은 백엔드 정산에서만)
 * - 비회원: 시간 교환 방식 안내 카드
 */
export function CoinSection() {
  const user = useAuthStore((s) => s.user);
  const wallet = useWallet(user?.id);

  if (!user) return <GuestGuideCard />;

  return (
    <section aria-labelledby="coin-title" className="flex flex-col">
      <h2 id="coin-title" className="mb-4 text-h2">
        <span className="text-secondary">{user.nickname}</span>님의 Time Coin
      </h2>
      <CoinCard balance={wallet.balance} available={wallet.available} locked={wallet.locked} />
    </section>
  );
}

const GUIDE = [
  { icon: Clock, title: "1시간 제공 → 1 TC 적립", desc: "내 재능을 1시간 나누면 1 Time Coin이 쌓여요." },
  { icon: ArrowRightLeft, title: "1 TC로 1시간 이용", desc: "모은 코인으로 다른 사람의 재능을 배워요." },
  { icon: Lock, title: "거래 확정 시 안전 보관", desc: "코인은 거래가 끝날 때까지 잠겨 있다가 정산돼요." },
];

function GuestGuideCard() {
  return (
    <section aria-labelledby="guide-title" className="flex flex-col">
      <h2 id="guide-title" className="mb-4 text-h2">
        시간으로 재능을 교환해요
      </h2>
      <div className="flex flex-1 flex-col rounded-xl bg-navy p-6 text-white">
        <ul className="flex flex-col gap-4">
          {GUIDE.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-point">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-body-sm text-white/60">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-2 pt-1">
          <Button href="/signup" variant="accent" fullWidth>
            회원가입
          </Button>
          <Button href="/login" variant="outline" fullWidth>
            로그인
          </Button>
        </div>
      </div>
    </section>
  );
}
