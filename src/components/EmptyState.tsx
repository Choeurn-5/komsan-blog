interface EmptyStateProps {
  title?: string;
  message?: string;
  onClear?: () => void;
}

export function EmptyState({ title = "No stories found", message = "We couldn't find any stories matching your criteria.", onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--brand-secondary)] rounded-2xl border border-[var(--brand-border)]">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)] mb-4"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      <h3 className="font-playfair text-2xl text-[var(--brand-text)] mb-2">{title}</h3>
      <p className="text-[var(--brand-muted)] mb-6 max-w-md mx-auto">{message}</p>
      {onClear && (
        <button 
          onClick={onClear}
          className="px-6 py-2 bg-[var(--brand-card)] text-[var(--brand-text)] border border-[var(--brand-border)] rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)] transition-all hover:border-[var(--brand-accent)]/50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
