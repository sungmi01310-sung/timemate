"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/types";
import { ME_ID, mockUsers } from "@/mocks/data";

/**
 * 로그인 상태 / 현재 사용자.
 * [MOCK] STEP 7(로그인/회원가입) 구현 전까지는 데모 사용자로 자동 로그인 상태를 유지한다.
 *        실제 연동 시 login() 에서 NestJS /api/auth/login 응답(토큰 + 사용자)을 저장한다.
 */
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Omit<User, "id" | "email">>) => void;
}

const demoUser = mockUsers.find((u) => u.id === ME_ID) ?? null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: demoUser,
      isLoggedIn: demoUser !== null,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateProfile: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    {
      name: "tm-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
