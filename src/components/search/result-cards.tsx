import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icons";
import { formatClock } from "@/lib/format";
import type { SearchResult } from "@/lib/search/types";

function CourseLine({ result }: { result: SearchResult }) {
  return (
    <div className="flex items-center gap-2 text-small text-neutral-700">
      <span className="relative size-6 shrink-0 overflow-hidden rounded-xs bg-neutral-900">
        {result.courseCover && (
          <Image src={result.courseCover} alt="" fill sizes="24px" className="object-cover" />
        )}
      </span>
      {result.courseTitle}
    </div>
  );
}

function Where({ result }: { result: SearchResult }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-neutral-500">
      {result.label && (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="document" size={14} />
          Lesson {result.label}
        </span>
      )}
      {result.moduleTitle && (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="folder" size={14} />
          {result.moduleTitle}
        </span>
      )}
    </p>
  );
}

export function VideoResult({ result }: { result: SearchResult }) {
  return (
    <article className="flex flex-col gap-5 rounded-lg border border-neutral-100 bg-white/70 p-4 sm:flex-row sm:p-5">
      <Link
        href={result.href}
        aria-label={`Watch ${result.title}`}
        className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-neutral-900 sm:w-[272px]"
      >
        {result.thumbnail && (
          <Image src={result.thumbnail} alt="" fill sizes="272px" className="object-cover" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-black/55 text-white">
            <Icon name="play" variant="filled" size={20} />
          </span>
        </span>
        <span className="absolute right-2 bottom-2 rounded-xs bg-black/75 px-2 py-0.5 text-small text-white">
          {formatClock(result.durationSeconds)}
        </span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <CourseLine result={result} />
          <Badge variant="video">Video</Badge>
        </div>
        <h3 className="font-display text-heading-3 font-medium">{result.title}</h3>
        {result.description && (
          <p className="text-body text-neutral-500">{result.description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <Where result={result} />
          <Link
            href={result.href}
            className="inline-flex items-center gap-2 text-body font-medium text-primary-600"
          >
            <Icon name="play" size={16} />
            Watch from {formatClock(result.startSeconds)}
            <Icon name="chevronRight" size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function LessonResult({ result }: { result: SearchResult }) {
  return (
    <article className="flex flex-col gap-5 rounded-lg border border-neutral-100 bg-white/70 p-4 sm:flex-row sm:p-5">
      <div className="flex w-full shrink-0 gap-4 rounded-md bg-primary-100/40 p-4 sm:w-[272px]">
        <Icon name="document" size={22} className="shrink-0 text-neutral-500" />
        <ul className="flex flex-col gap-2 text-small text-neutral-700">
          {result.keyPoints.slice(0, 3).map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <CourseLine result={result} />
          <Badge variant="lesson">Lesson</Badge>
        </div>
        <h3 className="font-display text-heading-3 font-medium">{result.title}</h3>
        {result.description && (
          <p className="text-body text-neutral-500">{result.description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <Where result={result} />
          <Link
            href={result.href}
            className="inline-flex items-center gap-2 text-body font-medium text-primary-600"
          >
            View lesson
            <Icon name="external" size={14} />
            <Icon name="chevronRight" size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
