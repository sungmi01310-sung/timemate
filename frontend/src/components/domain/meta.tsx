import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  Code2,
  Coins,
  Dumbbell,
  Handshake,
  Heart,
  Languages,
  MessageCircle,
  Music,
  Palette,
  PenTool,
  Sparkles,
  UserPlus,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, NotificationType, TradeStatus } from "@/types";
import type { BadgeTone } from "@/components/common";

export const CATEGORY_ICON: Record<CategoryId, LucideIcon> = {
  dev: Code2,
  design: PenTool,
  video: Clapperboard,
  music: Music,
  language: Languages,
  hobby: Palette,
  sports: Dumbbell,
  etc: Sparkles,
};

export const TRADE_STATUS_META: Record<TradeStatus, { label: string; tone: BadgeTone }> = {
  requested: { label: "수락 대기", tone: "warning" },
  accepted: { label: "일정 조율", tone: "info" },
  confirmed: { label: "거래 확정", tone: "navy" },
  in_progress: { label: "진행 중", tone: "info" },
  completion_requested: { label: "완료 확인 대기", tone: "warning" },
  completed: { label: "거래 완료", tone: "accent" },
  cancelled: { label: "취소됨", tone: "neutral" },
  rejected: { label: "거절됨", tone: "error" },
};

export const NOTIFICATION_ICON: Record<NotificationType, LucideIcon> = {
  trade_request: Handshake,
  trade_accepted: CheckCircle2,
  trade_rejected: XCircle,
  chat: MessageCircle,
  booking_confirmed: CalendarCheck,
  booking_changed: CalendarClock,
  trade_completed: CheckCircle2,
  coin: Coins,
  community: Heart,
  follow: UserPlus,
  group: Users,
};

export const FallbackBell = Bell;
