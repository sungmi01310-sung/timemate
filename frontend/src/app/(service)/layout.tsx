import { AppShell } from "@/components/layout/AppShell";

/** 로그인 후 서비스 영역 */
export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
