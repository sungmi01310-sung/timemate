"use client";

import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Chip, Select } from "@/components/common";
import { cx } from "@/lib/format";
import {
  HOUR_OPTIONS,
  RATING_OPTIONS,
  countActiveFilters,
  hourLabel,
  resetFilters,
  type HourOption,
  type TalentQuery,
} from "@/lib/talentQuery";

export interface FilterPanelProps {
  query: TalentQuery;
  onChange: (patch: Partial<TalentQuery>) => void;
  regions: string[];
  /** 로그인 사용자의 사용 가능 코인 (비회원이면 undefined) */
  availableCoin?: number;
  className?: string;
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2.5 border-b border-divider pb-5 last:border-0 last:pb-0">
      <legend className="mb-2.5 text-label text-fg">{title}</legend>
      {children}
      {hint && <p className="text-caption font-normal text-fg-muted">{hint}</p>}
    </fieldset>
  );
}

/**
 * 재능 필터 (여러 조건 동시 적용).
 * PC: 왼쪽 사이드바 / 태블릿·모바일: 필터 모달 안에 같은 컴포넌트를 재사용
 */
export function FilterPanel({ query, onChange, regions, availableCoin, className }: FilterPanelProps) {
  const toggleHour = (h: HourOption) =>
    onChange({ hours: query.hours.includes(h) ? query.hours.filter((x) => x !== h) : [...query.hours, h] });
  const active = countActiveFilters(query);

  return (
    <div className={cx("flex flex-col gap-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-h4">
          필터{active > 0 && <span className="ml-1.5 text-sub-strong">{active}</span>}
        </h2>
        <button
          type="button"
          onClick={() => onChange(resetFilters(query))}
          disabled={active === 0}
          className="inline-flex items-center gap-1 rounded-sm text-body-sm font-semibold text-fg-muted enabled:hover:text-fg disabled:opacity-40"
        >
          <RotateCcw size={14} />
          초기화
        </button>
      </div>

      <Group title="진행 방식" hint="'온·오프라인' 재능은 두 조건 모두에 포함돼요.">
        <div className="flex flex-wrap gap-2">
          {([null, "online", "offline"] as const).map((m) => (
            <Chip key={m ?? "all"} selected={query.mode === m} onClick={() => onChange({ mode: m, region: m === "online" ? null : query.region })}>
              {m === null ? "전체" : m === "online" ? "온라인" : "오프라인"}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="지역" hint={query.mode === "online" ? "온라인만 볼 때는 지역을 선택할 수 없어요." : "오프라인 진행이 가능한 재능에 적용돼요."}>
        <Select
          aria-label="지역"
          size="sm"
          value={query.region ?? ""}
          disabled={query.mode === "online"}
          onChange={(e) => onChange({ region: e.target.value || null })}
          options={[{ value: "", label: "전체 지역" }, ...regions.map((r) => ({ value: r, label: r }))]}
        />
      </Group>

      <Group title="소요 시간 · 필요 Time Coin" hint="1시간 = 1 Time Coin 이라 소요 시간과 필요 코인은 같아요.">
        <div className="flex flex-wrap gap-2">
          {HOUR_OPTIONS.map((h) => (
            <Chip key={h} selected={query.hours.includes(h)} onClick={() => toggleHour(h)}>
              {hourLabel(h)} · {h}
              {h === 3 ? "+" : ""} TC
            </Chip>
          ))}
        </div>
        <label
          className={cx(
            "mt-1 flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-body-sm transition-colors",
            availableCoin === undefined ? "cursor-not-allowed border-divider text-fg-disabled" : "cursor-pointer border-border hover:border-navy",
            query.affordable && availableCoin !== undefined && "border-navy bg-gray-50",
          )}
        >
          <input
            type="checkbox"
            className="size-4 accent-navy"
            checked={query.affordable && availableCoin !== undefined}
            disabled={availableCoin === undefined}
            onChange={(e) => onChange({ affordable: e.target.checked })}
          />
          <span>
            내 코인으로 이용 가능한 재능만
            <span className="block text-caption font-normal text-fg-muted">
              {availableCoin === undefined ? "로그인 후 사용할 수 있어요" : `사용 가능 ${availableCoin} TC 이내`}
            </span>
          </span>
        </label>
      </Group>

      <Group title="최소 평점">
        <div className="flex flex-wrap gap-2">
          <Chip selected={query.minRating === null} onClick={() => onChange({ minRating: null })}>
            전체
          </Chip>
          {RATING_OPTIONS.map((r) => (
            <Chip key={r} selected={query.minRating === r} onClick={() => onChange({ minRating: r })}>
              ★ {r} 이상
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  );
}
