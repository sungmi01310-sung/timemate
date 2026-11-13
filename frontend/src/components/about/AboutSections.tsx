import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  Camera,
  ChefHat,
  Clock,
  Code2,
  Coins,
  GraduationCap,
  Handshake,
  HeartHandshake,
  House,
  Languages,
  Lock,
  MessagesSquare,
  RotateCcw,
  ShieldCheck,
  Sprout,
  Star,
  User,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Avatar, Badge, Reveal } from "@/components/common";
import { LogoMark } from "@/components/brand/Logo";
import { cx } from "@/lib/format";

/** 섹션 공통 제목 */
function Head({ id, eyebrow, title, lead, center, dark }: { id: string; eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <Reveal className={cx("max-w-2xl", center && "mx-auto text-center")}>
      <p className={cx("mb-4 text-label tracking-[0.06em]", dark ? "text-sub" : "text-secondary")}>{eyebrow}</p>
      <h2 id={id} className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.25] font-extrabold tracking-[-0.035em]">
        {title}
      </h2>
      {lead && <p className={cx("mt-5 text-body-lg leading-relaxed", dark ? "text-white/65" : "text-fg-muted", center && "mx-auto")}>{lead}</p>}
    </Reveal>
  );
}

const SECTION = "py-20 md:py-28";

/* ── SECTION 02. 소개 + 이럴 때 필요해요 ─────────────────── */

const NEEDS: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Code2, title: "코드 리뷰가 필요할 때", sub: "개발 · 포트폴리오 피드백" },
  { icon: ChefHat, title: "요리를 배우고 싶을 때", sub: "생활 노하우 나눔" },
  { icon: Camera, title: "사진을 잘 찍고 싶을 때", sub: "촬영 · 보정 팁" },
  { icon: House, title: "자취방 정리를 함께", sub: "혼자 하기 어려운 일" },
  { icon: Wrench, title: "가구 조립이 막힐 때", sub: "손이 필요한 순간" },
  { icon: Languages, title: "외국어 연습 상대가 필요할 때", sub: "온라인으로 가볍게" },
];

