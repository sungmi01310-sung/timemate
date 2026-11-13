import { Suspense } from "react";
import type { Metadata } from "next";
import { TalentSearchPage } from "@/components/talents/TalentSearchPage";

export const metadata: Metadata = {
  title: "재능 찾기",
  description: "당신에게 필요한 재능을 가진 타임메이트를 만나보세요.",
};

/** 검색 조건을 URL(useSearchParams)에서 읽으므로 Suspense 로 감싼다 (Next 16 cacheComponents 규칙) */
export default function Page() {
  return (
    <Suspense fallback={<div className="page-container min-h-[60vh]" aria-busy="true" />}>
      <TalentSearchPage />
    </Suspense>
  );
}
