interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong while loading the stories.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--brand-secondary)] rounded-2xl border border-[var(--brand-border)]">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)] mb-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h3 className="font-playfair text-2xl text-[var(--brand-text)] mb-2">Unable to load stories</h3>
      <p className="text-[var(--brand-muted)] mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-[var(--brand-accent)] text-[var(--brand-accent-text)] rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)]/50 transition-all hover:opacity-90"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
