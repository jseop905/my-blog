import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "../category-filter";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: mockPush }),
}));

afterEach(() => {
  mockPush.mockClear();
});

describe("CategoryFilter", () => {
  const categories = ["Architecture", "Design", "DevOps"];

  it('renders "전체" button and all categories', () => {
    render(<CategoryFilter categories={categories} />);

    expect(screen.getByText("전체")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("DevOps")).toBeInTheDocument();
  });

  it("navigates to archive with category when clicked", async () => {
    const user = userEvent.setup();
    render(<CategoryFilter categories={categories} />);

    await user.click(screen.getByText("Architecture"));

    expect(mockPush).toHaveBeenCalledWith("/archive?category=Architecture");
  });

  it('navigates to archive without category when "전체" clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryFilter categories={categories} />);

    await user.click(screen.getByText("전체"));

    expect(mockPush).toHaveBeenCalledWith("/archive");
  });

  it("renders all buttons as accessible", () => {
    render(<CategoryFilter categories={categories} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4); // 전체 + 3 categories
  });
});
