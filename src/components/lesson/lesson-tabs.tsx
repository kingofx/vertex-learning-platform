"use client";

import { useId, useState, type ReactNode } from "react";

const tabs = ["Lesson Content", "Notes"] as const;

export function LessonTabs({ content }: { content: ReactNode }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Lesson Content");
  const id = useId();

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" className="flex gap-8 border-b border-neutral-100 px-1">
        {tabs.map((tab) => {
          const selected = active === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`${id}-${tab}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${tab}`}
              onClick={() => setActive(tab)}
              className={`-mb-px border-b-2 px-2 pb-3 font-display text-body-lg ${
                selected
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-Lesson Content`}
        aria-labelledby={`${id}-Lesson Content`}
        hidden={active !== "Lesson Content"}
      >
        {content}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-Notes`}
        aria-labelledby={`${id}-Notes`}
        hidden={active !== "Notes"}
      >
        <p className="rounded-md border border-neutral-100 bg-white/60 p-6 text-body text-neutral-500">
          Your notes for this lesson will appear here.
        </p>
      </div>
    </div>
  );
}