export function IntroSection() {
  return (
    <section aria-labelledby="intro-title" className={cx("bg-bg", SECTION)}>
      <div className="page-container">
        <Head
          id="intro-title"
          eyebrow="WHY TIMEMATE"
          center
          title={
            <>
              모든 사람의 시간에는{" "}
              <br />
              가치가 있습니다.
            </>
          }
          lead="누구나 누군가에게 가르쳐 줄 수 있는 재능이 있고, 누구나 새로운 것을 배울 기회가 필요합니다. 대단한 전문가가 아니어도 괜찮아요. TIMEMATE는 서로의 재능을 시간으로 연결합니다."
        />
        <ul className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {NEEDS.map(({ icon: Icon, title, sub }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 80}>
              <div className="flex h-full items-center gap-4 rounded-xl border border-divider bg-surface p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-gray-100 text-secondary">
                  <Icon size={22} aria-hidden />
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-body-sm text-fg-muted">{sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── SECTION 03. 이용 방법 (순환 다이어그램 + 4단계) ─────── */

function FlowArrow({ label, coin, plus }: { label: string; coin: string; plus: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1 md:px-2" aria-hidden>
      <span className="text-body-sm font-semibold whitespace-nowrap text-fg-secondary">{label}</span>
      <span className={cx("rounded-full px-2.5 py-0.5 text-caption font-extrabold", plus ? "bg-success-soft text-success" : "bg-sub-soft text-sub-strong")}>{coin}</span>
      {/* 모바일: 아래 화살표 / PC: 오른쪽 화살표 */}
      <ArrowRight size={20} className="mt-1 rotate-90 text-gray-400 md:rotate-0" />
    </div>
  );
}

function FlowNode({ icon, name, desc, tone }: { icon: React.ReactNode; name: string; desc: string; tone: "me" | "hub" | "other" }) {
  return (
    <div className="text-center">
      <div
        className={cx(
          "mx-auto mb-3 flex size-[72px] items-center justify-center rounded-2xl",
          tone === "hub" ? "bg-surface ring-1 ring-border" : tone === "me" ? "bg-point-soft text-point-strong" : "bg-sub-soft text-sub-strong",
        )}
      >
        {icon}
      </div>
      <p className="font-extrabold">{name}</p>
      <p className="text-body-sm text-fg-muted">{desc}</p>
    </div>
  );
}

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: UserPlus, title: "재능 등록", desc: "내가 잘하는 것을 소개하고 재능을 등록해요." },
  { icon: CalendarCheck, title: "매칭 및 예약", desc: "필요한 재능을 찾고 서로의 시간을 약속해요." },
  { icon: Handshake, title: "재능 교환", desc: "약속한 시간에 만나 재능과 경험을 나눠요." },
  { icon: Coins, title: "Time Coin 정산", desc: "서로 거래 완료를 확인하면 Time Coin이 정산돼요." },
];

export function HowSection() {
  return (
    <section id="how" tabIndex={-1} aria-labelledby="how-title" className={cx("scroll-mt-(--header-h) bg-surface outline-none", SECTION)}>
      <div className="page-container">
        <Head
          id="how-title"
          eyebrow="HOW IT WORKS"
          title="TIMEMATE는 이렇게 이용해요."
          lead="내가 배우고 싶은 재능과 상대의 재능이 정확히 맞지 않아도 괜찮아요. Time Coin이 서로 다른 사람의 시간을 연결합니다."
        />

        {/* 순환 다이어그램 */}
        <Reveal className="mt-12 rounded-2xl border border-divider bg-gray-50 px-6 py-10 md:px-10 md:py-14">
          <div
            role="img"
            aria-label="내가 영상 편집을 1시간 알려주면 1 Time Coin을 받고, 그 코인으로 다른 사람에게 React를 1시간 배울 수 있어요."
            className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]"
          >
            <FlowNode tone="me" icon={<User size={30} />} name="나" desc="재능을 제공해요" />
            <FlowArrow label="영상 편집 1시간" coin="+1 TC" plus />
            <FlowNode tone="hub" icon={<LogoMark size={30} title={null} />} name="TIMEMATE" desc="Time Coin 기록" />
            <FlowArrow label="React 1시간 신청" coin="−1 TC" plus={false} />
            <FlowNode tone="other" icon={<Users size={30} />} name="다른 사람" desc="재능을 제공해요" />
          </div>
          <p className="mt-9 text-center font-semibold">
            서로 직접 맞바꾸지 않아도, <span className="text-point-strong">시간이 사람 사이를 순환합니다.</span>
          </p>
        </Reveal>

        {/* 4단계 */}
        <ol className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal as="li" key={title} delay={i * 80} className="flex gap-4 lg:flex-col lg:gap-0">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-navy text-point lg:mb-4">
                <Icon size={22} aria-hidden />
              </span>
              <div>
                <p className="text-label tracking-wide text-secondary">STEP {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-h3">{title}</h3>
                <p className="mt-1.5 text-fg-secondary">{desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── SECTION 04. Time Coin (설명용 UI — 실제 코인 처리 없음) ── */

const TIERS = [
  { give: "1시간 제공", coin: 1 },
  { give: "2시간 제공", coin: 2 },
  { give: "3시간 제공", coin: 3 },
];

const LIFECYCLE: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lock, title: "거래 확정 시 LOCK", desc: "신청한 사람의 필요한 코인을 잠가 두어 약속을 지켜요." },
  { icon: Wallet, title: "완료 확인 후 정산", desc: "양쪽이 거래 완료를 확인하면 제공자에게 정산돼요." },
  { icon: RotateCcw, title: "취소 시 반환", desc: "거래가 취소되면 취소 정책에 따라 코인이 반환돼요." },
];

export function TimeCoinSection() {
  return (
    <section aria-labelledby="coin-intro-title" className={cx("overflow-hidden bg-navy text-white", SECTION)}>
      <div className="page-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Head
              id="coin-intro-title"
              eyebrow="TIME COIN"
              dark
              title={
                <>
                  시간이 새로운{" "}
                  <br />
                  교환의 기준이 됩니다.
                </>
              }
              lead="재능을 제공한 시간만큼 Time Coin을 얻고, 모은 코인으로 다른 사람의 재능을 이용할 수 있습니다."
            />
            <Reveal className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-4 text-body-sm text-white/70">
              Time Coin은 현금이 아닌, <b className="text-white">TIMEMATE 안에서 시간을 교환하는 단위</b>예요. 실제로 누군가에게 시간을 나눴을 때 쌓입니다.
            </Reveal>
          </div>

          <Reveal className="flex flex-col gap-3">
            {TIERS.map((t) => (
              <div key={t.give} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 md:gap-5 md:px-6">
                <span className="w-20 shrink-0 font-bold text-white/85">{t.give}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
                  <span className="block h-full rounded-full bg-point" style={{ width: `${(t.coin / 3) * 100}%` }} />
                </span>
                <span className="w-16 shrink-0 text-right text-h2">
                  {t.coin}
                  <span className="ml-1 text-caption text-sub">TC</span>
                </span>
              </div>
            ))}
            <div className="mt-2 grid grid-cols-1 gap-2 text-body-sm sm:grid-cols-2">
              <p className="rounded-lg bg-secondary px-4 py-3">
                디자인을 2시간 알려주면 <b className="text-point">+2 TC 적립</b>
              </p>
              <p className="rounded-lg bg-secondary px-4 py-3">
                영어 회화를 1시간 배우면 <b className="text-sub">−1 TC 사용</b>
              </p>
            </div>
          </Reveal>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-3 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-4">
          {LIFECYCLE.map(({ icon: Icon, title, desc }, i) => (
            <Reveal as="li" key={title} delay={i * 80} className="flex gap-4 rounded-xl border border-white/10 p-5">
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
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── SECTION 05. 핵심 가치 ───────────────────────────────── */

const VALUES = [
  { no: "01", icon: Clock, name: "시간의 가치", title: "모든 사람의 한 시간은 소중합니다.", desc: "재능의 종류와 관계없이 공유한 시간을 기준으로 가치를 기록합니다." },
  { no: "02", icon: Sprout, name: "서로의 성장", title: "가르치는 사람도, 배우는 사람도 함께 성장합니다.", desc: "서로의 경험을 나누며 새로운 가능성을 발견합니다." },
  { no: "03", icon: ShieldCheck, name: "신뢰하는 교환", title: "약속한 시간을 안전하게 관리합니다.", desc: "거래 상태와 완료 확인을 기반으로 Time Coin 정산을 관리합니다." },
];

export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className={cx("bg-surface", SECTION)}>
      <div className="page-container">
        <Head id="values-title" eyebrow="OUR VALUES" title="TIMEMATE가 지키는 가치" center />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ no, icon: Icon, name, title, desc }, i) => (
            <Reveal as="li" key={no} delay={i * 80} className={cx("flex flex-col rounded-2xl bg-gray-100 p-7", i === 2 && "sm:col-span-2 lg:col-span-1")}>
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
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── SECTION 06. 세 가지 공간 ────────────────────────────── */

const SPACES = [
  {
    badge: "재능 교환",
    tone: "accent" as const,
    title: "시간을 직접 나눠요",
    desc: "내가 제공할 수 있는 재능을 등록하고 신청을 받아요. 온라인부터 우리 동네까지 1:1로 재능을 주고받습니다.",
    tags: ["React", "피그마", "영상 편집", "외국어", "통기타"],
    href: "/talents",
    cta: "재능 찾아보기",
    ready: true,
  },
  {
    badge: "커뮤니티",
    tone: "info" as const,
    title: "경험을 가볍게 나눠요",
    desc: "교환 후기, 배움 팁, 궁금한 점을 자유롭게 나누며 관심사가 비슷한 사람들과 이어져요.",
    tags: ["교환 후기", "재능 이야기", "질문"],
    href: "/community",
    cta: "커뮤니티 둘러보기",
    ready: false,
  },
  {
    badge: "모임 · 챌린지",
    tone: "warning" as const,
    title: "함께 시간을 보내요",
    desc: "같은 목표를 가진 사람들과 모임을 만들고, 챌린지로 서로 응원하며 꾸준히 해내요.",
    tags: ["스터디 모임", "운동 챌린지", "독서 인증"],
    href: "/community/groups",
    cta: "모임 보러 가기",
    ready: false,
  },
];

export function SpacesSection() {
  return (
    <section aria-labelledby="spaces-title" className={cx("bg-bg", SECTION)}>
      <div className="page-container">
        <Head id="spaces-title" eyebrow="SERVICES" title="세 가지 방법으로 시간을 나눠요" />
        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {SPACES.map((s, i) => (
            <Reveal as="li" key={s.badge} delay={i * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-divider bg-surface p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Badge tone={s.tone}>{s.badge}</Badge>
                  {!s.ready && <span className="text-caption text-fg-muted">오픈 준비 중</span>}
                </div>
                <h3 className="mt-5 text-h2">{s.title}</h3>
                <p className="mt-2.5 flex-1 text-fg-secondary">{s.desc}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-sm bg-gray-100 px-2.5 py-1 text-body-sm font-medium text-fg-secondary">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href={s.href} className="mt-6 inline-flex items-center gap-1 self-start rounded-sm font-bold text-fg transition-colors hover:text-secondary">
                  {s.cta}
                  <ArrowRight size={16} />
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── SECTION 08. 신뢰 ───────────────────────────────────── */

const TRUST: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Star, title: "후기와 평점", desc: "거래가 끝난 사람만 후기를 남겨요. 재능과 제공자의 평점을 한눈에 확인할 수 있어요." },
  { icon: BadgeCheck, title: "투명한 활동 기록", desc: "받은 후기 수와 완료한 거래 수를 프로필에 보여줘 믿고 선택할 수 있어요." },
  { icon: Lock, title: "Time Coin LOCK", desc: "거래가 확정되면 코인을 잠가 두고, 양쪽이 완료를 확인해야 정산되도록 설계하고 있어요." },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className={cx("bg-surface", SECTION)}>
      <div className="page-container grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <Head
            id="trust-title"
            eyebrow="TRUST & SAFETY"
            title={
              <>
                안심하고{" "}
                <br />
                시간을 나눌 수 있게
              </>
            }
          />
          <ul className="mt-9 flex flex-col gap-6">
            {TRUST.map(({ icon: Icon, title, desc }, i) => (
              <Reveal as="li" key={title} delay={i * 80} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-secondary ring-1 ring-divider">
                  <Icon size={20} aria-hidden />
                </span>
                <div>
                  <h3 className="text-h4">{title}</h3>
                  <p className="mt-0.5 text-fg-secondary">{desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* 예시 프로필 카드 (설명용) */}
        <Reveal>
          <figure className="rounded-2xl border border-divider bg-surface p-7 shadow-md">
            <figcaption className="mb-5 text-caption font-semibold tracking-wide text-fg-muted">예시 · 제공자 프로필</figcaption>
            <div className="flex items-center gap-4">
              <Avatar name="지우의편집실" size={56} />
              <div>
                <p className="text-h3">지우의편집실</p>
                <p className="text-body-sm text-fg-muted">영상 편집 · 온라인</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["4.9", "평점"],
                ["31", "받은 후기"],
                ["27", "완료 거래"],
                ["2시간", "1회 진행"],
              ].map(([v, l]) => (
                <div key={l} className="flex flex-col-reverse rounded-lg bg-gray-100 px-2 py-3.5 text-center">
                  <dt className="text-caption text-fg-muted">{l}</dt>
                  <dd className="text-h3">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-2.5 rounded-lg bg-navy px-4 py-3 text-body-sm text-white/80">
              <Lock size={16} className="shrink-0 text-point" aria-hidden />
              거래 확정 — <b className="text-point">2 TC</b>가 거래 완료까지 잠겨 있어요
            </p>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ── SECTION 09. 이런 분들에게 추천해요 ──────────────────── */

const PERSONAS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: BookOpen, title: "새로운 기술을 배우고 싶은 분", desc: "코딩, 디자인, 외국어처럼 미뤄 둔 배움을 시작해 보세요." },
  { icon: GraduationCap, title: "내 재능을 나누고 싶은 분", desc: "작은 노하우도 누군가에게는 큰 도움이 돼요." },
  { icon: HeartHandshake, title: "비용 부담 없이 경험을 교환하고 싶은 분", desc: "현금 대신 시간으로 서로의 경험을 주고받아요." },
  { icon: MessagesSquare, title: "새로운 사람들과 함께 성장하고 싶은 분", desc: "관심사가 비슷한 사람을 만나 함께 배워요." },
];

export function PersonaSection() {
  return (
    <section aria-labelledby="persona-title" className={cx("bg-bg", SECTION)}>
      <div className="page-container">
        <Head id="persona-title" eyebrow="FOR YOU" title="이런 분들에게 추천해요" center />
        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {PERSONAS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal as="li" key={title} delay={(i % 2) * 80} className="flex items-start gap-4 rounded-xl border border-divider bg-surface p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-point-soft text-point-strong">
                <Icon size={22} aria-hidden />
              </span>
              <div>
                <h3 className="text-h4">{title}</h3>
                <p className="mt-1 text-fg-secondary">{desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

