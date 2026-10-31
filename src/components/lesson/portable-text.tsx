import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ComponentProps } from "react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-body-lg text-neutral-500">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="mt-2 font-display text-heading-3 font-medium text-neutral-900">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-2 text-body-lg font-semibold text-neutral-900">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary-300 pl-4 text-body-lg text-neutral-500 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-5 flex list-disc flex-col gap-1 text-body-lg text-neutral-500">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="ml-5 flex list-decimal flex-col gap-1 text-body-lg text-neutral-500">
        {children}
      </ol>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded-xs bg-neutral-100 px-1 py-0.5 text-[0.9em] text-neutral-900">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      return (
        <a
          href={href}
          className="text-primary-600 underline"
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function Notes({ value }: { value: ComponentProps<typeof PortableText>["value"] }) {
  return (
    <div className="flex flex-col gap-4">
      <PortableText value={value} components={components} />
    </div>
  );
}
