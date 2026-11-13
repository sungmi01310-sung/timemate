import {
  BarChart3,
  CalendarDays,
  Coins,
  FileText,
  Home,
  LayoutDashboard,
  MessageCircle,
  ReceiptText,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 이 경로로 시작하면 활성화 */
  match?: string;
}

/** 헤더 메인 메뉴 (PC) */
export const MAIN_NAV: NavItem[] = [
  { href: "/talents", label: "재능 찾기", icon: Search },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/chat", label: "채팅", icon: MessageCircle },
  { href: "/my", label: "마이페이지", icon: User },
];

/** 하단 탭 (모바일) */
export const MOBILE_NAV: NavItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/talents", label: "재능", icon: Search },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/chat", label: "채팅", icon: MessageCircle },
  { href: "/my", label: "MY", icon: User },
];

/** 마이페이지 사이드바 */
export const MY_NAV: NavItem[] = [
  { href: "/my", label: "프로필", icon: User },
  { href: "/my/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/my/talents", label: "내 재능", icon: Sparkles },
  { href: "/my/calendar", label: "캘린더", icon: CalendarDays },
  { href: "/my/trades", label: "거래 내역", icon: ReceiptText },
  { href: "/my/coin", label: "Time Coin", icon: Coins },
  { href: "/my/stats", label: "가계부·통계", icon: BarChart3 },
  { href: "/my/posts", label: "내 글", icon: FileText },
  { href: "/my/settings", label: "설정", icon: Settings },
];

/** 푸터 정책·고객지원 링크 */
export const FOOTER_LINKS = [
  { href: "/onboarding", label: "서비스 소개" },
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침", strong: true },
  { href: "/support", label: "고객센터" },
];

export function isActive(pathname: string | null, href: string, exact = false) {
  if (!pathname) return false;
  if (href === "/" || exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
