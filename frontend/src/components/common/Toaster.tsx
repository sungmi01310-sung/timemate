"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useToastStore, type ToastTone } from "@/store/toastStore";

const ICON: Record<ToastTone, React.ReactNode> = {
  default: null,
  success: <CheckCircle2 size={18} className="text-point" />,
  error: <AlertCircle size={18} className="text-[#ff8a8e]" />,
  info: <Info size={18} className="text-sub" />,
};

/** 루트 레이아웃에 1번만 배치. 어디서든 toast.success("...") 로 호출 */
export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[calc(var(--mobile-nav-h)+16px+env(safe-area-inset-bottom))] left-1/2 z-200 flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 flex-col items-center gap-2 lg:bottom-8"
    >
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className="pointer-events-auto inline-flex animate-rise items-center gap-2 rounded-md bg-navy px-[18px] py-3 text-left font-medium text-white shadow-lg"
        >
          {ICON[t.tone]}
          {t.message}
        </button>
      ))}
    </div>
  );
}
