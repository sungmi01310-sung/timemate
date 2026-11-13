"use client";

import { create } from "zustand";

export type ToastTone = "default" | "success" | "error" | "info";

export interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastState {
  items: ToastItem[];
  show: (message: string, tone?: ToastTone, durationMs?: number) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  items: [],
  show: (message, tone = "default", durationMs = 2800) => {
    const id = nextId++;
    set({ items: [...get().items.slice(-2), { id, tone, message }] });
    setTimeout(() => get().dismiss(id), durationMs);
  },
  dismiss: (id) => set({ items: get().items.filter((t) => t.id !== id) }),
}));

/** 컴포넌트 밖에서도 사용할 수 있는 토스트 헬퍼 */
export const toast = {
  show: (m: string) => useToastStore.getState().show(m, "default"),
  success: (m: string) => useToastStore.getState().show(m, "success"),
  error: (m: string) => useToastStore.getState().show(m, "error"),
  info: (m: string) => useToastStore.getState().show(m, "info"),
};
