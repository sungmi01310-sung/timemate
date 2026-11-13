/**
 * 메인 페이지 '최근 활동' API.
 *
 *  [MOCK] mocks/data.ts 의 거래·채팅방 데이터를 사용한다.
 *  [API]  GET /api/me/activity — 거래(STEP 6·8), 채팅(STEP 7) 백엔드 구현 후 연결.
 *
 * 조회만 한다. 거래 상태·코인은 프론트에서 절대 변경하지 않는다.
 */
import type { Trade, TradeStatus, User } from "@/types";
import { mockChatRooms, mockTalents, mockTrades, mockUsers } from "@/mocks/data";
import { USE_MOCK, apiFetch, mockDelay } from "./client";

type Partner = Pick<User, "id" | "nickname" | "avatarUrl">;

export interface TradeSummary {
  id: string;
  talentId: string;
  talentTitle: string;
  partner: Partner;
  /** 내가 이용자(requester)인지 제공자(provider)인지 */
  role: "requester" | "provider";
  status: TradeStatus;
  hours: number;
  scheduledAt?: string;
}

export interface ChatRoomSummary {
  id: string;
  partner: Partner;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export interface MyActivity {
  /** 진행 중인 거래 (완료·취소·거절 제외) */
  ongoingTrades: TradeSummary[];
  /** 예정된 예약 (일정이 확정된 거래, 가까운 순) */
  upcomingBookings: TradeSummary[];
  recentChats: ChatRoomSummary[];
}

const DONE: TradeStatus[] = ["completed", "cancelled", "rejected"];

const partnerOf = (id: string): Partner => {
  const u = mockUsers.find((m) => m.id === id);
  return { id, nickname: u?.nickname ?? "알 수 없음", avatarUrl: u?.avatarUrl };
};

function toSummary(t: Trade, me: string): TradeSummary {
  const role = t.requesterId === me ? "requester" : "provider";
  return {
    id: t.id,
    talentId: t.talentId,
    talentTitle: mockTalents.find((x) => x.id === t.talentId)?.title ?? "삭제된 재능",
    partner: partnerOf(role === "requester" ? t.providerId : t.requesterId),
    role,
    status: t.status,
    hours: t.hours,
    scheduledAt: t.scheduledAt,
  };
}

export async function getMyActivity(userId: string): Promise<MyActivity> {
  if (!USE_MOCK) return apiFetch<MyActivity>(`/me/activity`);

  const mine = mockTrades.filter((t) => t.requesterId === userId || t.providerId === userId);
  const ongoing = mine.filter((t) => !DONE.includes(t.status)).map((t) => toSummary(t, userId));
  const upcoming = ongoing
    .filter((t) => t.scheduledAt && ["confirmed", "in_progress"].includes(t.status))
    .sort((a, b) => a.scheduledAt!.localeCompare(b.scheduledAt!));
  const chats = [...mockChatRooms]
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt))
    .map((r) => ({ id: r.id, partner: partnerOf(r.partnerId), lastMessage: r.lastMessage, lastAt: r.lastAt, unread: r.unread }));

  return mockDelay({ ongoingTrades: ongoing, upcomingBookings: upcoming, recentChats: chats }, 450);
}
