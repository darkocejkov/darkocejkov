/**
 * Orbit and rail navigation nodes. Positions derive from index and array
 * length, so adding a section is one entry here and nothing else.
 */
export interface SceneNode {
  slug: string;
  href: string;
  label: string;
  icon: string;
}

export const NODES: ReadonlyArray<SceneNode> = [
  { slug: "projects", href: "/projects", label: "Projects", icon: "\u25C9" },
  { slug: "brain-words", href: "/brain", label: "brain words", icon: "\u25CC" },
  { slug: "bookmarks", href: "/bookmarks", label: "Bookmarks", icon: "\u25CA" },
  { slug: "about", href: "/about", label: "About", icon: "\u25EF" },
  { slug: "things", href: "/things", label: "Things", icon: "\u25F0" },
  { slug: "experience", href: "/experience", label: "Experience", icon: "\u25D0" },
  { slug: "education", href: "/education", label: "Education", icon: "\u25F7" },
  { slug: "connect", href: "/connect", label: "Connect", icon: "\u25D1" },
  { slug: "art", href: "/art", label: "Art", icon: "\u25F1" },
];

/** Index of the node owning a pathname, or -1 on the homepage / an unknown route. */
export function nodeIndexForPath(pathname: string): number {
  return NODES.findIndex((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
}
