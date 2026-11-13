import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "내 재능" };

export default function Page() {
  return <ComingSoon contained={false} title="내 재능" step={10} />;
}
