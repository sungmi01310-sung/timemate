import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "캘린더" };

export default function Page() {
  return <ComingSoon contained={false} title="캘린더" step={10} />;
}
