"use client";

import { formatDate, formatRelative } from "@/lib/format";
import { useNow } from "@/lib/useNow";

/** "3분 전" 형태 상대 시간. 서버 렌더에서는 날짜(YYYY.MM.DD)를 먼저 보여준다. */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const now = useNow();
  return (
    <time dateTime={iso} className={className}>
      {now === null ? formatDate(iso) : formatRelative(iso, now)}
    </time>
  );
}
