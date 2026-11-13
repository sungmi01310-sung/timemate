import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { HowSection, IntroSection, PersonaSection, TimeCoinSection, ValuesSection } from "@/components/about/AboutSections";
import { BottomCta } from "@/components/home/BottomCta";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: "당신의 한 시간이 누군가에게 새로운 가능성이 됩니다. 돈이 아닌 시간으로 연결되는 재능 교환 플랫폼, TIMEMATE.",
};

/**
 * 서비스 소개 페이지 (/onboarding).
 * (main) 그룹 → 공통 Header/Footer 사용, 비회원 접근 가능, 히어로가 헤더에 바로 붙음.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <IntroSection />
      <ValuesSection />
      <HowSection />
      <TimeCoinSection />
      <PersonaSection />
      <div className="page-container pb-16 md:pb-24">
        <BottomCta
          title="당신의 재능이 누군가의 시작이 됩니다."
          description="지금 TIMEMATE에서 서로의 시간을 연결해 보세요."
          primary={{ label: "내 재능 등록하기", href: "/my/talents" }}
          secondary={{ label: "재능 찾아보기", href: "/talents" }}
        />
      </div>
    </>
  );
}
