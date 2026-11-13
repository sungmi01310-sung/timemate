import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: { absolute: "TimeMate · 시간으로 재능을 교환하세요" },
  description: "당신의 시간은 소중하고 가치 있습니다. 내 재능을 나누고, 필요한 재능을 만나보세요. 1시간 = 1 Time Coin.",
};

export default function Page() {
  return <HomePage />;
}
