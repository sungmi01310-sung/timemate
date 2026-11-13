"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "./authStore";

const subscribe = (cb: () => void) => useAuthStore.persist.onFinishHydration(cb);
const getSnapshot = () => useAuthStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/** authStore 가 localStorage 에서 복원되었는지 여부 (로그인 가드 판단용) */
export function useHasHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
