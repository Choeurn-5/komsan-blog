import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function NotFound() {
  return (
    <main className="flex flex-col w-full min-h-screen selection:bg-[var(--brand-accent)] selection:text-[var(--brand-accent-text)]">
      <div className="w-full flex justify-end p-6 md:px-16 md:py-12">
        <ThemeToggle />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-playfair text-6xl md:text-8xl font-bold text-[var(--brand-text)] mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl text-[var(--brand-text)] mb-4">Story Not Found</h2>
        <p className="text-[var(--brand-muted)] max-w-md mx-auto mb-10">
          The article you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/blog"
          className="px-8 py-3 bg-[var(--brand-accent)] text-[var(--brand-accent-text)] rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)]/50 transition-all hover:shadow-lg hover:opacity-90"
        >
          Back to Journal
        </Link>
      </div>
    </main>
  );
}
