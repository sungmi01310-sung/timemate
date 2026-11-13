import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "내 글" };

export default function Page() {
  return <ComingSoon contained={false} title="내 글" step={10} />;
}
