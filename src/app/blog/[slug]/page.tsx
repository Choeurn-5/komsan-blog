import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getCategories, getRelatedPosts } from "@/lib/wordpress";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostMeta } from "@/components/PostMeta";
import { PostContent } from "@/components/PostContent";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { cleanExcerpt } from "@/lib/cleanWordPressContent";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Komsan Kampot Resort Blog" };
  }

  const title = post.title.rendered.replace(/<[^>]+>/g, "");
  const excerpt = cleanExcerpt(post.excerpt.rendered || post.content.rendered, 25);
  const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  return {
    title: `${title} | Komsan Kampot Resort Blog`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  // Get primary category
  const postCategories = post._embedded?.["wp:term"]?.find((terms) => terms.length > 0 && terms[0].taxonomy === "category") || [];
  let primaryCategory: { id: number; name: string; slug: string; taxonomy: string; link?: string } | null = null;
  let categoryObject: any = null;
  
  if (postCategories.length > 0) {
    primaryCategory = postCategories[0];
    const allCategories = await getCategories().catch(() => []);
    categoryObject = allCategories.find(c => c.id === primaryCategory?.id) || null;
  }

  // Get related posts
  let relatedPosts: any[] = [];
  if (categoryObject) {
    relatedPosts = await getRelatedPosts(categoryObject.id, post.id).catch(() => []);
  }

  const title = post.title.rendered;
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url || null;
  const imageAlt = featuredMedia?.alt_text || title.replace(/<[^>]+>/g, "");

  return (
    <main className="flex flex-col w-full min-h-screen selection:bg-[var(--brand-accent)] selection:text-[var(--brand-accent-text)] pb-20">
      
      <article className="max-w-4xl mx-auto w-full px-6 sm:px-10 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex-1 min-w-0">
            <Breadcrumbs category={categoryObject} postTitle={title} />
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
        
        <header className="mb-10">
          <h1 
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--brand-text)] leading-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <PostMeta post={post} />
        </header>

        {imageUrl && (
          <figure className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-16 shadow-lg border border-[var(--brand-border)] bg-[var(--brand-secondary)]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </figure>
        )}

        <div className="mx-auto max-w-3xl">
          <PostContent html={post.content.rendered} />

          <div className="mt-8">
            <ShareButtons title={title} slug={slug} />
          </div>
        </div>
        
        <RelatedPosts posts={relatedPosts} />
        
        <div className="mt-16 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-secondary)] border border-[var(--brand-border)] text-[var(--brand-text)] rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)]/50 transition-all hover:border-[var(--brand-accent)]/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Journal
          </Link>
        </div>
      </article>
    </main>
  );
}
