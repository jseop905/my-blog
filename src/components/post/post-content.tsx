import Image from "next/image";
import type { ComponentType } from "react";

type MdxComponents = Record<string, ComponentType<Record<string, unknown>>>;

interface MdxContentProps {
  components?: MdxComponents;
}

interface PostContentProps {
  // MDX components accept a `components` prop but the exact type varies
  Content: ComponentType<MdxContentProps> | ComponentType<Record<string, unknown>>;
}

const mdxComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  h1: (props) => (
    <h1
      className="mb-6 font-headline text-4xl font-bold italic text-on-surface"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-4 mt-12 font-headline text-2xl font-semibold italic text-on-surface"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-8 font-headline text-xl font-semibold italic text-on-surface"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-6 font-body text-base leading-[1.8] tracking-wide text-on-surface"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-6 list-disc space-y-2 pl-6 font-body text-base leading-[1.8] text-on-surface"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-6 list-decimal space-y-2 pl-6 font-body text-base leading-[1.8] text-on-surface"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 rounded-lg bg-primary-fixed/20 px-6 py-4 font-body text-base italic leading-[1.8] text-on-surface"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg bg-inverse-surface p-4 text-sm leading-relaxed text-inverse-on-surface"
      {...props}
    />
  ),
  code: (props: Record<string, unknown>) => {
    const isInline = typeof props.children === "string";
    if (isInline) {
      return (
        <code
          className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-sm text-primary-container"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  img: (props: Record<string, unknown>) => (
    <Image
      className="my-6 rounded-sm"
      alt={(props.alt as string) || ""}
      src={(props.src as string) || ""}
      width={800}
      height={450}
      style={{ width: "100%", height: "auto" }}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-on-surface" {...props} />
  ),
};

export function PostContent({ Content }: PostContentProps) {
  const MdxContent = Content as ComponentType<MdxContentProps>;
  return (
    <div className="prose-custom">
      <MdxContent components={mdxComponents} />
    </div>
  );
}
