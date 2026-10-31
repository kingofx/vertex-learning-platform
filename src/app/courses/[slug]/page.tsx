import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  CourseActions,
  CourseViewed,
} from "@/components/course/course-analytics";
import { ModuleList } from "@/components/course/module-list";
import { SiteFrame } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/ui/navigation";
import { formatCount, formatDuration, formatLevel } from "@/lib/format";
import { getCourse, getCourseSlugs } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";

const OUTCOME_ICONS: IconName[] = [
  "layers",
  "database",
  "gauge",
  "cloud",
  "code",
  "shield",
  "rocket",
  "puzzle",
  "sparkles",
  "workflow",
];

function outcomeIcon(name: string | null): IconName {
  return OUTCOME_ICONS.find((icon) => icon === name) ?? "sparkles";
}

export async function generateStaticParams() {
  return getCourseSlugs();
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();
  return { title: `${course.title} | Vertex`, description: course.summary ?? undefined };
}

function Meta({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-body text-neutral-500">
      <Icon name={icon} size={18} />
      {children}
    </span>
  );
}

export default function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  return (
    <SiteFrame current="courses">
      <Suspense fallback={<main className="flex-1" />}>
        <Course params={params} />
      </Suspense>
    </SiteFrame>
  );
}

async function Course({ params }: Pick<PageProps<"/courses/[slug]">, "params">) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const firstLesson = course.modules
    .flatMap((module) => module.lessons)
    .find(Boolean);
  const cover = course.coverImage?.asset
    ? urlFor(course.coverImage).width(560).height(560).fit("crop").url()
    : null;
  const outcomes = course.outcomes ?? [];

  return (
    <>
      <main className="relative z-10 flex flex-col gap-10 px-5 pt-6 pb-16 sm:px-10 sm:pb-24">
        <CourseViewed
          courseSlug={slug}
          level={course.level}
          moduleCount={course.moduleCount}
        />
        <Breadcrumbs
          items={[
            { label: "All Courses", href: "/" },
            { label: course.title ?? "" },
          ]}
        />

        <section className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-14">
          <div className="relative aspect-square w-full max-w-[280px] shrink-0 overflow-hidden rounded-lg bg-neutral-900 shadow-lg sm:size-[280px] sm:max-w-none">
            {cover && (
              <Image
                src={cover}
                alt={course.coverImage?.alt ?? ""}
                fill
                sizes="280px"
                priority
                className="object-cover"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-col items-start gap-5">
            {course.popular && <Badge variant="popular">Popular</Badge>}
            <h1 className="font-display text-display-2 font-medium sm:text-display-1">
              {course.title}
            </h1>
            {course.summary && (
              <p className="max-w-[460px] text-body-lg text-neutral-500">
                {course.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-x-7 gap-y-2">
              <Meta icon="chart">{formatLevel(course.level)}</Meta>
              <Meta icon="clock">{formatDuration(course.durationSeconds)}</Meta>
              <Meta icon="document">{course.moduleCount} modules</Meta>
              <Meta icon="user">{formatCount(course.studentCount)} students</Meta>
            </div>
            <CourseActions
              courseSlug={slug}
              firstLessonSlug={firstLesson?.slug ?? undefined}
            />
          </div>
        </section>

        {outcomes.length > 0 && (
          <section className="rounded-lg border border-neutral-100 bg-white/40 p-5 sm:p-8">
            <h2 className="font-display text-heading-1 font-medium">
              What you’ll learn
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {outcomes.map((outcome) => (
                <li
                  key={outcome._key}
                  className="flex items-start gap-5 rounded-md border border-neutral-100 bg-white/60 p-5 sm:p-7"
                >
                  <Icon
                    name={outcomeIcon(outcome.icon)}
                    size={48}
                    strokeWidth={1.1}
                    className="shrink-0 text-primary-500"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-body-lg font-medium">
                      {outcome.title}
                    </h3>
                    <p className="text-body text-neutral-500">
                      {outcome.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-heading-1 font-medium">
              Course Content
            </h2>
            <p className="text-body text-neutral-500">
              {course.moduleCount} modules
              <span aria-hidden="true"> • </span>
              {formatDuration(course.durationSeconds)}
            </p>
          </div>
          <ModuleList
            modules={course.modules.map((module) => ({
              key: module._key,
              number: module.number,
              title: module.title ?? "",
              summary: module.summary,
              duration: formatDuration(module.durationSeconds),
              lessons: module.lessons.map((lesson) => ({
                id: lesson._id,
                number: lesson.number,
                title: lesson.title ?? "",
                slug: lesson.slug ?? "",
                duration: formatDuration(lesson.durationSeconds),
                freePreview: Boolean(lesson.freePreview),
              })),
            }))}
          />
        </section>
      </main>
    </>
  );
}
