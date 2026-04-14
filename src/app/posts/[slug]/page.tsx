import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMdx } from "@/lib/mdx";
import { PostContent } from "@/components/post/post-content";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: `${post.title} — Digital Curator`,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { default: Content } = await renderMdx(post.content);

  return (
    <article className="mx-auto max-w-3xl py-8">
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          {post.categories.map((category) => (
            <span
              key={category}
              className="font-label text-xs font-medium tracking-wide text-primary uppercase"
            >
              {category}
            </span>
          ))}
          <span className="font-label text-xs text-on-surface-variant">
            {post.date}
          </span>
        </div>
        <h1 className="font-headline text-4xl font-bold italic leading-tight text-on-surface md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 font-body text-lg leading-relaxed text-on-surface-variant">
          {post.description}
        </p>
      </header>
      <PostContent Content={Content} />
    </article>
  );
}
