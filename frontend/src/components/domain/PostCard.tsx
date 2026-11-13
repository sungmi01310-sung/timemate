"use client";

import Link from "next/link";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { Avatar, Badge, RelativeTime } from "@/components/common";
import { cx } from "@/lib/format";
import { POST_CATEGORY_LABEL, type Post, type User } from "@/types";

export interface PostCardProps {
  post: Pick<Post, "id" | "category" | "title" | "content" | "images" | "likeCount" | "commentCount" | "liked" | "saved" | "createdAt">;
  author: Pick<User, "nickname" | "avatarUrl">;
  onToggleLike?: (id: string) => void;
  onToggleSave?: (id: string) => void;
}

const actionBtn =
  "inline-flex h-[34px] items-center gap-1.5 rounded-sm px-2.5 text-body-sm font-medium text-fg-muted transition-colors hover:bg-gray-100 hover:text-fg";

/** 커뮤니티 피드 게시글 카드 */
export function PostCard({ post, author, onToggleLike, onToggleSave }: PostCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-divider bg-surface p-5">
      <header className="flex items-center gap-2.5">
        <Avatar name={author.nickname} src={author.avatarUrl} size={36} />
        <div className="flex min-w-0 flex-1 flex-col">
          <strong className="text-[14px]">{author.nickname}</strong>
          <RelativeTime iso={post.createdAt} className="text-caption font-normal text-fg-muted" />
        </div>
        <Badge>{POST_CATEGORY_LABEL[post.category]}</Badge>
      </header>

      <Link href={`/community/${post.id}`} className="group flex flex-col gap-1.5 rounded-sm">
        <h3 className="text-h4 group-hover:underline group-hover:underline-offset-[3px]">{post.title}</h3>
        <p className="line-clamp-3 text-fg-secondary">{post.content}</p>
        {post.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.images[0]} alt="" className="mt-1.5 max-h-80 w-full rounded-md object-cover" />
        )}
      </Link>

      <footer className="flex items-center gap-1 border-t border-divider pt-2">
        <button
          type="button"
          aria-pressed={post.liked}
          onClick={() => onToggleLike?.(post.id)}
          className={cx(actionBtn, post.liked && "text-fg")}
        >
          <Heart size={16} className={post.liked ? "fill-navy" : undefined} />
          좋아요 {post.likeCount}
        </button>
        <Link href={`/community/${post.id}#comments`} className={actionBtn}>
          <MessageCircle size={16} />
          댓글 {post.commentCount}
        </Link>
        <button
          type="button"
          aria-pressed={post.saved}
          aria-label={post.saved ? "저장 취소" : "저장"}
          onClick={() => onToggleSave?.(post.id)}
          className={cx(actionBtn, "ml-auto", post.saved && "text-fg")}
        >
          <Bookmark size={16} className={post.saved ? "fill-navy" : undefined} />
        </button>
      </footer>
    </article>
  );
}
