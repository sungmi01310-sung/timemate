import { BookOpen, Coins, Handshake, UserPlus, type LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: UserPlus, title: "내 재능 등록하기", desc: "가르칠 수 있는 재능과 가능한 시간을 등록해요." },
  { icon: Handshake, title: "다른 사용자와 매칭하기", desc: "신청을 받거나 보내고, 채팅으로 일정을 맞춰요." },
  { icon: Coins, title: "시간을 나누고 코인 적립", desc: "재능을 제공한 시간만큼 Time Coin이 쌓여요." },
  { icon: BookOpen, title: "코인으로 새로운 재능 배우기", desc: "모은 코인으로 배우고 싶던 재능을 이용해요." },
];

/** SECTION 07. 서비스 이용 방법 (화이트 전체 폭 섹션) */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="border-y border-divider bg-surface">
      <div className="page-container py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-label text-secondary">HOW IT WORKS</p>
          <h2 id="how-title" className="mt-2 text-h1">
            돈 대신 시간으로, 이렇게 교환해요
          </h2>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="flex flex-col gap-3 rounded-lg bg-gray-100 p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-md bg-navy text-point">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="text-h2 text-gray-400" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-2 text-h3">
                <span className="sr-only">STEP {i + 1}. </span>
                {title}
              </h3>
              <p className="text-fg-secondary">{desc}</p>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-8 flex w-fit flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-navy px-6 py-3 text-center text-body-lg font-semibold text-white">
          1시간의 재능 공유 <span className="text-point" aria-hidden>=</span>
          <span className="sr-only">는</span> <span className="text-point">1 Time Coin</span>
        </p>
      </div>
    </section>
  );
}
