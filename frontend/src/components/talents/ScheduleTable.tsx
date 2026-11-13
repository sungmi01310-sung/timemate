import { cx } from "@/lib/format";
import type { WeeklySlot } from "@/types";

const DAYS = [
  { day: 1, label: "월" },
  { day: 2, label: "화" },
  { day: 3, label: "수" },
  { day: 4, label: "목" },
  { day: 5, label: "금" },
  { day: 6, label: "토" },
  { day: 0, label: "일" },
] as const;

/** 시간 구간 길이(시간) — "19:00"~"22:00" → 3 */
const spanHours = (s: WeeklySlot) => {
  const [sh, sm] = s.start.split(":").map(Number);
  const [eh, em] = s.end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
};

/**
 * 주간 제공 가능 일정 (조회 전용).
 * 실제 날짜 선택·예약 확정은 STEP 6 에서 Calendar 와 연결한다.
 */
export function ScheduleTable({ schedule, hours }: { schedule: WeeklySlot[]; hours: number }) {
  if (!schedule.length) {
    return <p className="rounded-md bg-gray-100 px-4 py-6 text-center text-body-sm text-fg-muted">등록된 일정이 없어요. 신청 시 메시지로 일정을 조율해 주세요.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-7" aria-label="요일별 제공 가능 시간">
      {DAYS.map(({ day, label }) => {
        const slots = schedule.filter((s) => s.day === day && spanHours(s) >= hours);
        const open = slots.length > 0;
        return (
          <li
            key={day}
            className={cx(
              "flex items-center gap-3 rounded-md border px-3 py-2.5 sm:flex-col sm:items-stretch sm:gap-1.5 sm:px-2 sm:py-3 sm:text-center",
              open ? "border-navy bg-surface" : "border-divider bg-gray-50",
            )}
          >
            <span className={cx("w-6 font-bold sm:w-auto", day === 0 ? "text-error" : day === 6 ? "text-sub-strong" : open ? "text-fg" : "text-fg-disabled")}>{label}</span>
            {open ? (
              slots.map((s) => (
                <span key={s.start} className="text-body-sm font-medium text-fg-secondary">
                  {s.start}
                  <span className="text-fg-muted">~</span>
                  {s.end}
                </span>
              ))
            ) : (
              <span className="text-body-sm text-fg-disabled">불가</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
