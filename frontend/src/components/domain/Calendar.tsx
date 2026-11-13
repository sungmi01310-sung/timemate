"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/format";
import { useNow } from "@/lib/useNow";

/** YYYY-MM-DD (로컬 시간 기준) */
export type DateKey = string;

export type CalendarEventTone = "scheduled" | "booking" | "completed" | "available";

export interface CalendarEvent {
  date: DateKey;
  tone: CalendarEventTone;
  label?: string;
}

export const toDateKey = (d: Date): DateKey =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const EVENT_TONE_LABEL: Record<CalendarEventTone, string> = {
  scheduled: "거래 예정",
  booking: "예약 요청",
  completed: "거래 완료",
  available: "제공 가능",
};

const DOT: Record<CalendarEventTone, string> = {
  scheduled: "bg-navy",
  booking: "bg-warning",
  completed: "bg-point-strong",
  available: "bg-sub",
};

export interface CalendarProps {
  value?: DateKey | null;
  onChange?: (date: DateKey) => void;
  events?: CalendarEvent[];
  /** 이 날짜 이전은 선택 불가 (예: 오늘) */
  minDate?: DateKey;
  isDateDisabled?: (date: DateKey) => boolean;
  /** 처음 보여줄 달 (기본: value 또는 오늘) */
  initialMonth?: DateKey;
  showLegend?: boolean;
  /** '오늘' 고정 (테스트·데모용). 없으면 브라우저 시간 */
  today?: DateKey;
}

/** 월간 캘린더. 날짜 선택 + 일정 점 표시 */
export function Calendar({ value, onChange, events = [], minDate, isDateDisabled, initialMonth, showLegend = true, today }: CalendarProps) {
  const now = useNow();
  const todayKey = today ?? (now === null ? null : toDateKey(new Date(now)));
  const base = initialMonth ?? value ?? todayKey;
  // 기준 달에서 몇 달 이동했는지 (서버 렌더 시 '오늘'을 모를 수 있어 offset 으로 관리)
  const [offset, setOffset] = useState(0);
  const cursor = useMemo(() => {
    if (!base) return null;
    const d = new Date(Number(base.slice(0, 4)), Number(base.slice(5, 7)) - 1 + offset, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  }, [base, offset]);

  const eventsByDate = useMemo(() => {
    const map = new Map<DateKey, CalendarEvent[]>();
    for (const e of events) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, [events]);

  const cells = useMemo(() => {
    if (!cursor) return [];
    const lead = new Date(cursor.y, cursor.m, 1).getDay();
    const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const list: (DateKey | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) list.push(toDateKey(new Date(cursor.y, cursor.m, d)));
    while (list.length % 7) list.push(null);
    return list;
  }, [cursor]);

  const usedTones = [...new Set(events.map((e) => e.tone))];

  if (!cursor) return <div aria-busy="true" className="min-h-80 w-full" />;

  const navBtn = "flex size-9 items-center justify-center rounded-sm text-fg-secondary transition-colors hover:bg-gray-100 hover:text-fg";

  return (
    <div className="w-full select-none">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" className={navBtn} onClick={() => setOffset((o) => o - 1)} aria-label="이전 달">
          <ChevronLeft size={18} />
        </button>
        <strong className="text-h3" aria-live="polite">
          {cursor.y}년 {cursor.m + 1}월
        </strong>
        <button type="button" className={navBtn} onClick={() => setOffset((o) => o + 1)} aria-label="다음 달">
          <ChevronRight size={18} />
        </button>
      </div>

      <div role="grid" className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div key={w} role="columnheader" className={cx("py-1.5 text-center text-caption", i === 0 ? "text-error" : i === 6 ? "text-sub-strong" : "text-fg-muted")}>
            {w}
          </div>
        ))}
        {cells.map((key, i) => {
          if (!key) return <div key={`e${i}`} className="aspect-square" />;
          const dayEvents = eventsByDate.get(key) ?? [];
          const disabled = (minDate !== undefined && key < minDate) || isDateDisabled?.(key) === true;
          const selected = key === value;
          const dow = i % 7;
          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-label={`${key}${dayEvents.length ? `, 일정 ${dayEvents.length}건` : ""}`}
              disabled={disabled}
              onClick={() => onChange?.(key)}
              className={cx(
                "flex aspect-square min-h-10 flex-col items-center justify-center gap-[3px] rounded-md font-medium transition-colors",
                "disabled:cursor-not-allowed disabled:text-gray-400",
                selected ? "bg-navy text-white" : cx("enabled:hover:bg-gray-100", dow === 0 ? "text-error" : dow === 6 ? "text-sub-strong" : "text-fg"),
              )}
            >
              <span
                className={cx(
                  key === todayKey && "font-extrabold underline decoration-point decoration-[3px] underline-offset-4",
                )}
              >
                {Number(key.slice(8))}
              </span>
              {dayEvents.length > 0 && (
                <span className="flex h-1.5 gap-[3px]" aria-hidden>
                  {dayEvents.slice(0, 3).map((e, j) => (
                    <span key={j} className={cx("size-1.5 rounded-full", selected && e.tone === "scheduled" ? "bg-white" : DOT[e.tone])} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showLegend && usedTones.length > 0 && (
        <ul className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-caption font-normal text-fg-muted">
          {usedTones.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <span className={cx("size-1.5 rounded-full", DOT[t])} />
              {EVENT_TONE_LABEL[t]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
