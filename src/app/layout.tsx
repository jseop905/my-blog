import type { Metadata } from "next";
import { newsreader } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Digital Curator",
  description: "퍼스널 지식 아카이브 블로그",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={newsreader.variable}>
      <body className="bg-surface font-body text-on-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] rounded-lg bg-primary px-4 py-2 font-label text-sm text-on-primary focus:outline-none focus:ring-2 focus:ring-primary-fixed"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main
          id="main-content"
          className="mx-auto min-h-screen max-w-6xl px-6 pt-20 pb-16"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
