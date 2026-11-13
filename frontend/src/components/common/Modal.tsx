"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cx } from "@/lib/format";
import { Button } from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** 배경 클릭·ESC 로 닫기 허용 (기본 true) */
  dismissible?: boolean;
}

const SIZE = { sm: "md:max-w-[400px]", md: "md:max-w-[520px]", lg: "md:max-w-[720px]" };

/**
 * 공통 모달.
 * - ESC / 배경 클릭으로 닫힘, 열린 동안 body 스크롤 잠금
 * - 열릴 때 패널로 포커스 이동, 닫히면 원래 위치로 복귀
 * - 모바일(< md)에서는 하단 시트 형태
 */
export function Modal({ open, onClose, title, description, children, footer, size = "md", dismissible = true }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose, dismissible]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex animate-fade-in items-end justify-center bg-navy/50 md:items-center md:p-6"
      onMouseDown={(e) => dismissible && e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cx(
          "w-full max-h-[calc(100dvh-48px)] overflow-y-auto bg-surface p-6 shadow-lg focus-visible:shadow-lg",
          "animate-sheet rounded-t-2xl pb-[calc(24px+env(safe-area-inset-bottom))]",
          "md:animate-rise md:rounded-2xl md:pb-6",
          SIZE[size],
        )}
      >
        {(title || dismissible) && (
          <header className="mb-2 flex items-start justify-between gap-3">
            {title && (
              <h2 id={titleId} className="text-h3">
                {title}
              </h2>
            )}
            {dismissible && (
              <Button variant="ghost" size="sm" iconOnly onClick={onClose} aria-label="닫기" className="-mt-1.5 -mr-2 ml-auto">
                <X size={18} />
              </Button>
            )}
          </header>
        )}
        {description && <p className="text-fg-secondary">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {footer && <footer className="mt-6 flex gap-2">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/** 확인/취소 다이얼로그 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  danger,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={danger ? "danger" : "primary"} fullWidth onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    />
  );
}
