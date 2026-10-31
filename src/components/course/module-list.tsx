"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { capturePostHogEvent } from "@/lib/posthog";

export type ModuleItem = {
  key: string;
  number: number;
  title: string;
  summary: string | null;
  duration: string;
  lessons: {
    id: string;
    number: string;
    title: string;
    slug: string;
    duration: string;
    freePreview: boolean;
  }[];
};

const INITIAL_COUNT = 6;

export function ModuleList({ modules }: { modules: ModuleItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const hasMore = modules.length > INITIAL_COUNT;
  const visible = showAll ? modules : modules.slice(0, INITIAL_COUNT);

  return (
    <div className={`relative ${hasMore && !showAll ? "pb-7" : ""}`}>
      <ul className="overflow-hidden rounded-lg border border-neutral-100 bg-white/60">
        {visible.map((module) => {
          const expanded = open === module.key;
          const panelId = `module-${module.key}`;
          return (
            <li
              key={module.key}
              className="border-b border-neutral-100 last:border-b-0"
            >
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(expanded ? null : module.key);
                  capturePostHogEvent("module_toggled", {
                    module_number: module.number,
                    action: expanded ? "collapsed" : "expanded",
                    lesson_count: module.lessons.length,
                  });
                }}
                className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-body">
                  {module.number}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-display text-body-lg font-medium">
                    {module.title}
                  </span>
                  {module.summary && (
                    <span className="text-small text-neutral-500">
                      {module.summary}
                    </span>
                  )}
                  <span className="text-small text-neutral-500 sm:hidden">
                    {module.duration}
                  </span>
                </span>
                <span className="hidden text-body text-neutral-500 sm:block">
                  {module.duration}
                </span>
                <Icon
                  name="chevronDown"
                  size={18}
                  className={`shrink-0 text-neutral-700 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded && (
                <ul
                  id={panelId}
                  className="flex flex-col gap-1 border-t border-neutral-100 bg-white px-4 py-3 sm:pr-5 sm:pl-[68px]"
                >
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-neutral-50"
                        onClick={() =>
                          capturePostHogEvent("lesson_selected", {
                            lesson_id: lesson.id,
                            lesson_number: lesson.number,
                            lesson_slug: lesson.slug,
                            module_number: module.number,
                            is_free_preview: lesson.freePreview,
                          })
                        }
                      >
                        <span className="w-8 shrink-0 text-small text-neutral-500">
                          {lesson.number}
                        </span>
                        <span className="min-w-0 flex-1 text-body">
                          {lesson.title}
                        </span>
                        {lesson.freePreview && (
                          <span className="text-small font-medium text-primary-600">
                            Free preview
                          </span>
                        )}
                        <span className="text-small text-neutral-500">
                          {lesson.duration}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => {
            setShowAll(true);
            capturePostHogEvent("all_modules_revealed", {
              module_count: modules.length,
              initially_visible_count: INITIAL_COUNT,
            });
          }}
          className="absolute bottom-0 left-1/2 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-md border border-neutral-200 bg-page px-6 text-body"
        >
          Show all {modules.length} modules
          <Icon name="chevronDown" size={16} />
        </button>
      )}
    </div>
  );
}
