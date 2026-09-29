import { describe, expect, it } from "vitest";
import { contentDir } from "./index";
import { load } from "./load";
import { resolve } from "./graph";

/**
 * Validates the real content tree, not a fixture. This is what
 * `npm run content:check` runs — the pre-commit substitute for a CMS admin
 * refusing to publish something broken.
 */
describe("the real content directory", () => {
  it("loads and resolves with no schema or reference errors", () => {
    const graph = resolve(load(contentDir()), { includeDrafts: false });
    expect(graph.about.displayName.length).toBeGreaterThan(0);
  });

  // Development renders drafts, so a draft with a broken reference has to fail
  // the check too — and the tree has to actually contain one, or this asserts
  // nothing. The count comparison is what proves that.
  it("resolves with drafts included, and they are the only difference", () => {
    const published = resolve(load(contentDir()), { includeDrafts: false });
    const withDrafts = resolve(load(contentDir()), { includeDrafts: true });

    expect(withDrafts.articles.length).toBeGreaterThan(published.articles.length);
    expect(withDrafts.articles.filter((a) => a.draft).length).toBe(
      withDrafts.articles.length - published.articles.length
    );
    expect(published.articles.every((a) => !a.draft)).toBe(true);
  });
});
