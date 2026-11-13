"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, MINUTE);
  return () => clearInterval(t);
};
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE;
const getServerSnapshot = () => null;

/**
 * 현재 시각(분 단위). 서버/prerender 에서는 null 을 반환한다.
 * cacheComponents 환경에서 렌더 중 Date.now()/new Date() 직접 호출을 피하기 위해 사용.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
