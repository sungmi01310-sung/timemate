"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";
import type { CategoryId } from "@/types";
import { CATEGORY_ICON } from "./meta";

/**
 * 재능 대표 이미지.
 * - 이미지 없음 → 카테고리 아이콘 기본 이미지
 * - 로딩 중 → 은은한 shimmer
 * - 로딩 실패(깨진 URL) → 기본 이미지로 대체
 * 크기·비율은 부모(className)가 정한다.
 */
export function TalentImage({
  src,
  category,
  alt = "",
  className,
  iconClassName = "size-11",
}: {
  src?: string;
  category: CategoryId;
  alt?: string;
  className?: string;
  iconClassName?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  // src 가 바뀌면 상태 초기화 (렌더 중 상태 조정 패턴)
  const [lastSrc, setLastSrc] = useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    setStatus("loading");
  }

  // 서버 렌더링된 <img> 는 React 가 이벤트를 연결하기 전에 로딩이 끝날 수 있다(onLoad/onError 유실).
  // 마운트 직후 이미 끝난 상태인지 직접 확인해서 반영한다.
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    const finished = img.naturalWidth > 0 ? "loaded" : "error";
    // 외부(DOM) 상태를 React 상태로 동기화하는 1회성 보정
    setStatus(finished);
  }, [src]);

  const Icon = CATEGORY_ICON[category];
  const showImage = src && status !== "error";

  return (
    <div className={cx("relative flex items-center justify-center overflow-hidden bg-secondary text-white/80", className)}>
      {(!showImage || status === "loading") && <Icon className={iconClassName} strokeWidth={1.5} aria-hidden />}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cx(
            "absolute inset-0 size-full object-cover transition-[opacity,transform] duration-300 group-hover:scale-[1.03]",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {showImage && status === "loading" && <span className="absolute inset-0 animate-shimmer bg-white/5" aria-hidden />}
    </div>
  );
}
