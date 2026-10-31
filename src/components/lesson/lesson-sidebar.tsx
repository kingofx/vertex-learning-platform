"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";

export type SidebarModule = {
  key: string;
  number: number;
  title: string;
  duration: string;
  lessons: { id: string; title: string; slug: string; duration: string }[];
};

export function LessonSidebar({
  courseTitle,
  courseSlug,
  cover,
  modules,
  currentModule,
  currentLessonSlug,
}: {
  courseTitle: string;
  courseSlug: string;
  cover: string | null;
  modules: SidebarModule[];
  currentModule: number;
  currentLessonSlug: string;
}) {
  const [openModule, setOpenModule] = useState<number | null>(currentModule);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="flex flex-col border-b border-neutral-100 lg:w-[265px] lg:shrink-0 lg:border-r lg:border-b-0">
      <div className="flex flex-col gap-5 px-5 pt-6 pb-4 sm:px-10 lg:px-6">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-body text-primary-600"
        >
          <Icon name="arrowLeft" size={16} />
          Back to course
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-neutral-900">
            {cover && (
              <Image src={cover} alt="" fill sizes="56px" className="object-cover" />
            )}
          </div>
          <p className="font-display text-body font-medium">{courseTitle}</p>
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="lesson-modules"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 items-center justify-between rounded-md border border-neutral-200 bg-white px-4 text-body lg:hidden"
        >
          Course content
          <Icon
            name="chevronDown"
            size={16}
            className={mobileOpen ? "rotate-180" : ""}
          />
        </button>
      </div>

      <div className="px-5 sm:px-10 lg:px-0">
        <p className="hidden border-y border-neutral-100 px-6 py-3 text-body lg:block">
          Module {currentModule} of {modules.length}
        </p>
        <ol
          id="lesson-modules"
          className={`${mobileOpen ? "flex" : "hidden"} flex-col pb-4 lg:flex lg:pb-0`}
        >
          {modules.map((module) => {
            const open = openModule === module.number;
            const isCurrent = module.number === currentModule;
            return (
              <li key={module.key} className={`border-b border-neutral-100 ${isCurrent ? "bg-white/50" : ""}`}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenModule(open ? null : module.number)}
                  className="flex w-full items-center gap-3 px-1 py-4 text-left lg:px-6"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-small ${
                      isCurrent
                        ? "bg-primary-500 font-semibold text-white"
                        : "border border-neutral-200 bg-white"
                    }`}
                  >
                    {module.number}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-small font-medium">{module.title}</span>
                    <span className="text-small text-neutral-500">{module.duration}</span>
                  </span>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className={`shrink-0 text-neutral-500 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <ul className="ml-[17px] flex flex-col gap-1 border-l border-neutral-200 pb-4 pl-6 lg:ml-[39px]">
                    {module.lessons.map((lesson) => {
                      const current = lesson.slug === currentLessonSlug;
                      return (
                        <li key={lesson.id} className="relative">
                          <span
                            aria-hidden="true"
                            className={`absolute top-3 -left-[28px] size-1.5 rounded-full ${
                              current ? "bg-primary-500" : "border border-neutral-300 bg-page"
                            }`}
                          />
                          <Link
                            href={`/lessons/${lesson.slug}`}
                            aria-current={current ? "page" : undefined}
                            className="flex items-center justify-between gap-2 rounded-sm py-1.5 pr-3 hover:text-primary-600"
                          >
                            <span className="flex flex-col">
                              <span className="text-small">{lesson.title}</span>
                              <span className={`text-small ${current ? "text-primary-500" : "text-neutral-500"}`}>
                                {current ? "Now playing" : lesson.duration}
                              </span>
                            </span>
                            {current && (
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                                <Icon name="play" variant="filled" size={12} />
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
