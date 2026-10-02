import type { Experience } from "@/content";

/** Headline figures from a writeup's frontmatter, set large. */
export default function Highlights({ items }: { items: Experience["highlights"] }) {
  if (items.length === 0) return null;
  return (
    <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
      {items.map((item) => (
        // The second column sets flush right, keeping both clear of the centred iris.
        <div
          key={`${item.value}-${item.label}`}
          className="flex flex-col-reverse border-t-4 border-brand-orange pt-3 sm:even:items-end sm:even:text-right"
        >
          <dt className="mt-2 font-mono text-xs lowercase leading-snug text-gray-500">{item.label}</dt>
          <dd className="whitespace-nowrap font-funnel text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tighter">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
