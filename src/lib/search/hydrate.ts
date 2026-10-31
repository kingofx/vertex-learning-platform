import "server-only";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SEARCH_LESSONS_QUERY } from "@/sanity/lib/queries";
import type { ModelPick } from "./schema";
import type { SearchResponse, SearchResult } from "./types";

/**
 * Turns the model's picks into cards using only Sanity data. Unknown slugs are
 * dropped. A video pick keeps its second only when it matches a chapter or
 * transcript chunk of the video document for that lesson; otherwise it
 * becomes a lesson result.
 */
export async function hydrate(
  query: string,
  picks: ModelPick[],
): Promise<SearchResponse> {
  const slugs = [...new Set(picks.map((pick) => pick.lessonSlug))];
  const lessons = slugs.length
    ? await client.fetch(SEARCH_LESSONS_QUERY, { slugs })
    : [];
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const pick of picks) {
    const lesson = bySlug.get(pick.lessonSlug);
    if (!lesson?.slug || !lesson.title || !lesson.course?.slug) continue;

    const allowed = new Set<number>([
      ...(lesson.video?.chapters ?? []).map((c) => c.startSeconds ?? -1),
      ...(lesson.video?.chunkSeconds ?? []).filter(
        (s): s is number => typeof s === "number",
      ),
    ]);
    const isVideo =
      pick.kind === "video" &&
      pick.startSeconds !== null &&
      allowed.has(pick.startSeconds);
    const kind = isVideo ? "video" : "lesson";

    const key = `${kind}:${lesson.slug}:${isVideo ? pick.startSeconds : ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const modules = lesson.course.modules ?? [];
    const moduleIndex = modules.findIndex((m) =>
      (m.lessonSlugs ?? []).includes(lesson.slug),
    );
    const lessonIndex =
      moduleIndex >= 0
        ? (modules[moduleIndex].lessonSlugs ?? []).indexOf(lesson.slug)
        : -1;

    const startSeconds = isVideo ? pick.startSeconds : null;
    results.push({
      kind,
      lessonSlug: lesson.slug,
      title: lesson.title,
      description: lesson.summary ?? "",
      courseTitle: lesson.course.title ?? "",
      courseSlug: lesson.course.slug,
      courseCover: lesson.course.coverImage?.asset
        ? urlFor(lesson.course.coverImage).width(48).height(48).fit("crop").url()
        : null,
      label: moduleIndex >= 0 ? `${moduleIndex + 1}.${lessonIndex + 1}` : null,
      moduleTitle: moduleIndex >= 0 ? (modules[moduleIndex].title ?? null) : null,
      moduleNumber: moduleIndex >= 0 ? moduleIndex + 1 : null,
      thumbnail: lesson.thumbnail?.asset
        ? urlFor(lesson.thumbnail).width(560).height(315).fit("crop").url()
        : null,
      durationSeconds: lesson.durationSeconds,
      startSeconds,
      keyPoints: lesson.keyPoints ?? [],
      href:
        startSeconds !== null
          ? `/lessons/${lesson.slug}?t=${startSeconds}`
          : `/lessons/${lesson.slug}`,
    });
  }

  return {
    query,
    results,
    courseCount: new Set(results.map((r) => r.courseSlug)).size,
  };
}
