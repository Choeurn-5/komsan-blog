import Image from "next/image";
import Link from "next/link";
import { WordPressPost } from "@/lib/wordpress";
import { cleanExcerpt, calculateReadingTime } from "@/lib/cleanWordPressContent";

interface FeaturedPostProps {
  post: WordPressPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const title = post.title.rendered;
  const excerpt = cleanExcerpt(post.excerpt.rendered || post.content.rendered, 35);
  const readingTime = calculateReadingTime(post.content.rendered);
  
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url || null;
  const imageAlt = featuredMedia?.alt_text || title;
  
  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Komsan Kampot Resort";

  const categories = post._embedded?.["wp:term"]?.find((terms) => terms.length > 0 && terms[0].taxonomy === "category") || [];
  const primaryCategory = categories.length > 0 ? categories[0].name : null;

  const publishDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="komsan-blog-card group block relative bg-[var(--brand-card)] rounded-2xl md:rounded-3xl overflow-hidden border border-[var(--brand-border)] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)]"
    >
      <div className="flex flex-col lg:flex-row h-full">
        <div className="relative w-full lg:w-3/5 aspect-[16/10] lg:aspect-auto min-h-[300px] lg:min-h-[400px] bg-[var(--brand-secondary)] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--brand-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          )}
          {primaryCategory && (
            <div className="absolute top-6 left-6 z-10">
              <span className="inline-block px-3 py-1 bg-[var(--brand-bg)]/90 backdrop-blur-sm text-[var(--brand-text)] text-xs font-semibold uppercase tracking-wider rounded-full border border-[var(--brand-border)]">
                {primaryCategory}
              </span>
            </div>
          )}
        </div>
        <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-[var(--brand-muted)] mb-4">
            <time dateTime={post.date}>{publishDate}</time>
            <span className="w-1 h-1 rounded-full bg-[var(--brand-border)]" aria-hidden="true" />
            <span className="truncate max-w-[120px] md:max-w-[200px]">By {authorName}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--brand-border)]" aria-hidden="true" />
            <span>{readingTime} MIN READ</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--brand-text)] mb-6 group-hover:text-[var(--brand-accent)] transition-colors line-clamp-3">
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </h2>
          <p className="text-[var(--brand-muted)] text-lg mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
            {excerpt}
          </p>
          <div className="mt-auto inline-flex items-center gap-2 text-[var(--brand-text)] font-medium group-hover:gap-3 transition-all">
            Read Story
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
