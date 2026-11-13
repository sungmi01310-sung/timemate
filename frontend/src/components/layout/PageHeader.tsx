import type { ReactNode } from "react";

/** 각 페이지 상단 제목 영역 (모든 페이지 동일 패턴) */
export function PageHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        <h1 className="text-h1">{title}</h1>
        {description && <p className="mt-1.5 text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
