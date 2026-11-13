"use client";

import { cloneElement, useId, useState, type ReactElement } from "react";
import { cx } from "@/lib/format";

type TriggerProps = {
  "aria-describedby"?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

/**
 * 툴팁. 마우스 hover 와 키보드 focus 모두에서 표시된다.
 * children 은 포커스 가능한 요소(button, a 등) 하나여야 한다.
 */
export function Tooltip({
  content,
  side = "top",
  children,
}: {
  content: string;
  side?: "top" | "bottom";
  children: ReactElement<TriggerProps>;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <span className="relative inline-flex" onKeyDown={(e) => e.key === "Escape" && hide()}>
      {cloneElement(children, {
        "aria-describedby": open ? id : undefined,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
      })}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cx(
            "pointer-events-none absolute left-1/2 z-50 w-max max-w-60 -translate-x-1/2 animate-fade-in rounded-sm bg-navy px-2.5 py-1.5 text-caption font-medium text-white shadow-md",
            side === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
