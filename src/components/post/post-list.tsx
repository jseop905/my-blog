import type { Post } from "@/types/post";
import { PostCard } from "./post-card";

interface PostListProps {
  posts: Post[];
  zigzag?: boolean;
}

export function PostList({ posts, zigzag = false }: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center font-body text-on-surface-variant">
        아직 게시글이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {posts.map((post, index) => (
        <PostCard
          key={post.slug}
          post={post}
          reverse={zigzag && index % 2 === 1}
        />
      ))}
    </div>
  );
}
