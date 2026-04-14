import { compile, run, type RunOptions } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { Fragment } from "react";
import type { ComponentType } from "react";

type MdxComponent = ComponentType<Record<string, unknown>>;

export async function compileMdx(source: string): Promise<string> {
  const result = await compile(source, {
    outputFormat: "function-body",
  });

  return String(result);
}

export async function renderMdx(
  source: string,
): Promise<{ default: MdxComponent }> {
  const code = await compileMdx(source);

  const result = await run(code, {
    ...runtime,
    Fragment,
    baseUrl: import.meta.url,
  } as RunOptions);

  return result as { default: MdxComponent };
}
