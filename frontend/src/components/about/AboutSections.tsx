import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Clock,
  Coins,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sprout,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cx } from "@/lib/format";

/** 섹션 공통 제목 (가운데/왼쪽 정렬) */
function SectionTitle({ id, eyebrow, title, align = "center" }: { id: string; eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={cx("mb-10 md:mb-12", align === "center" && "mx-auto max-w-2xl text-center")}>
      <p className="text-label tracking-wide text-secondary">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-h1">
        {title}
      </h2>
    </div>
  );
}

/* ── SECTION 02. TIMEMATE 소개 ───────────────────────────── */

const BELIEFS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: GraduationCap, title: "누구나 가르칠 수 있는 재능이 있어요", desc: "업무 노하우, 취미, 외국어처럼 작아 보이는 경험도 누군가에게는 꼭 필요한 배움이에요." },
  { icon: BookOpen, title: "누구나 배울 기회가 필요해요", desc: "비용 부담 때문에 미뤄 둔 배움을 시간으로 시작할 수 있어요." },
  { icon: Clock, title: "TIMEMATE는 그 둘을 시간으로 연결해요", desc: "나눈 시간만큼 새로운 배움의 기회를 얻는 구조예요." },
];

export function IntroSection() {
  return (
    <section aria-labelledby="intro-title" className="page-container py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div>
          <p className="text-label tracking-wide text-secondary">ABOUT TIMEMATE</p>
          <h2 id="intro-title" className="mt-2 text-h1">
            모든 사람의 시간에는{" "}
            <br />
            가치가 있습니다.
          </h2>
          <p className="mt-5 text-body-lg text-fg-secondary">
            TIMEMATE는 서로의 재능을 <strong className="text-fg">시간으로 연결</strong>합니다. 내가 가진 경험과 지식을 나누고, 그 시간만큼 새로운 배움의 기회를 얻을 수 있습니다.
          </p>
          <blockquote className="mt-8 border-l-4 border-point pl-5 text-h3 text-fg">
            “가르치는 1시간과 배우는 1시간은
            <br className="hidden sm:block" /> 같은 가치를 가집니다.”
          </blockquote>
        </div>
        <ul className="flex flex-col gap-3">
          {BELIEFS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-4 rounded-lg border border-divider bg-surface p-5 md:p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-gray-100 text-secondary">
                <Icon size={22} aria-hidden />
              </span>
              <div>
                <h3 className="text-h4">{title}</h3>
                <p className="mt-1 text-fg-secondary">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── SECTION 03. 핵심 가치 ───────────────────────────────── */

const VALUES = [
  { no: "01", icon: Clock, name: "시간의 가치", title: "모든 사람의 한 시간은 소중합니다.", desc: "재능의 종류와 관계없이 공유한 시간을 기준으로 가치를 기록합니다." },
  { no: "02", icon: Sprout, name: "서로의 성장", title: "가르치는 사람도, 배우는 사람도 함께 성장합니다.", desc: "서로의 경험을 나누며 새로운 가능성을 발견합니다." },
  {
    no: "03",
    icon: ShieldCheck,
    name: "신뢰하는 교환",
    title: "약속한 시간을 안전하게 관리합니다.",
    desc: "거래 상태와 완료 확인을 기반으로 Time Coin 정산을 관리합니다.",
    note: "거래 확정·완료 확인·정산 기능은 순차적으로 제공될 예정이에요.",
  },
];

export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className="border-y border-divider bg-surface">
      <div className="page-container py-16 md:py-24">
        <SectionTitle id="values-title" eyebrow="OUR VALUES" title="TIMEMATE가 지키는 가치" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ no, icon: Icon, name, title, desc, note }, i) => (
            <li key={no} className={cx("flex flex-col rounded-xl bg-gray-100 p-7", i === 2 && "sm:col-span-2 lg:col-span-1")}>
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-md bg-navy text-point">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="text-h2 text-gray-400" aria-hidden>
                  {no}
                </span>
              </div>
              <p className="mt-6 text-label text-secondary">{name}</p>
              <h3 className="mt-1.5 text-h3">{title}</h3>
              <p className="mt-2 text-fg-secondary">{desc}</p>
              {note && <p className="mt-4 border-t border-divider pt-3 text-caption font-normal text-fg-muted">※ {note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── SECTION 04. 이용 방법 ───────────────────────────────── */

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: UserPlus, title: "재능 등록", desc: "내가 잘하는 것을 소개하고 재능을 등록해요." },
  { icon: CalendarCheck, title: "매칭 및 예약", desc: "필요한 재능을 찾고 서로의 시간을 약속해요." },
  { icon: Handshake, title: "재능 교환", desc: "약속한 시간에 만나 재능과 경험을 나눠요." },
  { icon: Coins, title: "Time Coin 정산", desc: "서로 거래 완료를 확인하면 Time Coin이 정산돼요." },
];

/** PC: 가로 4단계(화살표 연결) / 모바일: 세로 타임라인 */
export function HowSection() {
  return (
    <section id="how" tabIndex={-1} aria-labelledby="how-title" className="page-container scroll-mt-[calc(var(--header-h)+16px)] py-16 outline-none md:py-24">
      <SectionTitle id="how-title" eyebrow="HOW IT WORKS" title="TIMEMATE는 이렇게 이용해요." />
      <ol className="grid grid-cols-1 gap-0 lg:grid-cols-4 lg:gap-6">
        {STEPS.map(({ icon: Icon, title, desc }, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={title} className="relative flex gap-5 pb-8 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0">
              {/* 모바일 세로 연결선 */}
              {!last && <span className="absolute top-14 bottom-0 left-7 w-px bg-border lg:hidden" aria-hidden />}
              <div className="relative flex shrink-0 items-center lg:mb-6">
                <span className="relative z-1 flex size-14 items-center justify-center rounded-full bg-navy text-point">
                  <Icon size={24} aria-hidden />
                </span>
                {/* PC 가로 연결선 + 화살표 */}
                {!last && (
                  <span className="ml-3 hidden flex-1 items-center text-border-strong lg:flex" aria-hidden>
                    <span className="h-px flex-1 bg-border" />
                    <ArrowRight size={16} className="-ml-1" />
                  </span>
                )}
              </div>
              <div className="pt-2 lg:pt-0">
                <p className="text-label text-secondary">STEP {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-h3">{title}</h3>
                <p className="mt-1.5 text-fg-secondary">{desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ── SECTION 05. Time Coin 소개 (설명용 UI — 실제 코인 처리 없음) ── */

const EXAMPLES = [
  { label: "디자인을 2시간 알려주면", coin: "+2 TC", tone: "earn", sub: "적립" },
  { label: "영어 회화를 1시간 배우면", coin: "−1 TC", tone: "spend", sub: "사용" },
] as const;

const LIFECYCLE: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lock, title: "거래 확정 시 LOCK", desc: "신청한 사람의 필요한 코인을 잠가 두어 약속을 지켜요." },
  { icon: Wallet, title: "완료 확인 후 정산", desc: "양쪽이 거래 완료를 확인하면 제공자에게 코인이 정산돼요." },
  { icon: RotateCcw, title: "취소 시 반환", desc: "거래가 취소되면 취소 정책에 따라 잠긴 코인이 반환돼요." },
];

export function TimeCoinSection() {
  return (
    <section aria-labelledby="coin-intro-title" className="bg-navy text-white">
      <div className="page-container py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-label tracking-wide text-sub">TIME COIN</p>
            <h2 id="coin-intro-title" className="mt-2 text-h1">
              시간이 새로운{" "}
              <br />
              교환의 기준이 됩니다.
            </h2>
            <p className="mt-6 text-[40px] leading-tight font-extrabold tracking-[-0.02em] md:text-[52px]">
              1시간 <span className="text-white/40">=</span> <span className="text-point">1 Time Coin</span>
            </p>
            <p className="mt-5 text-body-lg text-white/70">
              재능을 제공한 시간만큼 Time Coin을 얻고,
              <br className="hidden sm:block" /> 모은 코인으로 다른 사람의 재능을 이용할 수 있습니다.
            </p>
            <p className="mt-4 inline-flex rounded-md bg-white/[0.06] px-4 py-3 text-body-sm text-white/70">
              Time Coin은 현금이 아닌, TIMEMATE 안에서 시간을 교환하는 단위예요.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-body-sm font-semibold text-white/50">예시</p>
            {EXAMPLES.map((e) => (
              <div key={e.label} className="flex items-center justify-between gap-4 rounded-lg bg-secondary px-5 py-4">
                <span className="text-body-lg">{e.label}</span>
                <span className="shrink-0 text-right">
                  <span className={cx("block text-h2", e.tone === "earn" ? "text-point" : "text-sub")}>{e.coin}</span>
                  <span className="text-caption text-white/50">{e.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-3 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-4">
          {LIFECYCLE.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="flex gap-4 rounded-lg border border-white/10 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-point">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold">
                  <span className="mr-1.5 text-white/40">{i + 1}.</span>
                  {title}
                </h3>
                <p className="mt-1 text-body-sm text-white/60">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── SECTION 06. 이런 분들에게 추천해요 ──────────────────── */

const PERSONAS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: BookOpen, title: "새로운 기술을 배우고 싶은 분", desc: "코딩, 디자인, 외국어처럼 미뤄 둔 배움을 시작해 보세요." },
  { icon: GraduationCap, title: "내 재능을 나누고 싶은 분", desc: "작은 노하우도 누군가에게는 큰 도움이 돼요." },
  { icon: HeartHandshake, title: "비용 부담 없이 경험을 교환하고 싶은 분", desc: "현금 대신 시간으로 서로의 경험을 주고받아요." },
  { icon: Users, title: "새로운 사람들과 함께 성장하고 싶은 분", desc: "관심사가 비슷한 사람을 만나 함께 배워요." },
];

export function PersonaSection() {
  return (
    <section aria-labelledby="persona-title" className="page-container py-16 md:py-24">
      <SectionTitle id="persona-title" eyebrow="FOR YOU" title="이런 분들에게 추천해요" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {PERSONAS.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex items-start gap-4 rounded-lg border border-divider bg-surface p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-point-soft text-point-strong">
              <Icon size={22} aria-hidden />
            </span>
            <div>
              <h3 className="text-h4">{title}</h3>
              <p className="mt-1 text-fg-secondary">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
