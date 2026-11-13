"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { RelativeTime } from "@/components/common";
import { cx } from "@/lib/format";
import type { AppNotification } from "@/types";
import { NOTIFICATION_ICON } from "./meta";

export interface NotificationItemProps {
  item: AppNotification;
  /** 클릭 시 읽음 처리 */
  onRead?: (id: string) => void;
  /** 넘기면 삭제 버튼 표시 */
  onRemove?: (id: string) => void;
}

/** 알림 한 줄. 클릭 → 읽음 처리 → 관련 페이지로 이동 */
export function NotificationItem({ item, onRead, onRemove }: NotificationItemProps) {
  const Icon = NOTIFICATION_ICON[item.type];
  return (
    <div className={cx("group relative flex rounded-md transition-colors", item.read ? "hover:bg-gray-50" : "bg-sub-soft hover:bg-[#d9f4fd]")}>
      <Link href={item.href} onClick={() => onRead?.(item.id)} className="flex min-w-0 flex-1 gap-3 rounded-[inherit] py-3.5 pr-11 pl-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-secondary ring-1 ring-divider">
          <Icon size={18} aria-hidden />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <strong className="text-body-md">{item.title}</strong>
          <span className="text-body-sm text-fg-secondary">{item.body}</span>
          <RelativeTime iso={item.createdAt} className="text-caption font-normal text-fg-muted" />
        </span>
        {!item.read && <span className="absolute top-[18px] right-[18px] size-2 rounded-full bg-sub" aria-label="읽지 않음" />}
      </Link>
      {onRemove && (
        <button
          type="button"
          aria-label="알림 삭제"
          onClick={() => onRemove(item.id)}
          className="absolute right-2 bottom-2.5 flex size-[30px] items-center justify-center rounded-full text-fg-muted opacity-0 transition hover:bg-gray-200 hover:text-fg focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
