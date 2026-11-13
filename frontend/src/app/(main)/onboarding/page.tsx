import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import {
  HowSection,
  IntroSection,
  PersonaSection,
  SpacesSection,
  TimeCoinSection,
  TrustSection,
  ValuesSection,
} from "@/components/about/AboutSections";
import { BottomCta } from "@/components/home/BottomCta";
import { Reveal } from "@/components/common";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: "당신의 한 시간이 누군가에게 새로운 가능성이 됩니다. 돈이 아닌 시간으로 연결되는 재능 교환 플랫폼, TIMEMATE.",
};

/**
 * 서비스 소개 페이지 (/onboarding).
 * (main) 그룹 → 공통 Header/Footer 사용, 비회원 접근 가능, 히어로가 헤더에 바로 붙음.
 * 흐름: 히어로 → 왜 필요한가 → 어떻게 작동하나 → Time Coin → 가치 → 세 가지 공간 → 신뢰 → 추천 대상 → CTA
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <IntroSection />
      <HowSection />
      <TimeCoinSection />
      <ValuesSection />
      <SpacesSection />
      <TrustSection />
      <PersonaSection />
      <div className="page-container py-16 md:py-24">
        <Reveal>
          <BottomCta
            title="당신의 재능이 누군가의 시작이 됩니다."
            description="지금 TIMEMATE에서 서로의 시간을 연결해 보세요."
            primary={{ label: "내 재능 등록하기", href: "/my/talents" }}
            secondary={{ label: "재능 찾아보기", href: "/talents" }}
          />
        </Reveal>
      </div>
    </>
  );
}
