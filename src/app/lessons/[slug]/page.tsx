import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { Notes } from "@/components/lesson/portable-text";
import { LessonVideo, VideoFallback } from "@/components/lesson/lesson-video";
import { SiteFrame } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/ui/navigation";
import { formatCount, formatDuration, formatLevel } from "@/lib/format";
import { getLesson, getLessonSlugs } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";

export async function generateStaticParams() {
  return getLessonSlugs();
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();
  return { title: `${lesson.title} | Vertex`, description: lesson.summary ?? undefined };
}

function Meta({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-body text-neutral-500">
      <Icon name={icon} size={18} />
      {children}
    </span>
  );
}

export default function LessonPage(props: PageProps<"/lessons/[slug]">) {
  return (
    <SiteFrame current="courses">
      <Suspense fallback={<main className="flex-1" />}>
        <Lesson {...props} />
      </Suspense>
    </SiteFrame>
  );
}

async function Lesson({ params, searchParams }: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();

  const { course, position } = lesson;
  const cover = course?.coverImage?.asset
    ? urlFor(course.coverImage).width(112).height(112).fit("crop").url()
    : null;
  const keyPoints = lesson.keyPoints ?? [];
  const resources = lesson.resources ?? [];

  const content = (
    <div className="flex flex-col gap-8">
      {lesson.notes && lesson.notes.length > 0 && (
        <section className="flex flex-col gap-4 border-b border-neutral-100 pb-8">
          <h2 className="font-display text-heading-2 font-medium">Overview</h2>
          <Notes value={lesson.notes} />
        </section>
      )}

      {keyPoints.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-body-lg font-semibold">In this lesson you will:</h2>
          <ul className="flex flex-col gap-3">
            {keyPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-body-lg">
                <Icon name="checkCircle" size={20} className="shrink-0 text-primary-500" />
                {point}
              </li>
            ))}
          </ul>
        </section>
      )}

      {lesson.proTip && (
        <aside className="flex gap-4 rounded-md border border-primary-200/60 bg-primary-100/60 p-5">
          <Icon name="lightbulb" size={24} className="shrink-0 text-primary-500" />
          <div className="flex flex-col gap-1">
            <p className="font-display text-body-lg font-medium">Pro Tip</p>
            <p className="text-body text-neutral-500">{lesson.proTip}</p>
          </div>
        </aside>
      )}

      {resources.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-neutral-100 pt-8">
          <h2 className="font-display text-heading-3 font-medium">Resources</h2>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <li key={resource._key}>
                <a
                  href={resource.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-start gap-3 rounded-md border border-neutral-100 bg-white/60 p-4 hover:border-neutral-200"
                >
                  <Icon
                    name={resource.url?.includes("github.com") ? "github" : "document"}
                    size={24}
                    className="shrink-0 text-neutral-700"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-small font-medium">{resource.title}</span>
                    <span className="text-small text-neutral-500">{resource.description}</span>
                  </span>
                  <Icon name="external" size={14} className="shrink-0 text-neutral-500" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );

  const main = (
    <div className="flex min-w-0 flex-1 flex-col gap-6 px-5 py-6 sm:px-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "All Courses", href: "/" },
          ...(course
            ? [{ label: course.title ?? "", href: `/courses/${course.slug}` }]
            : []),
          ...(position ? [{ label: position.moduleTitle ?? "" }] : []),
          { label: lesson.title ?? "" },
        ]}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            {position && <Badge variant="video">Lesson {position.label}</Badge>}
            {lesson.freePreview && <Badge variant="lesson">Free preview</Badge>}
          </div>
          <h1 className="font-display text-display-2 font-medium">{lesson.title}</h1>
          {lesson.summary && (
            <p className="max-w-[560px] text-body-lg text-neutral-500">{lesson.summary}</p>
          )}
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            <Meta icon="clock">{formatDuration(lesson.durationSeconds)}</Meta>
            {course?.level && <Meta icon="chart">{formatLevel(course.level)}</Meta>}
            <Meta icon="user">{formatCount(lesson.studentCount)} students</Meta>
          </div>
        </div>
        <button
          type="button"
          aria-label="Bookmark lesson"
          className="flex size-11 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white text-primary-500"
        >
          <Icon name="bookmark" size={20} />
        </button>
      </div>

      <Suspense fallback={<VideoFallback />}>
        <LessonVideo
          videoUrl={lesson.videoUrl}
          title={lesson.title ?? ""}
          searchParams={searchParams}
        />
      </Suspense>

      <LessonTabs content={content} />
    </div>
  );

  const nav = position && (position.previous || position.next) && (
    <nav
      aria-label="Lesson navigation"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 px-5 py-5 sm:px-10"
    >
      {position.previous ? (
        <Link
          href={`/lessons/${position.previous.slug}`}
          className="flex items-center gap-4"
        >
          <span className="inline-flex h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-body font-medium">
            <Icon name="arrowLeft" size={16} />
            Previous Lesson
          </span>
          <span className="hidden flex-col text-small text-neutral-500 sm:flex">
            {position.previous.title}
            <span>{formatDuration(position.previous.durationSeconds)}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {position.next ? (
        <Link
          href={`/lessons/${position.next.slug}`}
          className="flex items-center gap-4"
        >
          <span className="hidden flex-col text-right text-small text-neutral-500 sm:flex">
            {position.next.title}
            <span>{formatDuration(position.next.durationSeconds)}</span>
          </span>
          <span className="inline-flex h-11 items-center gap-2 rounded-md bg-primary-500 px-5 text-body font-medium text-white hover:bg-primary-600">
            Next Lesson
            <Icon name="arrowRight" size={16} />
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );

  return (
    <>
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        {course && position && (
          <LessonSidebar
            courseTitle={course.title ?? ""}
            courseSlug={course.slug ?? ""}
            cover={cover}
            currentModule={position.moduleNumber}
            currentLessonSlug={slug}
            modules={course.modules.map((module) => ({
              key: module._key,
              number: module.number,
              title: module.title ?? "",
              duration: formatDuration(module.durationSeconds),
              lessons: module.lessons.map((item) => ({
                id: item._id,
                title: item.title ?? "",
                slug: item.slug ?? "",
                duration: formatDuration(item.durationSeconds),
              })),
            }))}
          />
        )}
        <main className="flex min-w-0 flex-1 flex-col">{main}</main>
      </div>
      {nav}
    </>
  );
}
