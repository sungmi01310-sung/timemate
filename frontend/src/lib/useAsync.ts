"use client";

import { useEffect, useState } from "react";

/**
 * 비동기 데이터 조회 훅 → Loading / Error / 성공 상태를 한 번에 관리.
 *
 *   const { data, loading, error, reload } = useAsync(() => getPopularTalents({ category }), [category]);
 *
 * deps 가 바뀌거나 reload() 를 호출하면 다시 요청한다.
 * 요청마다 key 를 붙여, 이전 요청의 늦은 응답이 화면을 덮어쓰지 않도록 한다.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [nonce, setNonce] = useState(0);
  const key = `${JSON.stringify(deps)}#${nonce}`;
  const [result, setResult] = useState<{ key: string; data?: T; error?: unknown } | null>(null);

  useEffect(() => {
    let alive = true;
    fn().then(
      (data) => alive && setResult({ key, data }),
      (error: unknown) => alive && setResult({ key, error }),
    );
    return () => {
      alive = false;
    };
    // key 가 deps + nonce 를 모두 반영하므로 key 만 의존성으로 둔다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = result?.key === key ? result : null;
  return {
    data: current?.data,
    error: current?.error,
    loading: current === null,
    reload: () => setNonce((n) => n + 1),
  };
}
