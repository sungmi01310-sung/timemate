import { Avatar, Rating } from "@/components/common";
import { formatDate } from "@/lib/format";
import type { Review, User } from "@/types";

export interface ReviewCardProps {
  review: Pick<Review, "rating" | "content" | "createdAt">;
  author: Pick<User, "nickname" | "avatarUrl">;
  /** 어떤 재능에 대한 후기인지 (재능 상세 페이지에서는 생략) */
  talentTitle?: string;
}

export function ReviewCard({ review, author, talentTitle }: ReviewCardProps) {
  return (
    <article className="rounded-lg border border-divider bg-surface p-5">
      <header className="flex items-center gap-2.5">
        <Avatar name={author.nickname} src={author.avatarUrl} size={36} />
        <div className="flex min-w-0 flex-1 flex-col">
          <strong className="text-[14px]">{author.nickname}</strong>
          <time dateTime={review.createdAt} className="text-caption font-normal text-fg-muted">
            {formatDate(review.createdAt)}
          </time>
        </div>
        <Rating value={review.rating} />
      </header>
      {talentTitle && <p className="mt-3 text-body-sm text-fg-muted">{talentTitle}</p>}
      <p className="mt-2 text-fg-secondary">{review.content}</p>
    </article>
  );
}
