/** Formatting for the authored calendar dates in content frontmatter. Pure. */

/**
 * Frontmatter dates are bare calendar dates — `YYYY-MM-DD` or `YYYY-MM`, no
 * time and no zone. `new Date` parses those as UTC midnight, so formatting
 * them in the runtime's local zone renders the day before for any reader west
 * of UTC, which across a month boundary is the wrong month and can be the
 * wrong year. Pinning UTC renders what the author actually wrote.
 */
export function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** A role or qualification's span. An absent end means it is still running. */
export function formatRange(start: string, end: string | undefined): string {
  const from = formatMonthYear(start);
  if (!end) return `${from} – Present`;

  const to = formatMonthYear(end);
  // A stint that began and ended inside one month reads oddly as "May 2021 –
  // May 2021"; it is one month, so say so once.
  return from === to ? from : `${from} – ${to}`;
}
