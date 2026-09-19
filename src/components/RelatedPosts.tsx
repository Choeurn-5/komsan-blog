import { WordPressPost } from "@/lib/wordpress";
import { BlogCard } from "./BlogCard";

interface RelatedPostsProps {
  posts: WordPressPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-[var(--brand-border)]">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-playfair text-3xl font-bold text-[var(--brand-text)]">
          More from the Journal
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
