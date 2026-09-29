import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { assetUrl, isExternalHref } from "./asset";
import type { Asset } from "./schema";

/** Shared prose styling, previously duplicated in Markdown.tsx and RichText.tsx. */
export const PROSE_CLASS = [
  "prose prose-neutral dark:prose-invert max-w-none",
  "prose-headings:font-funnel prose-headings:font-semibold",
  "prose-a:underline-offset-2",
  "prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:rounded-lg prose-pre:bg-neutral-100",
  "prose-img:rounded-lg",
].join(" ");

/** A row of captioned images, usable mid-body or from a page template. */
export function Gallery({ images }: { images: Asset[] }) {
  if (!images?.length) return null;
  return (
    <ul className="not-prose my-8 flex flex-col gap-8">
      {images.map((image) => (
        <li key={image.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(image.src)} alt={image.alt} className="w-full rounded-lg" />
          {image.caption && <p className="mt-2 text-xs text-gray-400">{image.caption}</p>}
        </li>
      ))}
    </ul>
  );
}

/** A sandboxed iframe. The URL comes from content, never markup. */
export function Embed({ url, title }: { url: string; title: string }) {
  return (
    <div className="not-prose my-8 aspect-video w-full overflow-hidden rounded-lg bg-brand-dark/5 dark:bg-brand-white/5">
      <iframe
        src={url}
        title={title}
        className="h-full w-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allowFullScreen
      />
    </div>
  );
}

const components = {
  // Content references uploads by relative path; resolve to the CMS origin here
  // so nothing in content/ knows where the CMS lives.
  img: ({ src, alt }: { src?: string; alt?: string }) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={assetUrl(src)} alt={alt ?? ""} className="rounded-lg" />
    ) : null,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    if (!href) return <span>{children}</span>;
    return isExternalHref(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    );
  },
  Gallery,
  Embed,
};

/** Render an MDX body with the site's component map and prose styling. */
export async function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className={PROSE_CLASS}>
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
