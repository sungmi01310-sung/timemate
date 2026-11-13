/**
 * TimeMate 도메인 타입.
 * 백엔드(NestJS) API 응답 스키마와 1:1로 맞추는 것을 원칙으로 한다.
 */

export type ID = string;
export type ISODateString = string;

/* ── 카테고리 ───────────────────────────── */
export const CATEGORIES = [
  { id: "dev", label: "개발" },
  { id: "design", label: "디자인" },
  { id: "video", label: "영상" },
  { id: "music", label: "음악" },
  { id: "language", label: "외국어" },
  { id: "hobby", label: "취미" },
  { id: "sports", label: "운동" },
  { id: "etc", label: "기타" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const categoryLabel = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? "기타";

/* ── 사용자 ─────────────────────────────── */
export interface User {
  id: ID;
  email: string;
  nickname: string;
  avatarUrl?: string;
  bio: string;
  interests: CategoryId[];
  skills: string[];
  rating: number;      // 0 ~ 5
  reviewCount: number;
  region?: string;
  joinedAt: ISODateString;
}

/* ── 재능 ───────────────────────────────── */
export type TradeMode = "online" | "offline" | "both";

export const TRADE_MODE_LABEL: Record<TradeMode, string> = {
  online: "온라인",
  offline: "오프라인",
  both: "온·오프라인",
};

export interface Talent {
  id: ID;
  providerId: ID;
  title: string;
  summary: string;
  description: string;
  category: CategoryId;
  imageUrl?: string;
  /** 1회 제공 시간(시간 단위). 필요 코인 = hours (1시간 = 1 Time Coin) */
  hours: number;
  mode: TradeMode;
  region?: string;
  availableTimes: string[]; // 예: "평일 저녁", "주말 오전"
  rating: number;
  reviewCount: number;
  likeCount: number;
  isPublic: boolean;
  createdAt: ISODateString;
}

/** 주간 제공 가능 시간 (day: 0=일 ~ 6=토, 시간은 "HH:mm") */
export interface WeeklySlot {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start: string;
  end: string;
}

/**
 * 재능 상세 화면에만 필요한 정보 (목록 API 에는 포함하지 않음).
 * Prisma 도입 시 Talent 모델의 컬럼 또는 1:N 관계(TalentSchedule)로 옮긴다.
 */
export interface TalentDetailInfo {
  images: string[];
  offerings: string[];  // 제공 내용
  targets: string[];    // 추천 대상
  materials: string[];  // 준비물
  process: string[];    // 진행 방식
  notes: string[];      // 유의사항
  schedule: WeeklySlot[];
}

export type TalentDetail = Talent & TalentDetailInfo;

/* ── 거래 ───────────────────────────────── */
export type TradeStatus =
  | "requested"            // 신청됨 (제공자 수락 대기)
  | "accepted"             // 제공자 수락 (일정 확정 전)
  | "confirmed"            // 거래 확정 → 코인 LOCK
  | "in_progress"          // 재능 교환 진행 중
  | "completion_requested" // 한쪽이 완료 요청
  | "completed"            // 양측 완료 확인 → 정산 완료
  | "cancelled"
  | "rejected";

export interface Trade {
  id: ID;
  talentId: ID;
  requesterId: ID; // 재능 이용자 (코인 지불)
  providerId: ID;  // 재능 제공자 (코인 적립)
  hours: number;
  scheduledAt?: ISODateString;
  mode: Exclude<TradeMode, "both">;
  message: string;
  status: TradeStatus;
  completedBy: { requester: boolean; provider: boolean };
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/* ── Time Coin ──────────────────────────── */
export interface Wallet {
  userId: ID;
  /** 총 보유 코인 (잠금 포함) */
  balance: number;
  /** 거래 확정으로 잠긴 코인 */
  locked: number;
}

export type CoinTxType = "earn" | "spend" | "lock" | "unlock" | "grant";

export interface CoinTx {
  id: ID;
  userId: ID;
  type: CoinTxType;
  amount: number;
  tradeId?: ID;
  memo: string;
  /** 거래 후 총 보유 코인 */
  balanceAfter: number;
  createdAt: ISODateString;
}

/* ── 후기 ───────────────────────────────── */
export interface Review {
  id: ID;
  tradeId: ID;
  talentId: ID;
  authorId: ID;
  targetUserId: ID;
  rating: number;
  content: string;
  createdAt: ISODateString;
}

/* ── 채팅 ───────────────────────────────── */
export type ChatMessageKind = "text" | "image" | "system";

export interface ChatMessage {
  id: ID;
  roomId: ID;
  senderId: ID;
  kind: ChatMessageKind;
  content: string; // image 인 경우 URL
  createdAt: ISODateString;
  read: boolean;
}

/* ── 커뮤니티 ───────────────────────────── */
export type PostCategory = "free" | "talent" | "question" | "review" | "group" | "challenge";

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  free: "자유",
  talent: "재능 이야기",
  question: "질문",
  review: "교환 후기",
  group: "모임",
  challenge: "챌린지",
};

export interface Post {
  id: ID;
  authorId: ID;
  category: PostCategory;
  title: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  liked: boolean;
  saved: boolean;
  createdAt: ISODateString;
}

/* ── 알림 ───────────────────────────────── */
export type NotificationType =
  | "trade_request"
  | "trade_accepted"
  | "trade_rejected"
  | "chat"
  | "booking_confirmed"
  | "booking_changed"
  | "trade_completed"
  | "coin"
  | "community"
  | "follow"
  | "group";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: ISODateString;
}

/* ── 공통 결과 타입 ─────────────────────── */
export type Result<T, E extends string = string> =
  | { ok: true; value: T }
  | { ok: false; error: E; message: string };
