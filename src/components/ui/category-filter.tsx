"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get("category");

  function handleSelect(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    const qs = params.toString();
    router.push(qs ? `/archive?${qs}` : "/archive");
  }

  return (
    <nav aria-label="카테고리 필터" className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect(null)}
        className={`rounded-full px-4 py-1.5 font-label text-sm font-medium transition-colors ${
          !current
            ? "bg-primary text-on-primary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        }`}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleSelect(category)}
          className={`rounded-full px-4 py-1.5 font-label text-sm font-medium transition-colors ${
            current === category
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
