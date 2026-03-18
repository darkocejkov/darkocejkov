export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center px-8 py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-cyan/20 border-t-brand-cyan" />
        <p className="text-sm text-brand-dark/40 dark:text-brand-white/40">Loading…</p>
      </div>
    </main>
  );
}
