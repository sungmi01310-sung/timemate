"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { INITIAL_LIKED_IDS } from "@/lib/api/talents";

/**
 * 관심(하트) 재능 id 목록.
 * [MOCK] localStorage 에 저장. 실제 연동 시 POST/DELETE /api/talents/:id/like 호출 후 결과 반영.
 */
interface LikeState {
  ids: string[];
  toggle: (id: string) => boolean; // 토글 후 관심 상태 반환
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      ids: INITIAL_LIKED_IDS,
      toggle: (id) => {
        const liked = !get().ids.includes(id);
        set({ ids: liked ? [...get().ids, id] : get().ids.filter((x) => x !== id) });
        return liked;
      },
    }),
    { name: "tm-likes", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
