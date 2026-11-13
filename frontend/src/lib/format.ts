/** 날짜/숫자 포맷 유틸 (ko-KR 고정, SSR·CSR 결과 일치) */

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 === 0 ? 12 : h % 12}:${pad(d.getMinutes())}`;
}

/** now 는 호출자가 주입한다 (렌더 중에는 useNow 사용 → RelativeTime 컴포넌트 참고) */
export function formatRelative(iso: string, now: number) {
  const diff = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return formatDate(iso);
}

export const formatCoin = (n: number) => `${n.toLocaleString("ko-KR")} TC`;

/**
 * 조건부 className 결합 도우미.
 *   cx("a", isOn && "b", undefined) → "a b"
 * (외부 라이브러리 없이 사용. 같은 속성 클래스가 겹치지 않도록 컴포넌트를 설계한다)
 */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

/** "11월 15일 (토) 오후 2:00" */
export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]}) ${formatTime(iso)}`;
}
