import type { ReactNode } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/common";

export interface BottomCtaProps {
  title?: ReactNode;
  description?: ReactNode;
  /** 민트 버튼 (기본: 재능 등록하기) */
  primary?: { label: string; href: string };
  /** 흰색 버튼 (기본: 재능 찾아보기) */
  secondary?: { label: string; href: string };
}

/**
 * 하단 CTA (다크 네이비). 메인·서비스 소개 페이지 공통.
 * props 를 넘기지 않으면 메인 페이지 기본 문구로 표시된다.
 */
export function BottomCta({
  title = (
    <>
      당신의 재능이 누군가에게
      <br />
      새로운 기회가 됩니다.
    </>
  ),
  description = "지금 가진 재능 하나로 첫 Time Coin을 모아보세요.",
  primary = { label: "재능 등록하기", href: "/my/talents" },
  secondary = { label: "재능 찾아보기", href: "/talents" },
}: BottomCtaProps) {
  return (
    <section aria-labelledby="cta-title" className="rounded-2xl bg-navy px-6 py-12 text-center text-white md:px-12 md:py-16">
      <h2 id="cta-title" className="text-h1">
        {title}
      </h2>
      <p className="mt-3 text-white/60">{description}</p>
      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        <Button href={primary.href} variant="accent" size="lg" leftIcon={<Plus size={18} />}>
          {primary.label}
        </Button>
        <Button href={secondary.href} variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
          {secondary.label}
        </Button>
      </div>
    </section>
  );
}
