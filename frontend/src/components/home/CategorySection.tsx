import Link from "next/link";
import { CATEGORY_ICON } from "@/components/domain";
import { CATEGORIES } from "@/types";
import { talentSearchHref } from "@/lib/search";

/** SECTION 04. 재능 카테고리 — 클릭 시 재능 찾기 페이지에 category 파라미터로 이동 */
export function CategorySection() {
  return (
    <section aria-labelledby="category-title" className="flex flex-col">
      <h2 id="category-title" className="mb-4 text-h2">
        카테고리
      </h2>
      <ul className="grid flex-1 grid-cols-4 gap-2 md:gap-3">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICON[c.id];
          return (
            <li key={c.id}>
              <Link
                href={talentSearchHref({ category: c.id })}
                className="group flex h-full min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-divider bg-surface px-1 py-4 transition-colors hover:border-navy"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-gray-100 text-secondary transition-colors group-hover:bg-navy group-hover:text-point md:size-12">
                  <Icon size={22} strokeWidth={1.8} aria-hidden />
                </span>
                <span className="text-body-sm font-semibold text-fg-secondary group-hover:text-fg md:text-body-md">{c.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
