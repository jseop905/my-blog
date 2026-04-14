import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostList } from "@/components/post/post-list";

export default async function HomePage() {
  const allPosts = await getAllPosts();

  const pinnedPosts = allPosts.filter((p) => p.pinned);
  const latestPosts = allPosts.filter((p) => !p.pinned);
  const categories = [...new Set(allPosts.flatMap((p) => p.categories))].sort();

  const categoryCounts = allPosts.reduce<Record<string, number>>(
    (acc, post) => {
      for (const cat of post.categories) {
        acc[cat] = (acc[cat] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col gap-16 lg:flex-row lg:gap-12">
      <div className="flex-1 lg:w-2/3">
        {pinnedPosts.length > 0 && (
          <section>
            <h2 className="mb-8 font-headline text-xl font-semibold italic text-on-surface">
              Featured
            </h2>
            <PostList posts={pinnedPosts} zigzag />
          </section>
        )}

        <section className={pinnedPosts.length > 0 ? "mt-16" : ""}>
          <h2 className="mb-8 font-headline text-xl font-semibold italic text-on-surface">
            Latest
          </h2>
          <PostList posts={latestPosts} zigzag />
        </section>
      </div>

      <aside className="lg:w-1/3">
        <div className="rounded-xl bg-surface-container-low p-6">
          <h3 className="mb-4 font-label text-sm font-semibold tracking-wide text-on-surface-variant uppercase">
            카테고리
          </h3>
          <ul className="flex flex-col gap-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/archive?category=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 font-label text-sm text-on-surface transition-colors hover:bg-surface-container"
                >
                  <span>{category}</span>
                  <span className="text-xs text-on-surface-variant">
                    {categoryCounts[category]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
