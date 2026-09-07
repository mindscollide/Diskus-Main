import { describe, it, expect } from "vitest";
import { deriveHiddenUsers } from "./pendingSIgnatureFunctions";

/**
 * Signer-ordering rule: in an ordered workflow a signer may see their own and
 * earlier signers' fields, never a later signer's.
 *
 * These cases are the ones that actually broke in production. The rule used to
 * be read off a `getAllFieldsByWorkflowID.hiddenUsers` key that does not exist
 * on that response, so it was always `undefined` and nothing was ever hidden —
 * signer 2 could see signer 3's fields. The shapes below come from a real
 * GetWorkFlowByFileID response for a 3-signer chain.
 */

/** Bundle factory mirroring the real payload shape. */
const bundle = (pk, userId, dependsOn) => ({
  pK_WorkFlowActionableBundle_ID: pk,
  actors: [{ pK_UID: userId }],
  dependencies: dependsOn == null ? [] : [{ bundleID: pk, dependenceID: dependsOn }],
});

// 1567 signs first, then 1566, then 1568 — the real chain from file 6695.
const ordered = [
  bundle(3021, 1567, null),
  bundle(3022, 1566, 3021),
  bundle(3023, 1568, 3022),
];

// Same signers, no dependencies: everyone acts in parallel.
const unordered = [
  bundle(3021, 1567, null),
  bundle(3022, 1566, null),
  bundle(3023, 1568, null),
];

const sorted = (a) => [...a].sort((x, y) => x - y);

describe("deriveHiddenUsers", () => {
  describe("ordered workflow", () => {
    it("hides every later signer from the first signer", () => {
      expect(sorted(deriveHiddenUsers(ordered, 1567))).toEqual([1566, 1568]);
    });

    it("hides only the later signer from the middle signer", () => {
      // The regression this whole feature existed to prevent: 1566 must not see
      // 1568, but must still see 1567 (who has already signed).
      expect(deriveHiddenUsers(ordered, 1566)).toEqual([1568]);
    });

    it("hides nobody from the last signer", () => {
      expect(deriveHiddenUsers(ordered, 1568)).toEqual([]);
    });
  });

  describe("fails open rather than locking someone out", () => {
    it("hides nobody when the workflow has no ordering", () => {
      expect(deriveHiddenUsers(unordered, 1566)).toEqual([]);
    });

    it("hides nobody for a viewer who is not a signer at all", () => {
      // e.g. the document creator opening the read-only view.
      expect(deriveHiddenUsers(ordered, 9999)).toEqual([]);
    });

    it("returns [] for missing or malformed input", () => {
      expect(deriveHiddenUsers([], 1566)).toEqual([]);
      expect(deriveHiddenUsers(null, 1566)).toEqual([]);
      expect(deriveHiddenUsers(undefined, 1566)).toEqual([]);
    });
  });

  describe("edge cases that would break a naive implementation", () => {
    it("never hides the current user, even if they appear in a later bundle", () => {
      const reused = [bundle(1, 7, null), bundle(2, 8, 1), bundle(3, 7, 2)];
      // User 7 is both first and last. Hiding them from themselves would take
      // away their own fields and wedge the workflow.
      expect(deriveHiddenUsers(reused, 7)).toEqual([8]);
    });

    it("terminates on a cyclic dependency graph", () => {
      // Malformed data must not hang the render.
      const cyclic = [bundle(1, 7, 2), bundle(2, 8, 1)];
      expect(deriveHiddenUsers(cyclic, 7)).toEqual([8]);
    });

    it("ignores bundles with no actors", () => {
      const withEmpty = [
        bundle(3021, 1567, null),
        { pK_WorkFlowActionableBundle_ID: 3022, actors: [], dependencies: [{ bundleID: 3022, dependenceID: 3021 }] },
      ];
      expect(deriveHiddenUsers(withEmpty, 1567)).toEqual([]);
    });
  });
});
