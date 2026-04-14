import { describe, it, expect } from "vitest";
import {
  getAllPosts,
  getPostBySlug,
  getPinnedPosts,
  getCategories,
} from "../posts";

describe("getAllPosts", () => {
  it("returns only published posts", async () => {
    const posts = await getAllPosts();
    const slugs = posts.map((p) => p.slug);

    expect(slugs).toContain("clean-architecture");
    expect(slugs).toContain("editorial-design");
    expect(slugs).not.toContain("draft-post");
  });

  it("returns posts sorted by date descending", async () => {
    const posts = await getAllPosts();
    const dates = posts.map((p) => new Date(p.date).getTime());

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  it("does not include post content in results", async () => {
    const posts = await getAllPosts();

    for (const post of posts) {
      expect(post).not.toHaveProperty("content");
    }
  });
});

describe("getPostBySlug", () => {
  it("returns a post with content for a valid slug", async () => {
    const post = await getPostBySlug("clean-architecture");

    expect(post).not.toBeNull();
    expect(post!.title).toBe("클린 아키텍처의 재해석");
    expect(post!.content).toContain("# 클린 아키텍처의 재해석");
  });

  it("returns null for a nonexistent slug", async () => {
    const post = await getPostBySlug("nonexistent-post");
    expect(post).toBeNull();
  });

  it("returns null for an unpublished post", async () => {
    const post = await getPostBySlug("draft-post");
    expect(post).toBeNull();
  });
});

describe("getPinnedPosts", () => {
  it("returns only pinned posts", async () => {
    const posts = await getPinnedPosts();

    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.pinned).toBe(true);
    }
  });

  it("includes the pinned sample post", async () => {
    const posts = await getPinnedPosts();
    const slugs = posts.map((p) => p.slug);

    expect(slugs).toContain("clean-architecture");
  });
});

describe("getCategories", () => {
  it("returns a deduplicated sorted list of categories", async () => {
    const categories = await getCategories();

    expect(categories).toEqual([...new Set(categories)].sort());
    expect(categories).toContain("Architecture");
    expect(categories).toContain("Design");
  });

  it("does not include categories from unpublished posts", async () => {
    const categories = await getCategories();
    expect(categories).not.toContain("Note");
  });
});
