import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "./badge";
import { ButtonLink } from "./button";
import { Icon, type IconName } from "./icons";

const shell =
  "flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5";

function Meta({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-500">
      <Icon name={icon} size={14} />
      {children}
    </span>
  );
}

export function CourseCard({
  logo,
  title,
  description,
  level,
  duration,
  modules,
  href = "#",
  large = false,
}: {
  large?: boolean;
  logo: ReactNode;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  href?: string;
}) {
  if (large) {
    return (
      <article className="relative flex flex-col gap-6 rounded-lg border border-neutral-100 bg-white p-6 shadow-md">
        <div className="size-[72px] overflow-hidden rounded-lg">{logo}</div>
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-heading-2 font-medium">
            <Link href={href} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>
          <p className="text-body text-neutral-500">{description}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-100 pt-4">
          <Meta icon="chart">{level}</Meta>
          <Meta icon="clock">{duration}</Meta>
          <Meta icon="document">{modules} modules</Meta>
        </div>
      </article>
    );
  }

  return (
    <article className={`${shell} relative gap-4`}>
      <div className="flex size-10 items-center justify-center rounded-md bg-neutral-900 text-white">
        {logo}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-body-lg font-semibold">
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="text-body text-neutral-500">{description}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1">
        <Meta icon="chart">{level}</Meta>
        <Meta icon="clock">{duration}</Meta>
        <Meta icon="folder">{modules} modules</Meta>
      </div>
    </article>
  );
}

export function LessonCard({
  kind,
  title,
  description,
  meta,
  actionLabel,
  href = "#",
}: {
  kind: "video" | "lesson";
  title: string;
  description: string;
  meta: string;
  actionLabel: string;
  href?: string;
}) {
  return (
    <article className={shell}>
      <div>
        <Badge variant={kind}>{kind === "video" ? "Video" : "Lesson"}</Badge>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-body-lg font-semibold">{title}</h3>
        <p className="text-body text-neutral-500">{description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-small text-neutral-500">{meta}</span>
        <ButtonLink
          href={href}
          variant="text"
          size="md"
          className="h-auto"
          icon={
            kind === "video" ? (
              <Icon name="play" size={16} />
            ) : (
              <Icon name="external" size={14} />
            )
          }
          iconPosition={kind === "video" ? "start" : "end"}
        >
          {actionLabel}
        </ButtonLink>
      </div>
    </article>
  );
}

export function ResourceCard({
  title,
  description,
  meta,
  href = "#",
}: {
  title: string;
  description: string;
  meta: string;
  href?: string;
}) {
  return (
    <article className={shell}>
      <Icon name="document" size={28} className="text-neutral-700" />
      <div className="flex flex-col gap-1">
        <h3 className="text-body-lg font-semibold">{title}</h3>
        <p className="text-body text-neutral-500">{description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-small text-neutral-500">{meta}</span>
        <Link
          href={href}
          aria-label={`Open ${title}`}
          className="text-primary-500 hover:text-primary-600"
        >
          <Icon name="external" size={16} />
        </Link>
      </div>
    </article>
  );
}
