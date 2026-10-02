import SocialArc from "@/components/SocialArc";
import { FlowParagraph, FlowTitle } from "@/components/flow/Flow";
import { assetUrl, getAbout, getLinks, getMetadata, getStatement } from "@/content";
import { Mdx } from "@/content/mdx";

export function generateMetadata() {
  const about = getAbout();
  return {
    title: `About — ${about.displayName}`,
    description: about.metaDescription,
  };
}

export default function AboutPage() {
  const about = getAbout();
  const metadata = getMetadata();
  const statement = getStatement();
  const links = getLinks("social");
  const portrait = about.portrait;

  const facts = [
    about.location && `based in ${about.location}`,
    metadata.currently && `currently ${metadata.currently}`,
    about.pronouns,
  ].filter(Boolean);

  return (
    <article className="max-w-3xl">
      {portrait && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assetUrl(portrait.src)}
          alt={portrait.alt}
          width={112}
          height={112}
          className="mb-8 h-28 w-28 rounded-full object-cover"
        />
      )}

      <FlowTitle>{about.displayName}</FlowTitle>

      {about.headline && (
        <p className="mt-6 font-funnel text-[clamp(1.75rem,5vw,3.75rem)] font-light leading-none tracking-tight">
          {about.headline}
        </p>
      )}

      {facts.length > 0 && (
        <p className="mt-6 font-mono text-sm lowercase text-gray-500">{facts.join(" · ")}</p>
      )}

      {about.shortBio && (
        <FlowParagraph className="mt-20 max-w-2xl text-[clamp(1.5rem,3.4vw,2.5rem)] font-medium leading-tight tracking-tight">
          {about.shortBio}
        </FlowParagraph>
      )}

      <Mdx source={about.body} className="mt-10 max-w-xl text-lg" />

      {statement.body.trim() && (
        <figure className="my-28">
          <Mdx
            source={statement.body}
            className="title-outline max-w-none font-funnel text-[clamp(2.5rem,8vw,6.5rem)] font-extrabold leading-[0.92] tracking-tighter text-transparent prose-p:my-0"
          />
        </figure>
      )}

      {metadata.downloads.length > 0 && (
        <ul className="flex flex-wrap gap-x-12 gap-y-6">
          {metadata.downloads.map((download) => (
            <li key={download.file}>
              <a
                href={assetUrl(download.file)}
                download
                className="font-funnel text-3xl font-bold lowercase tracking-tight underline decoration-brand-orange decoration-4 underline-offset-8 hover:text-brand-orange"
              >
                {download.title} ↓
              </a>
              {download.description && (
                <span className="mt-2 block text-sm text-gray-500">{download.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {about.email && (
        <p className="mt-20">
          <a
            href={`mailto:${about.email}`}
            className="break-all font-funnel text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-tight hover:text-brand-orange"
          >
            {about.email}
          </a>
        </p>
      )}

      <SocialArc links={links} />
    </article>
  );
}
