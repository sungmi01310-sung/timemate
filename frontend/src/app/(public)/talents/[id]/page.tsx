import { Suspense } from "react";
import type { Metadata } from "next";
import { TalentDetailPage } from "@/components/talents/TalentDetailPage";

export const metadata: Metadata = { title: "재능 상세" };

/** 재능 id 는 클라이언트에서 useParams 로 읽는다 → 동적 경로이므로 Suspense 필요 */
export default function Page() {
  return (
    <Suspense fallback={<div className="page-container min-h-[60vh]" aria-busy="true" />}>
      <TalentDetailPage />
    </Suspense>
  );
}
