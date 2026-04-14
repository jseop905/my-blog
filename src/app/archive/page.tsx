import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import { PostList } from "@/components/post/post-list";
import { CategoryFilter } from "@/components/ui/category-filter";

interface ArchivePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const { category } = await searchParams;
  const allPosts = await getAllPosts();
  const categories = [...new Set(allPosts.flatMap((p) => p.categories))].sort();

  const filteredPosts = category
    ? allPosts.filter((post) => post.categories.includes(category))
    : allPosts;

  return (
    <div className="py-8">
      <h1 className="mb-8 font-headline text-3xl font-bold italic text-on-surface">
        아카이브
      </h1>
      <Suspense>
        <CategoryFilter categories={categories} />
      </Suspense>
      <div className="mt-8">
        {filteredPosts.length === 0 ? (
          <p className="py-12 text-center font-body text-on-surface-variant">
            {category
              ? `"${category}" 카테고리에 해당하는 글이 없습니다.`
              : "아직 게시글이 없습니다."}
          </p>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </div>
    </div>
  );
}
