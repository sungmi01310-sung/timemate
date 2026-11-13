import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // 상위 폴더(Desktop)의 package-lock.json 을 루트로 오인하지 않도록 고정
  turbopack: {
    root: path.join(import.meta.dirname),
  },
};

export default nextConfig;
