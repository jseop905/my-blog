import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  reverse?: boolean;
}

export function PostCard({ post, reverse = false }: PostCardProps) {
  return (
    <article className="group">
      <Link
        href={`/posts/${post.slug}`}
        className={`flex flex-col gap-6 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {post.thumbnail && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl md:w-2/5">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
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
          <h3 className="font-headline text-2xl font-semibold italic text-on-surface transition-colors group-hover:text-primary md:text-3xl">
            {post.title}
          </h3>
          <p className="font-body text-base leading-relaxed text-on-surface-variant">
            {post.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
