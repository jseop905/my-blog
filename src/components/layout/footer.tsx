import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="font-headline text-lg font-semibold italic text-primary"
          >
            Digital Curator
          </Link>
          <p className="font-label text-sm text-on-surface-variant">
            © {new Date().getFullYear()} Digital Curator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
