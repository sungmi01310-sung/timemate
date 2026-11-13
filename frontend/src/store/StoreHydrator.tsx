"use client";

import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import { useWalletStore } from "./walletStore";
import { useNotificationStore } from "./notificationStore";
import { useLikeStore } from "./likeStore";

/**
 * persist 스토어는 SSR 결과와 맞추기 위해 skipHydration 으로 생성하고,
 * 마운트 후 localStorage 값으로 복원한다.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useWalletStore.persist.rehydrate();
    void useNotificationStore.persist.rehydrate();
    void useLikeStore.persist.rehydrate();
  }, []);
  return null;
}
