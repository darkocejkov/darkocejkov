const R2_URL = "https://assets.darkocejkov.ca";

/**
 * Resolve a bucket-relative path against the public R2 domain. Absolute URLs
 * remain available for externally hosted assets.
 */
export function assetUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  return new URL(src, `${R2_URL}/`).toString();
}

/** Anything that is not site-relative or an in-page anchor leaves the site. */
export function isExternalHref(href: string): boolean {
  return !href.startsWith("/") && !href.startsWith("#");
}
