/**
 * 재능 찾기 페이지 URL 만들기.
 *   talentSearchHref({ q: "영상 편집" })   → /talents?q=영상+편집
 *   talentSearchHref({ category: "dev" }) → /talents?category=dev
 * (재능 찾기 페이지가 STEP 4에서 이 파라미터를 읽어 검색 결과를 보여준다)
 */
export function talentSearchHref(params: { q?: string; category?: string }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  const qs = sp.toString();
  return qs ? `/talents?${qs}` : "/talents";
}
