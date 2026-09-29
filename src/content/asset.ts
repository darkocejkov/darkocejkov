const DEFAULT_CMS_URL = "http://localhost:1337";

/**
 * Resolve a relative CMS upload path against the CMS origin. Read per call
 * rather than at module load so tests and multi-environment builds see the
 * value that is current when the URL is actually needed.
 */
export function assetUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_CMS_URL ?? DEFAULT_CMS_URL;
  return `${base}${src}`;
}

/** Anything that is not site-relative or an in-page anchor leaves the site. */
export function isExternalHref(href: string): boolean {
  return !href.startsWith("/") && !href.startsWith("#");
}
