import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-surface/80 backdrop-blur-lg">
      <nav aria-label="메인 네비게이션" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-headline text-xl font-semibold italic text-primary"
        >
          Digital Curator
        </Link>
        <ul className="flex gap-6">
          <li>
            <Link
              href="/"
              className="font-label text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              홈
            </Link>
          </li>
          <li>
            <Link
              href="/archive"
              className="font-label text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              아카이브
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
