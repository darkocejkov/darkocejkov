import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/** The two singletons every valid content directory must contain. */
export const REQUIRED: Record<string, string> = {
  "about.mdx": "---\ndisplayName: Test Person\n---\n\nBio body.\n",
  "statement.mdx": "---\ntitle: Statement\n---\n\nStatement body.\n",
  "articles.mdx": "---\ntitle: Articles\nsubtitle: A subtitle\n---\n\nArticles description.\n",
  "metadata.mdx":
    "---\nlookingForWork: false\ncurrently: null\nunderConstruction: false\nnotifications: []\ndownloads: []\n---\n",
};

/** Build a throwaway content directory from a path-to-contents map. */
export function makeContentDir(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "content-"));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(dir, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, body, "utf8");
  }
  return dir;
}
