"use client";

import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

/**
 * Renders a Strapi Blocks field. Replaces the old react-markdown path:
 * Blocks arrives as a structured tree rather than a string, which is what
 * lets individual node types be mapped to real components.
 */
export default function RichText({
  content,
  className,
}: {
  content: BlocksContent | null | undefined;
  className?: string;
}) {
  if (!Array.isArray(content) || content.length === 0) return null;

  return (
    <div
      className={[
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-funnel prose-headings:font-semibold",
        "prose-a:underline-offset-2",
        "prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:rounded-lg prose-pre:bg-neutral-100",
        "prose-img:rounded-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({ image }) => {
            const src = image.url?.startsWith("http") ? image.url : `${CMS_URL}${image.url}`;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={image.alternativeText ?? ""}
                width={image.width}
                height={image.height}
                className="rounded-lg"
              />
            );
          },
          link: ({ children, url }) => (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
}
