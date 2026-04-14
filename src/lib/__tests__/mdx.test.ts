import { describe, it, expect } from "vitest";
import { compileMdx } from "../mdx";

describe("compileMdx", () => {
  it("compiles markdown to function body", async () => {
    const source = "# Hello\n\nThis is a paragraph.";
    const result = await compileMdx(source);

    expect(result).toContain("Hello");
    expect(result).toContain("paragraph");
  });

  it("handles code blocks", async () => {
    const source = '```typescript\nconst x = 1;\n```';
    const result = await compileMdx(source);

    expect(result).toContain("const x = 1");
  });

  it("handles empty content", async () => {
    const result = await compileMdx("");
    expect(typeof result).toBe("string");
  });
});
