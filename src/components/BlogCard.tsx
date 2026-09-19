import Image from "next/image";
import Link from "next/link";
import { WordPressPost } from "@/lib/wordpress";
import { cleanExcerpt, calculateReadingTime } from "@/lib/cleanWordPressContent";

interface BlogCardProps {
  post: WordPressPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const title = post.title.rendered;
  const excerpt = cleanExcerpt(post.excerpt.rendered || post.content.rendered, 25);
  const readingTime = calculateReadingTime(post.content.rendered);
  
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url || null;
  const imageAlt = featuredMedia?.alt_text || title;
  
  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Komsan Kampot Resort";

  const categories = post._embedded?.["wp:term"]?.find((terms) => terms.length > 0 && terms[0].taxonomy === "category") || [];
  const primaryCategory = categories.length > 0 ? categories[0].name : null;

  const publishDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="komsan-blog-card group flex flex-col bg-[var(--brand-card)] rounded-2xl overflow-hidden border border-[var(--brand-border)] hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)] h-full"
    >
      <div className="relative w-full aspect-[4/3] bg-[var(--brand-secondary)] overflow-hidden shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--brand-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}
        {primaryCategory && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-2.5 py-1 bg-[var(--brand-bg)]/90 backdrop-blur-sm text-[var(--brand-text)] text-[10px] font-semibold uppercase tracking-wider rounded-full border border-[var(--brand-border)]">
              {primaryCategory}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--brand-muted)] mb-3">
          <time dateTime={post.date}>{publishDate}</time>
          <span className="w-1 h-1 rounded-full bg-[var(--brand-border)]" aria-hidden="true" />
          <span className="truncate max-w-[100px]">By {authorName}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--brand-border)]" aria-hidden="true" />
          <span>{readingTime} MIN READ</span>
        </div>
        
        <h3 className="font-playfair text-xl font-bold text-[var(--brand-text)] mb-3 group-hover:text-[var(--brand-accent)] transition-colors line-clamp-2">
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </h3>
        
        <p className="text-[var(--brand-muted)] text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-[var(--brand-border)] inline-flex items-center gap-2 text-sm text-[var(--brand-text)] font-medium group-hover:gap-3 transition-all w-full">
          Read Story
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}
