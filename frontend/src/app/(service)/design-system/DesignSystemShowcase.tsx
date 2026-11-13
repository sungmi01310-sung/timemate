"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Copy, Inbox, LogOut, Mail, Pencil, Plus, Search, Send, Settings, Trash2 } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  ConfirmModal,
  Dropdown,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  Pagination,
  PasswordInput,
  Rating,
  SearchInput,
  SectionHeader,
  Select,
  Skeleton,
  SkeletonText,
  Spinner,
  Tabs,
  Textarea,
  Tooltip,
  type BadgeTone,
} from "@/components/common";
import {
  Calendar,
  ChatMessage,
  CoinCard,
  NotificationItem,
  PostCard,
  ProfileCard,
  ProfileCardSkeleton,
  ReviewCard,
  TalentCard,
  TalentCardSkeleton,
  TalentImage,
  TradeStatusBadge,
  type DateKey,
} from "@/components/domain";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/authStore";
import { useWallet, useWalletStore } from "@/store/walletStore";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "@/store/toastStore";
import { getHealth } from "@/lib/api/health";
import { API_BASE_URL, USE_MOCK } from "@/lib/api/client";
import { cx } from "@/lib/format";
import { CATEGORIES, type Post, type TradeStatus } from "@/types";
import { ME_ID, mockMessages, mockPosts, mockReviews, mockTalents, mockUsers } from "@/mocks/data";

const userById = (id: string) => mockUsers.find((u) => u.id === id)!;

/* ── 문서용 데이터 ───────────────────────────────────────── */
const BRAND = [
  { name: "Main", hex: "#1D2129", cls: "bg-navy", token: "navy / primary", use: "헤더, 기본 버튼, 주요 텍스트" },
  { name: "Point", hex: "#34F5C6", cls: "bg-point", token: "point / accent", use: "핵심 CTA, 코인 수치" },
  { name: "Sub Point", hex: "#1DCEF6", cls: "bg-sub", token: "sub", use: "포커스 링, 보조 강조" },
  { name: "Secondary", hex: "#2F455B", cls: "bg-secondary", token: "secondary", use: "강조 카드 보조 영역" },
  { name: "White", hex: "#FFFFFF", cls: "bg-surface", token: "surface", use: "카드, 입력창 배경" },
  { name: "Gray", hex: "#F5F6F8", cls: "bg-bg", token: "bg", use: "페이지 배경" },
];

const SEMANTIC: { group: string; items: { cls: string; label: string; text?: boolean }[] }[] = [
  {
    group: "Text",
    items: [
      { cls: "text-fg", label: "fg (Primary)", text: true },
      { cls: "text-fg-secondary", label: "fg-secondary", text: true },
      { cls: "text-fg-muted", label: "fg-muted", text: true },
      { cls: "text-fg-disabled", label: "fg-disabled", text: true },
    ],
  },
  {
    group: "Border",
    items: [
      { cls: "bg-border-strong", label: "border-strong" },
      { cls: "bg-border", label: "border" },
      { cls: "bg-divider", label: "divider" },
    ],
  },
  {
    group: "Status",
    items: [
      { cls: "bg-success", label: "success" },
      { cls: "bg-warning", label: "warning" },
      { cls: "bg-error", label: "error" },
      { cls: "bg-info", label: "info" },
    ],
  },
];

const TYPE_SCALE = [
  { cls: "text-display", label: "Display", spec: "36 / 30 / 26 · 700", sample: "당신의 시간은 소중하고 가치 있다" },
  { cls: "text-h1", label: "H1", spec: "28 / 24 / 22 · 700", sample: "재능을 나누고 시간을 모아요" },
  { cls: "text-h2", label: "H2", spec: "22 / 21 / 20 · 700", sample: "추천 재능" },
  { cls: "text-h3", label: "H3", spec: "18 · 600", sample: "프리미어 프로로 브이로그 편집 끝내기" },
  { cls: "text-h4", label: "H4", spec: "16 · 600", sample: "거래 정보" },
  { cls: "text-body-lg", label: "Body L", spec: "16 · 400", sample: "1시간을 제공하면 1 Time Coin이 적립돼요." },
  { cls: "text-body-md", label: "Body M", spec: "15 · 400", sample: "1시간을 제공하면 1 Time Coin이 적립돼요." },
  { cls: "text-body-sm", label: "Body S", spec: "13 · 400", sample: "평일 저녁 · 온라인" },
  { cls: "text-caption", label: "Caption", spec: "12 · 400", sample: "3분 전" },
  { cls: "text-button", label: "Button", spec: "15 · 600", sample: "재능 신청하기" },
  { cls: "text-label", label: "Label", spec: "13 · 600", sample: "이메일" },
];

