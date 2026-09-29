/**
 * The orbiting page nodes. Orbit positions derive from index and array length,
 * so adding a sixth node is one entry here and nothing else.
 */
export interface SceneNode {
  slug: string;
  href: string;
  label: string;
}

export const NODES: ReadonlyArray<SceneNode> = [
  { slug: "work", href: "/projects", label: "Work" },
  { slug: "blog", href: "/blog", label: "Blog" },
  { slug: "bookmarks", href: "/bookmarks", label: "Bookmarks" },
  { slug: "about", href: "/about", label: "About" },
  { slug: "things", href: "/things", label: "Things" },
];

/** Index of the node owning a pathname, or -1 on the homepage / an unknown route. */
export function nodeIndexForPath(pathname: string): number {
  return NODES.findIndex((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
}
