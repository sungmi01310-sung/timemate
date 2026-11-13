import { AppShell } from "@/components/layout/AppShell";

/**
 * 메인(/) · 서비스 소개(/onboarding) 레이아웃.
 * (service) 그룹과 같은 Header/Footer 를 쓰지만, 비회원도 볼 수 있도록 로그인 가드를 끄고(requireAuth=false)
 * 히어로가 헤더 바로 아래 붙도록 상단 여백을 없앤다(flush).
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell requireAuth={false} flush>
      {children}
    </AppShell>
  );
}
