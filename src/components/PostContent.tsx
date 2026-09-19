"use client";

import { useEffect, useMemo } from "react";
import { cleanArticleContent } from "@/lib/cleanWordPressContent";

interface PostContentProps {
  html: string;
}

export function PostContent({ html }: PostContentProps) {
  const cleanedHtml = useMemo(() => cleanArticleContent(html), [html]);

  useEffect(() => {
    // Send iframe height after images load
    if (typeof window !== "undefined" && window.parent && window !== window.parent) {
      setTimeout(() => {
        window.parent.postMessage({ type: "komsan-blog-height", height: document.documentElement.scrollHeight }, "*");
      }, 500);
    }
  }, [html]);

  return (
    <div 
      className="komsan-blog-content prose prose-lg md:prose-xl max-w-none text-[var(--brand-muted)] 
      prose-headings:font-playfair prose-headings:font-bold prose-headings:text-[var(--brand-text)]
      prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-3xl
      prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-2xl
      prose-p:leading-relaxed prose-p:mb-6
      prose-a:text-[var(--brand-accent)] prose-a:no-underline hover:prose-a:underline
      prose-strong:font-semibold prose-strong:text-[var(--brand-text)]
      prose-ul:list-disc prose-ol:list-decimal prose-li:my-2
      prose-img:rounded-xl prose-img:border prose-img:border-[var(--brand-border)] prose-img:shadow-sm prose-img:mx-auto
      prose-blockquote:border-l-4 prose-blockquote:border-[var(--brand-accent)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--brand-text)]"
      dangerouslySetInnerHTML={{ __html: cleanedHtml }}
    />
  );
}
