import { Sidebar } from "@/components/layout/Sidebar";

/** 마이페이지 공통 레이아웃: PC는 [사이드바 | 본문] 2단, 그 이하는 1단 */
export default function MyLayout({ children }: { children: React.ReactNode }) {
  return (
    // grid-cols-[minmax(0,1fr)]: 가로 스크롤 메뉴가 열 너비를 늘려 화면이 넘치는 것을 방지
    <div className="page-container grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
      <Sidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
