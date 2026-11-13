import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { Avatar, Badge, Rating, Skeleton, SkeletonText } from "@/components/common";
import { categoryLabel, type User } from "@/types";

export type ProfileCardUser = Pick<User, "nickname" | "avatarUrl" | "bio" | "interests" | "skills" | "rating" | "reviewCount" | "region">;

export interface ProfileCardProps {
  user: ProfileCardUser;
  /** full: 프로필 상세 / compact: 목록·채팅 헤더용 한 줄 */
  variant?: "full" | "compact";
  /** 팔로우·채팅 버튼 등 */
  actions?: ReactNode;
  /** 완료 거래 수 등 요약 수치 (full 에서만 표시) */
  stats?: { label: string; value: ReactNode }[];
}

export function ProfileCard({ user, variant = "full", actions, stats }: ProfileCardProps) {
  if (variant === "compact") {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={user.nickname} src={user.avatarUrl} size={44} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <strong className="truncate">{user.nickname}</strong>
          <Rating value={user.rating} count={user.reviewCount} size={12} />
        </div>
        {actions && <div className="ml-auto flex gap-1.5">{actions}</div>}
      </div>
    );
  }

  return (
    <section aria-label={`${user.nickname} 프로필`} className="flex flex-col gap-4 rounded-lg border border-divider bg-surface p-6">
      <div className="flex items-center gap-3.5">
        <Avatar name={user.nickname} src={user.avatarUrl} size={64} />
        <div>
          <h3 className="text-h3">{user.nickname}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={user.rating} count={user.reviewCount} />
            {user.region && (
              <span className="inline-flex items-center gap-0.5 text-body-sm text-fg-muted">
                <MapPin size={13} aria-hidden />
                {user.region}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-fg-secondary">{user.bio}</p>
      <dl className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2.5">
        <dt className="pt-0.5 text-label text-fg-muted">보유 재능</dt>
        <dd className="flex flex-wrap gap-1.5">
          {user.skills.map((s) => (
            <Badge key={s} tone="accent">
              {s}
            </Badge>
          ))}
        </dd>
        <dt className="pt-0.5 text-label text-fg-muted">관심 분야</dt>
        <dd className="flex flex-wrap gap-1.5">
          {user.interests.map((c) => (
            <Badge key={c}>{categoryLabel(c)}</Badge>
          ))}
        </dd>
      </dl>
      {stats && stats.length > 0 && (
        <dl className="grid grid-cols-3 divide-x divide-divider rounded-md bg-gray-100 py-3 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-0.5">
              <dt className="text-caption text-fg-muted">{s.label}</dt>
              <dd className="text-h4">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {actions && <div className="flex gap-2 [&>*]:flex-1">{actions}</div>}
    </section>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-4 rounded-lg border border-divider bg-surface p-6">
      <div className="flex items-center gap-3.5">
        <Skeleton circle className="size-16" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}
