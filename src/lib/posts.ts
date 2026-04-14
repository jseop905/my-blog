import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostWithContent } from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function parseMdxFile(slug: string): PostWithContent | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    categories: data.categories ?? [],
    tags: data.tags,
    thumbnail: data.thumbnail,
    pinned: data.pinned ?? false,
    published: data.published ?? true,
    content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      return parseMdxFile(slug);
    })
    .filter((post): post is PostWithContent => post !== null)
    .filter((post) => post.published !== false)
    .map(({ content: _, ...post }) => post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export async function getPostBySlug(
  slug: string,
): Promise<PostWithContent | null> {
  const post = parseMdxFile(slug);

  if (!post || post.published === false) {
    return null;
  }

  return post;
}

export async function getPinnedPosts(): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((post) => post.pinned === true);
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllPosts();
  const categories = new Set(all.flatMap((post) => post.categories));
  return [...categories].sort();
}
