import Link from "next/link";
import { WordPressCategory } from "@/lib/wordpress";

interface BreadcrumbsProps {
  category: WordPressCategory | null;
  postTitle: string;
}

export function Breadcrumbs({ category, postTitle }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--brand-muted)]">
        <li>
          <Link href="/" className="hover:text-[var(--brand-accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] rounded-sm">
            Home
          </Link>
        </li>
        <li>
          <span className="text-[var(--brand-border)]" aria-hidden="true">/</span>
        </li>
        <li>
          <Link href="/blog" className="hover:text-[var(--brand-accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] rounded-sm">
            Blog
          </Link>
        </li>
        {category && (
          <>
            <li>
              <span className="text-[var(--brand-border)]" aria-hidden="true">/</span>
            </li>
            <li>
              <Link href={`/blog?category=${category.id}`} className="hover:text-[var(--brand-accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] rounded-sm">
                {category.name}
              </Link>
            </li>
          </>
        )}
        <li>
          <span className="text-[var(--brand-border)]" aria-hidden="true">/</span>
        </li>
        <li className="text-[var(--brand-text)] font-medium truncate max-w-[200px] sm:max-w-[300px]" aria-current="page">
          <span dangerouslySetInnerHTML={{ __html: postTitle }} />
        </li>
      </ol>
    </nav>
  );
}
