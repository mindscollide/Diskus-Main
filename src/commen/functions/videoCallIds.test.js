import { describe, it, expect } from "vitest";
import { isUsableVideoId, findMissingVideoIds } from "./videoCallIds";

/**
 * Regression coverage for the raise-hand bug: a missing ID went out as the text
 * "null" ({"RoomID":"null","UID":"null","IsHandRaised":true}) because callers do
 * String(localStorage.getItem(key)) and String(null) === "null".
 */
describe("isUsableVideoId", () => {
  it("accepts real room ids and guids", () => {
    expect(isUsableVideoId("4821")).toBe(true);
    expect(isUsableVideoId(4821)).toBe(true);
    expect(isUsableVideoId("0f8fad5b-d9cb-469f-a165-70867728950e")).toBe(true);
  });

  it("rejects real null and undefined", () => {
    expect(isUsableVideoId(null)).toBe(false);
    expect(isUsableVideoId(undefined)).toBe(false);
  });

  it('rejects the text "null" and "undefined" that String() produces', () => {
    // The exact failure signature: String(localStorage.getItem("missing")).
    expect(isUsableVideoId(String(localStorage.getItem("key-never-set")))).toBe(false);
    expect(isUsableVideoId("null")).toBe(false);
    expect(isUsableVideoId("undefined")).toBe(false);
    expect(isUsableVideoId(String(undefined))).toBe(false);
  });

  it("rejects blank strings and ignores case / surrounding whitespace", () => {
    expect(isUsableVideoId("")).toBe(false);
    expect(isUsableVideoId("   ")).toBe(false);
    expect(isUsableVideoId(" NULL ")).toBe(false);
    expect(isUsableVideoId("Undefined")).toBe(false);
  });

  it("does not block 0 — that is left for the server to judge", () => {
    expect(isUsableVideoId(0)).toBe(true);
    expect(isUsableVideoId("0")).toBe(true);
  });
});

describe("findMissingVideoIds", () => {
  it("returns [] when both ids are usable", () => {
    expect(findMissingVideoIds({ RoomID: "12", UID: "abc", IsHandRaised: true })).toEqual([]);
  });

  it("reports the exact payload from the bug as both fields missing", () => {
    expect(
      findMissingVideoIds({ RoomID: "null", UID: "null", IsHandRaised: true }),
    ).toEqual(["RoomID", "UID"]);
  });

  it("reports only the field that is missing", () => {
    expect(findMissingVideoIds({ RoomID: "12", UID: "null" })).toEqual(["UID"]);
    expect(findMissingVideoIds({ RoomID: "undefined", UID: "abc" })).toEqual(["RoomID"]);
  });

  it("treats an absent field or absent payload as missing", () => {
    expect(findMissingVideoIds({ RoomID: "12" })).toEqual(["UID"]);
    expect(findMissingVideoIds(undefined)).toEqual(["RoomID", "UID"]);
  });

  it("does not inspect fields that are not required", () => {
    // IsHandRaised is a boolean and must never be validated as an id.
    expect(findMissingVideoIds({ RoomID: "1", UID: "2", IsHandRaised: false })).toEqual([]);
  });

  it("can be pointed at other field names", () => {
    expect(findMissingVideoIds({ RoomID: "1", GuestID: "null" }, ["RoomID", "GuestID"])).toEqual(["GuestID"]);
  });
});
