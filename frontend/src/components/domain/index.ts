/**
 * 서비스 전용 컴포넌트. 모두 props 만으로 그려지며 API 호출을 하지 않는다.
 * (데이터 조회는 페이지 → lib/api 에서 하고, 결과를 props 로 넘긴다)
 */
export { TalentImage } from "./TalentImage";
export { TalentCard, TalentCardSkeleton, type TalentCardProps, type TalentCardData, type TalentCardProvider, type TalentCardLayout } from "./TalentCard";
export { ProfileCard, ProfileCardSkeleton, type ProfileCardProps, type ProfileCardUser } from "./ProfileCard";
export { CoinCard, type CoinCardProps } from "./CoinCard";
export { ReviewCard, type ReviewCardProps } from "./ReviewCard";
export { PostCard, type PostCardProps } from "./PostCard";
export { ChatMessage, type ChatMessageProps } from "./ChatMessage";
export { NotificationItem, type NotificationItemProps } from "./NotificationItem";
export { TradeStatusBadge } from "./TradeStatusBadge";
export {
  Calendar,
  toDateKey,
  EVENT_TONE_LABEL,
  type CalendarEvent,
  type CalendarEventTone,
  type CalendarProps,
  type DateKey,
} from "./Calendar";
export { CATEGORY_ICON, TRADE_STATUS_META, NOTIFICATION_ICON } from "./meta";
