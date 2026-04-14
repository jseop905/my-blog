import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "../post-card";
import type { Post } from "@/types/post";

const mockPost: Post = {
  slug: "test-post",
  title: "테스트 포스트",
  description: "테스트 설명입니다.",
  date: "2024-06-01",
  categories: ["Architecture", "Design"],
  pinned: false,
};

describe("PostCard", () => {
  it("renders the post title", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("테스트 포스트")).toBeInTheDocument();
  });

  it("renders the post description", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("테스트 설명입니다.")).toBeInTheDocument();
  });

  it("renders categories", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Architecture")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("renders the date", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("2024-06-01")).toBeInTheDocument();
  });

  it("links to the post detail page", () => {
    render(<PostCard post={mockPost} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/posts/test-post");
  });
});
