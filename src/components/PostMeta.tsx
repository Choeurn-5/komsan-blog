import Image from "next/image";
import { WordPressPost } from "@/lib/wordpress";
import { calculateReadingTime } from "@/lib/cleanWordPressContent";

interface PostMetaProps {
  post: WordPressPost;
}

export function PostMeta({ post }: PostMetaProps) {
  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Komsan Kampot Resort";
  const avatarUrl = author?.avatar_urls?.["96"] || author?.avatar_urls?.["48"] || null;
  
  const publishDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const readingTime = calculateReadingTime(post.content.rendered);

  return (
    <div className="flex items-center gap-4 py-6 border-y border-[var(--brand-border)] my-8">
      {avatarUrl ? (
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--brand-secondary)] shrink-0">
          <Image src={avatarUrl} alt={authorName} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-[var(--brand-secondary)] border-2 border-[var(--brand-border)] flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)]"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      )}
      
      <div className="flex flex-col">
        <span className="font-semibold text-[var(--brand-text)]">{authorName}</span>
        <div className="flex items-center gap-2 text-sm text-[var(--brand-muted)]">
          <time dateTime={post.date}>{publishDate}</time>
          <span className="w-1 h-1 rounded-full bg-[var(--brand-border)]" aria-hidden="true" />
          <span>{readingTime} MIN READ</span>
        </div>
      </div>
    </div>
  );
}
