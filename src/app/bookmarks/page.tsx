import BookmarkSphere from "@/components/bookmarks/BookmarkSphere";
import { FlowTitle } from "@/components/flow/Flow";
import { getLinks } from "@/content";

export const metadata = { title: "Bookmarks" };

export default function Bookmarks() {
  const bookmarks = getLinks("bookmark").map(({ slug, title, url, tags }) => ({ slug, title, url, tags }));

  return (
    <>
      <FlowTitle className="title-outline pointer-events-none relative z-0 opacity-60">Bookmarks</FlowTitle>
      {bookmarks.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">Nothing saved yet.</p>
      ) : (
        <BookmarkSphere items={bookmarks} />
      )}
    </>
  );
}
