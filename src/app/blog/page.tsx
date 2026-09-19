import { getPosts, getCategories } from "@/lib/wordpress";
import { FeaturedPost } from "@/components/FeaturedPost";
import { BlogFilters } from "@/components/BlogFilters";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Komsan Kampot Resort Blog | Stories from Kampot",
  description: "Explore resort stories, Kampot travel ideas, dining, family experiences, and peaceful escapes from Komsan Kampot Resort.",
};

export default async function BlogListingPage() {
  const [posts, categories] = await Promise.all([
    getPosts(1, 10).catch(() => null),
    getCategories().catch(() => null)
  ]);

  if (posts === null || categories === null) {
    return (
      <main className="flex flex-col w-full min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-6 py-20">
          <ErrorState message="Could not connect to the WordPress API. Please check the URL or try again later." />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen selection:bg-[var(--brand-accent)] selection:text-[var(--brand-accent-text)]">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 py-12 md:py-20">
        <header className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--brand-text)] mb-6">
              Stories from Kampot
            </h1>
            <p className="text-[var(--brand-muted)] text-lg md:text-xl max-w-3xl leading-relaxed">
              Explore resort stories, Kampot travel ideas, dining, family experiences, and peaceful escapes from Komsan Kampot Resort.
            </p>
          </div>
          <div className="shrink-0 flex items-start md:mt-2">
            <ThemeToggle />
          </div>
        </header>

        {posts.length === 0 ? (
          <EmptyState 
            title="No stories available"
            message="We don't have any published stories yet. Check back soon!" 
          />
        ) : (
          <div className="space-y-16">
            <FeaturedPost post={posts[0]} />
            {posts.length > 1 && (
              <BlogFilters initialPosts={posts.slice(1)} categories={categories} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
