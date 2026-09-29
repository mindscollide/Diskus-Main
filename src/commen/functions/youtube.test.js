import { describe, it, expect } from "vitest";
import { extractYouTubeId, youTubeEmbedUrl } from "./youtube";

const ID = "dQw4w9WgXcQ";

describe("extractYouTubeId", () => {
  it("accepts a bare id, as the FAQ data historically held", () => {
    expect(extractYouTubeId(ID)).toBe(ID);
    expect(extractYouTubeId(`  ${ID}  `)).toBe(ID);
  });

  it("extracts the id from every common URL form", () => {
    const urls = [
      `https://www.youtube.com/watch?v=${ID}`,
      `https://youtube.com/watch?v=${ID}&t=42s`,
      `https://www.youtube.com/watch?feature=share&v=${ID}`,
      `https://m.youtube.com/watch?v=${ID}`,
      `https://youtu.be/${ID}`,
      `https://youtu.be/${ID}?si=abc`,
      `https://www.youtube.com/embed/${ID}`,
      `https://www.youtube-nocookie.com/embed/${ID}`,
      `https://www.youtube.com/shorts/${ID}`,
      `https://www.youtube.com/live/${ID}`,
      `www.youtube.com/watch?v=${ID}`,
    ];
    // Collect the failures so a break names exactly which URL forms regressed.
    const unparsed = urls.filter((url) => extractYouTubeId(url) !== ID);
    expect(unparsed).toEqual([]);
  });

  it("returns null when there is nothing usable", () => {
    expect(extractYouTubeId("")).toBeNull();
    expect(extractYouTubeId("   ")).toBeNull();
    expect(extractYouTubeId(null)).toBeNull();
    expect(extractYouTubeId(undefined)).toBeNull();
    expect(extractYouTubeId(12345)).toBeNull();
    expect(extractYouTubeId("https://example.com/watch?v=" + ID)).toBeNull();
    expect(extractYouTubeId("https://www.youtube.com/")).toBeNull();
    expect(extractYouTubeId("short")).toBeNull();
  });
});

describe("youTubeEmbedUrl", () => {
  it("builds a clean embed URL from a bare id or a full URL", () => {
    const want = `https://www.youtube.com/embed/${ID}`;
    expect(youTubeEmbedUrl(ID)).toBe(want);
    expect(youTubeEmbedUrl(`https://www.youtube.com/watch?v=${ID}&t=9`)).toBe(want);
  });

  it("never produces the broken nested URL the old code did", () => {
    // Old behaviour: embed/https://www.youtube.com/watch?v=...
    expect(youTubeEmbedUrl(`https://www.youtube.com/watch?v=${ID}`)).not.toContain("embed/https");
  });

  it("returns null so the caller can skip the player", () => {
    expect(youTubeEmbedUrl("")).toBeNull();
    expect(youTubeEmbedUrl("garbage")).toBeNull();
  });
});
