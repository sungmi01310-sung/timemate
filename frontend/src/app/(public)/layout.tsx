import { AppShell } from "@/components/layout/AppShell";

/**
 * 비회원도 볼 수 있는 서비스 페이지 (재능 찾기 · 재능 상세).
 * Header/Footer 는 (service) 와 동일하고 로그인 가드만 끈다.
 * 신청(/talents/[id]/apply)처럼 로그인이 필요한 하위 경로는 (service) 그룹에 둔다.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AppShell requireAuth={false}>{children}</AppShell>;
}
