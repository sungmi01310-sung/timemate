"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/format";

export type DropdownItem =
  | { type?: "item"; label: string; icon?: ReactNode; href?: string; onSelect?: () => void; danger?: boolean; disabled?: boolean }
  | { type: "divider" };

export interface DropdownProps {
  /** 트리거 버튼 안에 들어갈 내용 */
  trigger: ReactNode;
  triggerLabel: string;
  items: DropdownItem[];
  header?: ReactNode;
  align?: "start" | "end";
  triggerClassName?: string;
}

/**
 * 드롭다운 메뉴.
 * - 바깥 클릭 / ESC 로 닫힘
 * - ↑ ↓ 키로 항목 이동, Enter 로 선택 (WAI-ARIA menu 패턴)
 */
export function Dropdown({ trigger, triggerLabel, items, header, align = "end", triggerClassName }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]:not([aria-disabled=true])")?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const moveFocus = (dir: 1 | -1) => {
    const list = [...(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]:not([aria-disabled=true])") ?? [])];
    const idx = list.indexOf(document.activeElement as HTMLElement);
    list[(idx + dir + list.length) % list.length]?.focus();
  };

  const itemClass = (danger?: boolean, disabled?: boolean) =>
    cx(
      "flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-body-sm font-medium outline-none transition-colors",
      disabled
        ? "cursor-not-allowed text-fg-disabled"
        : danger
          ? "text-error hover:bg-error-soft focus:bg-error-soft"
          : "text-fg-secondary hover:bg-gray-100 hover:text-fg focus:bg-gray-100 focus:text-fg",
    );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerLabel}
        onClick={() => setOpen((v) => !v)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              moveFocus(e.key === "ArrowDown" ? 1 : -1);
            }
            if (e.key === "Tab") setOpen(false);
          }}
          className={cx(
            "absolute top-[calc(100%+8px)] z-50 min-w-[220px] animate-rise rounded-md border border-divider bg-surface p-1.5 text-fg shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {header && <div className="mb-1 border-b border-divider px-3 pt-2.5 pb-3">{header}</div>}
          {items.map((item, i) => {
            if (item.type === "divider") return <hr key={i} className="my-1 border-divider" />;
            const close = () => setOpen(false);
            if (item.href && !item.disabled) {
              return (
                <Link key={i} href={item.href} role="menuitem" className={itemClass(item.danger)} onClick={close}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                className={itemClass(item.danger, item.disabled)}
                onClick={() => {
                  if (item.disabled) return;
                  close();
                  item.onSelect?.();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
