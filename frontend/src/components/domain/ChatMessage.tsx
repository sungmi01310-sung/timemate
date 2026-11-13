import { Info } from "lucide-react";
import { Avatar } from "@/components/common";
import { cx, formatTime } from "@/lib/format";
import type { ChatMessage as ChatMessageType, User } from "@/types";

export interface ChatMessageProps {
  message: ChatMessageType;
  mine: boolean;
  sender?: Pick<User, "nickname" | "avatarUrl">;
  /** 같은 사람이 연속으로 보낸 메시지면 프로필 생략 */
  grouped?: boolean;
}

/** 채팅 말풍선. system 메시지(거래 상태 안내)는 가운데 정렬 */
export function ChatMessage({ message, mine, sender, grouped }: ChatMessageProps) {
  if (message.kind === "system") {
    return (
      <div role="note" className="mx-auto my-4 flex w-fit max-w-full items-center justify-center gap-1.5 rounded-full bg-secondary-soft px-3.5 py-1.5 text-center text-caption text-secondary">
        <Info size={14} aria-hidden />
        {message.content}
      </div>
    );
  }

  return (
    <div className={cx("flex gap-2", grouped ? "mt-1" : "mt-3", mine && "justify-end")}>
      {!mine && <div className="w-8 shrink-0">{!grouped && sender && <Avatar name={sender.nickname} src={sender.avatarUrl} size={32} />}</div>}
      <div className="flex max-w-[min(72%,480px)] flex-col gap-1">
        {!mine && !grouped && sender && <span className="text-caption text-fg-secondary">{sender.nickname}</span>}
        <div className={cx("flex items-end gap-1.5", mine && "flex-row-reverse")}>
          {message.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={message.content} alt="첨부 이미지" className="max-w-60 rounded-md" />
          ) : (
            <p
              className={cx(
                "border px-3.5 py-2.5 break-words whitespace-pre-wrap",
                mine ? "rounded-[16px_4px_16px_16px] border-navy bg-navy text-white" : "rounded-[4px_16px_16px_16px] border-divider bg-surface",
              )}
            >
              {message.content}
            </p>
          )}
          <span className="flex shrink-0 flex-col items-end text-[11px] text-fg-muted">
            {mine && !message.read && <span className="font-bold text-sub-strong">1</span>}
            <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
          </span>
        </div>
      </div>
    </div>
  );
}
