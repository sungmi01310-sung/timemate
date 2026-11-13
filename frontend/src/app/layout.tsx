import type { Metadata, Viewport } from "next";
import { StoreHydrator } from "@/store/StoreHydrator";
import { Toaster } from "@/components/common";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TimeMate · 타임메이트",
    template: "%s · TimeMate",
  },
  description: "시간으로 재능을 교환하는 플랫폼. 1시간 = 1 Time Coin. 당신의 시간은 소중하고 가치 있다.",
};

export const viewport: Viewport = {
  themeColor: "#1D2129",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard (가변 폰트, 동적 서브셋) */}
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <StoreHydrator />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
