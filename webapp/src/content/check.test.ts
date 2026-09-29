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

  it("resolves identically with drafts included", () => {
    expect(() => resolve(load(contentDir()), { includeDrafts: true })).not.toThrow();
  });
});
