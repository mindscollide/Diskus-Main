import { describe, it, expect, vi, afterEach } from "vitest";
import { withFreshIframeLoad } from "./urlVideoCalls";

const BASE = "https://secure.letsdiskus.com:9414/index.html";

describe("withFreshIframeLoad", () => {
  afterEach(() => vi.useRealTimers());

  it("appends _v to a URL that already has a query", () => {
    vi.useFakeTimers({ now: 1234 });
    expect(withFreshIframeLoad(`${BASE}?userName=A&sessionKey=9`)).toBe(
      `${BASE}?userName=A&sessionKey=9&_v=1234`
    );
  });

  it("starts the query when the URL has none", () => {
    vi.useFakeTimers({ now: 1234 });
    expect(withFreshIframeLoad(BASE)).toBe(`${BASE}?_v=1234`);
  });

  it("keeps a hash after the query", () => {
    vi.useFakeTimers({ now: 1234 });
    expect(withFreshIframeLoad(`${BASE}?a=1#top`)).toBe(`${BASE}?a=1&_v=1234#top`);
  });

  it("leaves an empty URL empty, so the panel still renders no iframe", () => {
    expect(withFreshIframeLoad("")).toBe("");
    expect(withFreshIframeLoad(null)).toBe(null);
  });
});
