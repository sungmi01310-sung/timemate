import { Hammer } from "lucide-react";
import { Button, EmptyState } from "@/components/common";
import { PageHeader } from "./PageHeader";

/** 아직 구현되지 않은 페이지 자리표시자. 각 STEP에서 실제 페이지로 교체한다. */
export function ComingSoon({
  title,
  step,
  description,
  contained = true,
}: {
  title: string;
  step: number;
  description?: string;
  /** 상위 레이아웃이 이미 container 를 제공하면 false */
  contained?: boolean;
}) {
  return (
    <div className={contained ? "page-container" : undefined}>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={<Hammer size={24} />}
        title="준비 중인 페이지예요"
        description={`STEP ${step}에서 구현될 예정입니다.`}
        action={
          <Button href="/" variant="secondary">
            홈으로
          </Button>
        }
      />
    </div>
  );
}