const STATUSES: TradeStatus[] = ["requested", "accepted", "confirmed", "in_progress", "completion_requested", "completed", "cancelled", "rejected"];
const BADGES: BadgeTone[] = ["neutral", "navy", "accent", "info", "success", "warning", "error"];

const TOC = [
  ["colors", "컬러"],
  ["type", "타이포"],
  ["layout", "레이아웃"],
  ["logo", "로고"],
  ["buttons", "버튼"],
  ["inputs", "입력"],
  ["ui", "UI"],
  ["overlay", "모달·토스트"],
  ["loading", "로딩·빈 상태"],
  ["service", "서비스 카드"],
  ["coin", "Time Coin"],
  ["etc", "채팅·알림·캘린더"],
  ["api", "API"],
];

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--header-h)+64px)] pt-12">
      <SectionHeader title={title} description={desc} />
      {children}
    </section>
  );
}

const Row = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cx("flex flex-wrap items-center gap-2", className)}>{children}</div>;
const Label = ({ children }: { children: ReactNode }) => <p className="mb-2 text-label text-fg-muted">{children}</p>;

export function DesignSystemShowcase() {
  const user = useAuthStore((s) => s.user);

  /* 입력 데모 */
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("타임메이트");
  const [query, setQuery] = useState("");
  const [intro, setIntro] = useState("");
  const [category, setCategory] = useState("");
  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "올바른 이메일 형식이 아니에요." : undefined;
  const nicknameOk = nickname.trim().length >= 2 ? "사용 가능한 닉네임이에요." : undefined;
  const nicknameErr = nickname && nickname.trim().length < 2 ? "닉네임은 2자 이상이어야 해요." : undefined;

  /* 선택 데모 */
  const [chips, setChips] = useState<string[]>(["dev"]);
  const [tab, setTab] = useState<"all" | "progress" | "done">("all");
  const [pill, setPill] = useState<"latest" | "popular" | "rating">("latest");
  const [page, setPage] = useState(3);
  const [date, setDate] = useState<DateKey | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  /* 오버레이 · 로딩 */
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [skeleton, setSkeleton] = useState(true);

  /* 코인 원장 데모 [MOCK] */
  const wallet = useWallet(user?.id);
  const ledger = useWalletStore();
  const [seq, setSeq] = useState(1);
  const tradeId = `tr_demo_${seq}`;
  const tradeState = ledger.settledTradeIds.includes(tradeId) ? "정산 완료" : ledger.locks[tradeId] ? "코인 잠금 중" : "확정 전";

  /* 알림 */
  const notifications = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const removeNoti = useNotificationStore((s) => s.remove);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  /* API */
  const [health, setHealth] = useState("확인 전");

  const runLedger = (action: "lock" | "settle" | "release") => {
    if (!user) return;
    const r =
      action === "lock"
        ? ledger.lock({ tradeId, userId: user.id, amount: 1 })
        : action === "settle"
          ? ledger.settle({ tradeId, providerId: "u_jiwoo" })
          : ledger.release(tradeId);
    if (r.ok) toast.success(action === "lock" ? "1 TC가 잠금 처리되었어요." : action === "settle" ? "정산이 완료되었어요." : "잠금이 해제되었어요.");
    else toast.error(r.message);
  };

  const checkHealth = async () => {
    setHealth("확인 중…");
    try {
      const res = await getHealth();
      setHealth(`연결됨 · ${res.service}`);
    } catch {
      setHealth("연결 실패 (backend 서버를 실행하세요)");
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="디자인 시스템"
        description="TimeMate 공통 토큰과 컴포넌트입니다. 모든 페이지는 이 컴포넌트를 조합해서 만듭니다."
        actions={<Badge tone="info">STEP 2</Badge>}
      />

      <nav aria-label="목차" className="sticky top-(--header-h) z-10 -mx-(--gutter) flex gap-1.5 overflow-x-auto bg-bg px-(--gutter) py-2.5 [scrollbar-width:none]">
        {TOC.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-divider bg-surface px-3 py-1.5 text-body-sm font-semibold text-fg-secondary hover:border-navy hover:text-fg">
            {label}
          </a>
        ))}
      </nav>

      {/* ── Colors ─────────────────────────────── */}
      <Section id="colors" title="컬러" desc="배경은 화이트·연한 그레이, 다크 네이비는 헤더·강조 영역, 민트는 CTA·핵심 수치에만">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {BRAND.map((c) => (
            <Card key={c.name} className="flex flex-col gap-0.5 p-3! text-body-sm">
              <div className={cx("mb-2.5 h-[72px] rounded-md ring-1 ring-navy/10 ring-inset", c.cls)} />
              <strong>{c.name}</strong>
              <code>{c.hex}</code>
              <code className="text-[11px] text-fg-muted">{c.token}</code>
              <span className="mt-1 text-caption font-normal text-fg-muted">{c.use}</span>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {SEMANTIC.map((g) => (
            <Card key={g.group}>
              <Label>{g.group}</Label>
              <ul className="flex flex-col gap-2">
                {g.items.map((it) => (
                  <li key={it.label} className="flex items-center gap-3 text-body-sm">
                    {it.text ? <span className={cx("w-6 text-center font-bold", it.cls)}>Aa</span> : <span className={cx("size-6 rounded-sm", it.cls)} />}
                    <code>{it.label}</code>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Typography ─────────────────────────── */}
      <Section id="type" title="타이포그래피" desc="Pretendard · 크기는 PC / 태블릿 / 모바일 순 (Display·H1·H2만 반응형)">
        <Card className="flex flex-col divide-y divide-divider py-2!">
          {TYPE_SCALE.map((t) => (
            <div key={t.label} className="grid grid-cols-1 gap-1 py-3 md:grid-cols-[140px_1fr] md:items-baseline md:gap-4">
              <div>
                <code className="text-body-sm font-semibold">{t.label}</code>
                <p className="text-caption text-fg-muted">{t.spec}</p>
              </div>
              <span className={t.cls}>{t.sample}</span>
            </div>
          ))}
        </Card>
      </Section>

      {/* ── Layout ─────────────────────────────── */}
      <Section id="layout" title="레이아웃 · 간격" desc="콘텐츠 최대 1280px · 4px 간격 스케일 · Tailwind 기본 breakpoint">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card>
            <Label>Breakpoint</Label>
            <ul className="flex flex-col gap-2 text-body-sm">
              <li><Badge>기본</Badge> 0 ~ 767px · 모바일 · 1단, 하단 탭, 좌우 여백 16px</li>
              <li><Badge tone="info">md</Badge> 768 ~ 1023px · 태블릿 · 유동 그리드, 하단 탭, 여백 24px</li>
              <li><Badge tone="navy">lg</Badge> 1024px ~ · PC · 헤더 메뉴, 사이드바, 여백 32px</li>
            </ul>
          </Card>
          <Card>
            <Label>Spacing (1 = 4px)</Label>
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                <div key={n} className="flex items-center gap-3 text-caption">
                  <code className="w-20 shrink-0">{n} · {n * 4}px</code>
                  <span className="h-2.5 rounded-full bg-sub" style={{ width: n * 4 }} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Label>Radius</Label>
            <Row className="gap-4">
              {["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-full"].map((r) => (
                <div key={r} className="flex flex-col items-center gap-1.5">
                  <span className={cx("size-12 border-2 border-navy bg-gray-100", r)} />
                  <code className="text-[11px]">{r.replace("rounded-", "")}</code>
                </div>
              ))}
            </Row>
          </Card>
          <Card>
            <Label>Shadow (최소 사용)</Label>
            <Row className="gap-4">
              {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1.5">
                  <span className={cx("size-14 rounded-md bg-surface", s)} />
                  <code className="text-[11px]">{s}</code>
                </div>
              ))}
            </Row>
          </Card>
        </div>
      </Section>

      {/* ── Logo ───────────────────────────────── */}
      <Section id="logo" title="로고" desc="T의 가로획(시간의 흐름)과 세로획이 M의 중심에 맞닿는 '교환'의 지점">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card className="flex min-h-36 items-center justify-center">
            <Logo href={null} size={40} />
          </Card>
          <Card tone="navy" className="flex min-h-36 items-center justify-center">
            <Logo href={null} size={40} inverse />
          </Card>
          <Card className="flex min-h-36 items-center justify-center gap-4">
            <LogoMark size={64} />
            <LogoMark size={40} />
            <LogoMark size={24} />
            <LogoMark size={16} />
          </Card>
        </div>
      </Section>

      {/* ── Buttons ────────────────────────────── */}
      <Section id="buttons" title="버튼" desc="Hover · Active(눌림) · Focus(Tab 키) · Disabled · Loading">
        <Card className="flex flex-col gap-5">
          <div>
            <Label>Variant</Label>
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent CTA</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </Row>
          </div>
          <div>
            <Label>State</Label>
            <Row>
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
              <Button
                variant="accent"
                loading={loadingBtn}
                onClick={() => {
                  setLoadingBtn(true);
                  setTimeout(() => setLoadingBtn(false), 1500);
                }}
              >
                {loadingBtn ? "처리 중" : "로딩 테스트"}
              </Button>
              <Button loading>Loading</Button>
            </Row>
          </div>
          <div>
            <Label>Icon · Link · Size</Label>
            <Row>
              <Button variant="outline" leftIcon={<Plus size={16} />}>
                재능 등록
              </Button>
              <Button href="/talents" rightIcon={<ArrowRight size={16} />}>
                링크 버튼
              </Button>
              <Tooltip content="검색">
                <Button variant="secondary" iconOnly aria-label="검색">
                  <Search size={18} />
                </Button>
              </Tooltip>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
          </div>
          <Button variant="accent" size="lg" fullWidth>
            Full width · 재능 신청하기
          </Button>
        </Card>
      </Section>

      {/* ── Inputs ─────────────────────────────── */}
      <Section id="inputs" title="입력" desc="Default · Focus · Error · Success · Disabled · Search · Password">
        <Card className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="이메일"
            required
            type="email"
            placeholder="you@timemate.kr"
            leftIcon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            hint="로그인에 사용할 이메일을 입력하세요."
          />
          <PasswordInput label="비밀번호" required placeholder="8자 이상 입력" hint="영문, 숫자를 포함해 8자 이상" />
          <Input label="닉네임 (검증)" value={nickname} onChange={(e) => setNickname(e.target.value)} success={nicknameOk} error={nicknameErr} />
          <SearchInput label="검색" value={query} onValueChange={setQuery} onSearch={(q) => toast.info(q ? `"${q}" 검색` : "검색어를 입력하세요")} placeholder="배우고 싶은 재능을 검색해 보세요" />
          <Input label="오류 상태" defaultValue="abc" error="비밀번호는 8자 이상이어야 해요." />
          <Input label="비활성" value="수정할 수 없어요" disabled readOnly />
          <Select
            label="카테고리"
            placeholder="카테고리를 선택하세요"
            options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Select label="비활성 선택" disabled options={[{ value: "1", label: "1시간 (1 TC)" }]} />
          <div className="md:col-span-2">
            <Textarea label="신청 메시지" placeholder="제공자에게 전할 메시지를 입력하세요" maxLength={300} showCount value={intro} onChange={(e) => setIntro(e.target.value)} />
          </div>
        </Card>
      </Section>

      {/* ── UI ─────────────────────────────────── */}
      <Section id="ui" title="UI 컴포넌트" desc="Badge · Tabs(← → 키) · Chip · Dropdown(↑ ↓ 키) · Tooltip · Pagination · Avatar · Card">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="flex flex-col gap-4">
            <Label>Badge</Label>
            <Row>
              {BADGES.map((t) => (
                <Badge key={t} tone={t}>
                  {t}
                </Badge>
              ))}
            </Row>
            <Row>
              {STATUSES.map((s) => (
                <TradeStatusBadge key={s} status={s} />
              ))}
            </Row>
          </Card>
          <Card className="flex flex-col gap-4">
            <Label>Tabs</Label>
            <Tabs
              ariaLabel="거래 상태"
              value={tab}
              onChange={setTab}
              items={[
                { value: "all", label: "전체", count: 12 },
                { value: "progress", label: "진행 중", count: 2 },
                { value: "done", label: "완료", count: 10 },
              ]}
            />
            <Tabs
              variant="pill"
              ariaLabel="정렬"
              value={pill}
              onChange={setPill}
              items={[
                { value: "latest", label: "최신순" },
                { value: "popular", label: "인기순" },
                { value: "rating", label: "평점순" },
              ]}
            />
          </Card>
          <Card className="flex flex-col gap-3">
            <Label>Chip (다중 선택 필터)</Label>
            <Row>
              {CATEGORIES.map((c) => (
                <Chip key={c.id} selected={chips.includes(c.id)} onClick={() => setChips((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]))}>
                  {c.label}
                </Chip>
              ))}
              <Chip disabled>비활성</Chip>
            </Row>
          </Card>
          <Card className="flex flex-col gap-3">
            <Label>Dropdown · Tooltip</Label>
            <Row className="gap-4">
              <Dropdown
                align="start"
                triggerLabel="게시글 메뉴"
                triggerClassName="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 font-semibold hover:border-navy"
                trigger={<>더보기 메뉴</>}
                items={[
                  { label: "수정하기", icon: <Pencil size={16} />, onSelect: () => toast.show("수정하기") },
                  { label: "링크 복사", icon: <Copy size={16} />, onSelect: () => toast.success("링크를 복사했어요.") },
                  { label: "설정", icon: <Settings size={16} />, disabled: true },
                  { type: "divider" },
                  { label: "삭제하기", icon: <Trash2 size={16} />, danger: true, onSelect: () => setConfirmOpen(true) },
                ]}
              />
              <Tooltip content="1시간 = 1 Time Coin">
                <button type="button" className="rounded-sm text-body-sm font-semibold text-fg-muted underline decoration-dotted underline-offset-4 hover:text-fg">
                  Time Coin이란?
                </button>
              </Tooltip>
              <Tooltip content="아래쪽 툴팁" side="bottom">
                <Button variant="ghost" size="sm" iconOnly aria-label="로그아웃">
                  <LogOut size={16} />
                </Button>
              </Tooltip>
            </Row>
          </Card>
          <Card className="flex flex-col gap-3">
            <Label>Pagination</Label>
            <Pagination page={page} totalPages={12} onChange={setPage} />
            <p className="text-center text-caption text-fg-muted">현재 {page} / 12 페이지</p>
          </Card>
          <Card className="flex flex-col gap-3">
            <Label>Avatar · Rating · Spinner</Label>
            <Row className="gap-3">
              {mockUsers.map((u) => (
                <Avatar key={u.id} name={u.nickname} />
              ))}
              <Rating value={4.8} count={12} />
              <Spinner label="불러오는 중" className="text-navy" />
            </Row>
          </Card>
          <Card tone="navy" className="flex flex-col gap-2">
            <Label>
              <span className="text-white/60">Card · navy (강조 카드)</span>
            </Label>
            <p className="text-h3">다크 네이비 강조 영역</p>
            <p className="text-body-sm text-white/70">주요 정보·요약 카드에 사용합니다.</p>
          </Card>
          <Card tone="muted" className="flex flex-col gap-2">
            <Label>Card · muted</Label>
            <p className="text-h3">구분 영역</p>
            <p className="text-body-sm text-fg-muted">보조 정보, 안내 박스에 사용합니다.</p>
          </Card>
        </div>
      </Section>

      {/* ── Overlay ────────────────────────────── */}
      <Section id="overlay" title="모달 · 토스트" desc="ESC·배경 클릭으로 닫힘 · 모바일은 하단 시트">
        <Card>
          <Row>
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              모달 열기
            </Button>
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
              확인 다이얼로그
            </Button>
            <Button variant="secondary" onClick={() => toast.success("신청이 완료되었어요.")}>
              Success 토스트
            </Button>
            <Button variant="secondary" onClick={() => toast.error("코인이 부족해요.")}>
              Error 토스트
            </Button>
            <Button variant="secondary" onClick={() => toast.info("새 메시지가 도착했어요.")}>
              Info 토스트
            </Button>
          </Row>
        </Card>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="신청 내용 확인"
          description="아래 내용으로 재능을 신청할까요?"
          footer={
            <>
              <Button variant="secondary" fullWidth onClick={() => setModalOpen(false)}>
                취소
              </Button>
              <Button
                variant="accent"
                fullWidth
                onClick={() => {
                  setModalOpen(false);
                  toast.success("신청이 완료되었어요.");
                }}
              >
                신청하기
              </Button>
            </>
          }
        >
          <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5">
            <dt className="text-fg-muted">재능</dt>
            <dd>프리미어 프로로 브이로그 편집 끝내기</dd>
            <dt className="text-fg-muted">일정</dt>
            <dd>11월 15일 (토) 오후 2:00</dd>
            <dt className="text-fg-muted">필요 코인</dt>
            <dd className="font-bold">2 TC</dd>
          </dl>
        </Modal>
        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            toast.show("삭제되었어요.");
          }}
          title="정말 삭제할까요?"
          description="삭제한 내용은 되돌릴 수 없어요."
          confirmText="삭제"
          danger
        />
      </Section>

      {/* ── Loading / Empty / Error ───────────── */}
      <Section id="loading" title="로딩 · 빈 상태 · 오류" desc="API 응답 전 Skeleton → 결과 없음 EmptyState → 실패 ErrorState">
        <Row className="mb-3">
          <Chip selected={skeleton} onClick={() => setSkeleton((v) => !v)}>
            Skeleton {skeleton ? "ON" : "OFF"}
          </Chip>
        </Row>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {skeleton
            ? Array.from({ length: 4 }, (_, i) => <TalentCardSkeleton key={i} />)
            : mockTalents.slice(0, 4).map((t) => <TalentCard key={t.id} talent={t} provider={userById(t.providerId)} />)}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {skeleton ? <ProfileCardSkeleton /> : <ProfileCard user={userById("u_sora")} />}
          <CoinCard balance={wallet.balance} available={wallet.available} locked={wallet.locked} variant="compact" loading={skeleton} />
          <Card>
            <SkeletonText lines={4} />
            <Skeleton className="mt-4 h-10 w-full" />
          </Card>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Card padded={false}>
            <EmptyState icon={<Inbox size={24} />} title="아직 거래 내역이 없어요" description="관심 있는 재능을 찾아 첫 거래를 시작해 보세요." action={<Button href="/talents">재능 찾기</Button>} />
          </Card>
          <Card padded={false}>
            <ErrorState onRetry={() => toast.info("다시 불러오는 중…")} />
          </Card>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" id="image-states">
          <Card>
            <Label>TalentImage · 이미지 없음 → 기본 이미지</Label>
            <TalentImage category="music" className="aspect-[16/10] w-full rounded-md" />
          </Card>
          <Card>
            <Label>TalentImage · 로딩 실패(잘못된 URL) → 기본 이미지</Label>
            <TalentImage src="/__broken-image-example.jpg" category="video" alt="깨진 이미지 예시" className="aspect-[16/10] w-full rounded-md" />
          </Card>
        </div>
      </Section>

      {/* ── Service cards ──────────────────────── */}
      <Section id="service" title="서비스 카드" desc="TalentCard(세로·가로·관심 토글) · ProfileCard · ReviewCard · PostCard">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {mockTalents.slice(0, 4).map((t) => (
            <TalentCard
              key={t.id}
              talent={t}
              provider={userById(t.providerId)}
              liked={liked.includes(t.id)}
              onToggleLike={(id) => setLiked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            />
          ))}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {mockTalents.slice(0, 2).map((t) => (
            <TalentCard key={t.id} talent={t} provider={userById(t.providerId)} layout="horizontal" />
          ))}
        </div>
        <div className="mt-3 grid items-start gap-3 md:grid-cols-2">
          <ProfileCard
            user={userById("u_jiwoo")}
            actions={
              <>
                <Button variant="secondary">팔로우</Button>
                <Button leftIcon={<Send size={16} />}>채팅하기</Button>
              </>
            }
          />
          <div className="flex flex-col gap-3">
            <Card>
              <ProfileCard user={userById("u_sora")} variant="compact" actions={<Button size="sm" variant="outline">프로필</Button>} />
            </Card>
            <ReviewCard review={mockReviews[0]} author={userById(mockReviews[0].authorId)} talentTitle="프리미어 프로로 브이로그 편집 끝내기" />
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                author={userById(p.authorId)}
                onToggleLike={(id) => setPosts((ps) => ps.map((x) => (x.id === id ? { ...x, liked: !x.liked, likeCount: x.likeCount + (x.liked ? -1 : 1) } : x)))}
                onToggleSave={(id) => setPosts((ps) => ps.map((x) => (x.id === id ? { ...x, saved: !x.saved } : x)))}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Coin ───────────────────────────────── */}
      <Section id="coin" title="Time Coin" desc="CoinCard는 받은 값만 표시 · 아래 데모는 [MOCK] 임시 원장 (STEP 8에서 백엔드로 이전)">
        <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
          <CoinCard balance={wallet.balance} available={wallet.available} locked={wallet.locked} />
          <Card className="flex flex-col gap-4">
            <div>
              <strong>데모 거래 #{seq}</strong>
              <p className="text-body-sm text-fg-muted">
                나({user?.nickname}) → 지우의편집실 · 1시간 = 1 TC · {tradeState}
              </p>
            </div>
            <Row>
              <Button size="sm" onClick={() => runLedger("lock")}>
                1. 거래 확정 (LOCK)
              </Button>
              <Button size="sm" variant="accent" onClick={() => runLedger("settle")}>
                2. 완료 → 정산
              </Button>
              <Button size="sm" variant="outline" onClick={() => runLedger("release")}>
                거래 취소
              </Button>
            </Row>
            <Row>
              <Button size="sm" variant="ghost" onClick={() => setSeq((n) => n + 1)}>
                새 데모 거래
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  ledger.reset();
                  setSeq(1);
                  toast.info("코인 데이터를 초기 상태로 되돌렸어요.");
                }}
              >
                초기화
              </Button>
            </Row>
            <ul className="divide-y divide-divider border-y border-divider">
              {ledger.txs
                .filter((t) => t.userId === ME_ID)
                .slice(0, 5)
                .map((t) => {
                  const plus = t.type === "earn" || t.type === "grant";
                  return (
                    <li key={t.id} className="flex justify-between gap-3 py-2.5 text-body-sm">
                      <span>{t.memo}</span>
                      <strong className={plus ? "text-success" : undefined}>
                        {plus ? "+" : t.type === "spend" ? "-" : ""}
                        {t.amount} TC{t.type === "lock" ? " (잠금)" : t.type === "unlock" ? " (해제)" : ""}
                      </strong>
                    </li>
                  );
                })}
            </ul>
          </Card>
        </div>
      </Section>

      {/* ── Chat · Notification · Calendar ─────── */}
      <Section id="etc" title="채팅 · 알림 · 캘린더">
        <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
          <Card className="bg-gray-50">
            <Label>ChatMessage</Label>
            {mockMessages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                mine={m.senderId === ME_ID}
                sender={userById(m.senderId)}
                grouped={i > 0 && mockMessages[i - 1].senderId === m.senderId && mockMessages[i - 1].kind !== "system"}
              />
            ))}
          </Card>
          <Card padded={false}>
            <div className="flex items-center justify-between px-4 pt-3.5 pb-1.5">
              <strong>알림 {notifications.filter((n) => !n.read).length}개 안 읽음</strong>
              <Button size="sm" variant="ghost" onClick={markAllRead}>
                모두 읽음
              </Button>
            </div>
            <div className="flex flex-col gap-1 p-1.5">
              {notifications.map((n) => (
                <NotificationItem key={n.id} item={n} onRead={markRead} onRemove={removeNoti} />
              ))}
            </div>
          </Card>
          <Card>
            <Calendar
              value={date}
              onChange={setDate}
              initialMonth="2026-11-01"
              minDate="2026-11-13"
              today="2026-11-13"
              events={[
                { date: "2026-11-05", tone: "completed" },
                { date: "2026-11-15", tone: "scheduled" },
                { date: "2026-11-18", tone: "booking" },
                { date: "2026-11-20", tone: "available" },
                { date: "2026-11-22", tone: "available" },
                { date: "2026-11-22", tone: "scheduled" },
              ]}
            />
            <p className="mt-3 text-body-sm text-fg-muted">선택: {date ?? "날짜를 선택하세요"}</p>
          </Card>
        </div>
      </Section>

      {/* ── API ────────────────────────────────── */}
      <Section id="api" title="API 연결" desc="실제 API 연동 부분과 임시 데이터 사용 부분 구분">
        <Card className="flex flex-col gap-4">
          <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5">
            <dt className="text-fg-muted">데이터 모드</dt>
            <dd>{USE_MOCK ? <Badge tone="warning">MOCK (테스트 데이터)</Badge> : <Badge tone="accent">API</Badge>}</dd>
            <dt className="text-fg-muted">API 주소</dt>
            <dd>
              <code>{API_BASE_URL}</code>
            </dd>
            <dt className="text-fg-muted">서버 상태</dt>
            <dd>{health}</dd>
          </dl>
          <div>
            <Button size="sm" variant="outline" onClick={checkHealth}>
              NestJS 연결 확인
            </Button>
          </div>
        </Card>
      </Section>
    </div>
  );
}
