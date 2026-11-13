"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseTalentQuery, toQueryString, type TalentQuery } from "@/lib/talentQuery";

/** 재능 찾기 페이지의 마지막 검색 URL (상세 → '목록으로' 복귀에 사용) */
export const LAST_SEARCH_KEY = "tm:lastTalentSearch";

/**
 * URL 쿼리를 검색 조건으로 읽고, 조건 변경 시 URL 을 갱신하는 훅.
 *
 * - update(patch)      : 필터·정렬 변경 → 히스토리를 쌓지 않음(replace). 페이지는 1로 초기화
 * - update(patch, true): 검색 실행 → 히스토리에 남김(push) → 뒤로 가기로 이전 검색 복귀
 */
export function useTalentQuery() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = useMemo(() => parseTalentQuery(new URLSearchParams(sp.toString())), [sp]);

  const update = useCallback(
    (patch: Partial<TalentQuery>, push = false) => {
      const next: TalentQuery = { ...query, page: 1, ...patch };
      const qs = toQueryString(next);
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (push) router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [query, pathname, router],
  );

  return { query, update, queryString: toQueryString(query) };
}
