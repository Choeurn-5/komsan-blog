"use client";

import { useState, useMemo, useEffect } from "react";
import { WordPressPost, WordPressCategory } from "@/lib/wordpress";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "./EmptyState";
import { cleanExcerpt } from "@/lib/cleanWordPressContent";

interface BlogFiltersProps {
  initialPosts: WordPressPost[];
  categories: WordPressCategory[];
}

export function BlogFilters({ initialPosts, categories }: BlogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Check Category
      if (selectedCategoryId !== null && !post.categories.includes(selectedCategoryId)) {
        return false;
      }
      
      // Check Search Query
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase().trim();
        const titleMatch = post.title.rendered.toLowerCase().includes(query);
        const excerptMatch = cleanExcerpt(post.excerpt.rendered || post.content.rendered, 100).toLowerCase().includes(query);
        
        // Find if post's categories include the search string (by name)
        const postCategoryNames = post._embedded?.["wp:term"]?.flat()
          .filter(term => term.taxonomy === "category")
          .map(term => term.name.toLowerCase()) || [];
        const categoryMatch = postCategoryNames.some(name => name.toLowerCase().includes(query));

        if (!titleMatch && !excerptMatch && !categoryMatch) {
          return false;
        }
      }

      return true;
    });
  }, [initialPosts, debouncedSearchQuery, selectedCategoryId]);

  // Send iframe height message when filters change and cause re-render layout shift
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent && window !== window.parent) {
      setTimeout(() => {
        window.parent.postMessage({ type: "komsan-blog-height", height: document.documentElement.scrollHeight }, "*");
      }, 100);
    }
  }, [filteredPosts]);

  return (
    <div className="komsan-blog-filter flex flex-col gap-10">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-[var(--brand-card)] p-4 md:p-6 rounded-2xl border border-[var(--brand-border)] shadow-sm">
        
        <div className="relative flex-grow max-w-md">
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--brand-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            id="blog-search"
            type="text"
            placeholder="Search stories, topics, or ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[var(--brand-secondary)] border border-[var(--brand-border)] rounded-full text-[var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent placeholder:text-[var(--brand-muted)]/70 transition-shadow"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--brand-muted)] hover:text-[var(--brand-text)] focus:outline-none"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 items-center hide-scrollbar">
          <button
            onClick={() => setSelectedCategoryId(null)}
            aria-pressed={selectedCategoryId === null}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] ${
              selectedCategoryId === null 
                ? "bg-[var(--brand-accent)] text-[var(--brand-accent-text)] shadow-md" 
                : "bg-[var(--brand-secondary)] text-[var(--brand-muted)] border border-[var(--brand-border)] hover:border-[var(--brand-accent)]/50 hover:text-[var(--brand-text)]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              aria-pressed={selectedCategoryId === cat.id}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] ${
                selectedCategoryId === cat.id 
                  ? "bg-[var(--brand-accent)] text-[var(--brand-accent-text)] shadow-md" 
                  : "bg-[var(--brand-secondary)] text-[var(--brand-muted)] border border-[var(--brand-border)] hover:border-[var(--brand-accent)]/50 hover:text-[var(--brand-text)]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <EmptyState 
          title="No stories match your search"
          message={`We couldn't find any results${debouncedSearchQuery ? ` for "${debouncedSearchQuery}"` : ""}. Try adjusting your filters.`}
          onClear={() => {
            setSearchQuery("");
            setSelectedCategoryId(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
