export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-cyan/20 border-t-brand-cyan" />
        <p className="text-sm text-brand-dark/40 dark:text-brand-white/40">Loading…</p>
      </div>
    </div>
  );
}
