"use client";

import { useEffect, useRef } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { capturePostHogEvent } from "@/lib/posthog";
import { Icon } from "@/components/ui/icons";

export function CourseViewed({
  courseSlug,
  level,
  moduleCount,
}: {
  courseSlug: string;
  level: string | null;
  moduleCount: number | null;
}) {
  const capturedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (capturedSlug.current === courseSlug) return;

    capturePostHogEvent("course_viewed", {
      course_slug: courseSlug,
      course_level: level,
      module_count: moduleCount,
    });
    capturedSlug.current = courseSlug;
  }, [courseSlug, level, moduleCount]);

  return null;
}

export function CourseActions({
  courseSlug,
  firstLessonSlug,
}: {
  courseSlug: string;
  firstLessonSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {firstLessonSlug && (
        <ButtonLink
          href={`/lessons/${firstLessonSlug}`}
          size="lg"
          className="h-14 px-6 shadow-md"
          icon={<Icon name="arrowRight" size={20} />}
          onClick={() =>
            capturePostHogEvent("learning_started", {
              course_slug: courseSlug,
              lesson_slug: firstLessonSlug,
              source: "course_primary_action",
            })
          }
        >
          Start Learning
        </ButtonLink>
      )}
      <Button
        variant="tertiary"
        size="lg"
        className="h-14 px-6"
        icon={<Icon name="bookmark" size={20} />}
        iconPosition="start"
        onClick={() =>
          capturePostHogEvent("course_bookmarked", {
            course_slug: courseSlug,
          })
        }
      >
        Bookmark
      </Button>
    </div>
  );
}
