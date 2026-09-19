export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
      <div className="w-10 h-10 border-4 border-[var(--brand-border)] border-t-[var(--brand-accent)] rounded-full animate-spin mb-4"></div>
      <p className="text-[var(--brand-muted)] font-medium">Loading stories...</p>
    </div>
  );
}
