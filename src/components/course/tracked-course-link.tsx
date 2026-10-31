"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { capturePostHogEvent } from "@/lib/posthog";

export function TrackedCourseLink({
  href,
  level,
  moduleCount,
  children,
}: {
  href: string;
  level: string;
  moduleCount: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="after:absolute after:inset-0"
      onClick={() =>
        capturePostHogEvent("course_selected", {
          destination: href,
          course_level: level,
          module_count: moduleCount,
        })
      }
    >
      {children}
    </Link>
  );
}
