const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time from an MDX body. Code fences and standalone JSX are
 * stripped first — a long code sample is scanned, not read, and counting it
 * as prose inflates the estimate badly.
 */
export function readingTime(markdown: string): number | null {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ");
  const words = prose.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
