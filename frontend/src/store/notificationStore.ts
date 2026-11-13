"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppNotification, ID } from "@/types";
import { mockNotifications } from "@/mocks/data";

/** 알림 목록과 읽음 상태. [MOCK] 실제 연동 시 서버 목록 + 실시간(WebSocket) 푸시로 교체. */
interface NotificationState {
  items: AppNotification[];
  push: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markRead: (id: ID) => void;
  markAllRead: () => void;
  remove: (id: ID) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      items: mockNotifications,
      push: (n) =>
        set((s) => ({
          items: [
            { ...n, id: `n_${Date.now().toString(36)}`, read: false, createdAt: new Date().toISOString() },
            ...s.items,
          ],
        })),
      markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
      remove: (id) => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
    }),
    { name: "tm-notifications", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

export const useUnreadCount = () => useNotificationStore((s) => s.items.filter((n) => !n.read).length);
