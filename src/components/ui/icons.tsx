import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "bell"
  | "search"
  | "play"
  | "document"
  | "bookmark"
  | "chart"
  | "clock"
  | "user"
  | "chevronRight"
  | "chevronLeft"
  | "chevronDown"
  | "external"
  | "checkCircle"
  | "lock"
  | "folder"
  | "eye"
  | "grid"
  | "target"
  | "accessibility"
  | "arrowRight"
  | "star";

type Shape = {
  /** Gets filled in the filled variant. */
  base: ReactNode;
  /** Drawn on top, in white in the filled variant. */
  detail?: ReactNode;
  /** Fill the detail white too (for solid glyphs like the play triangle). */
  detailSolid?: boolean;
};

const shapes: Record<IconName, Shape> = {
  bell: {
    base: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  },
  search: {
    base: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  play: {
    base: <circle cx="12" cy="12" r="10" />,
    detail: <path d="M10 8.5v7l6-3.5z" />,
    detailSolid: true,
  },
  document: {
    base: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </>
    ),
    detail: <path d="M16 13H8M16 17H8" />,
  },
  bookmark: {
    base: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  },
  chart: {
    base: (
      <>
        <rect x="4" y="13" width="4" height="8" rx="1" />
        <rect x="10" y="4" width="4" height="17" rx="1" />
        <rect x="16" y="9" width="4" height="12" rx="1" />
      </>
    ),
  },
  clock: {
    base: <circle cx="12" cy="12" r="10" />,
    detail: <path d="M12 6v6l4 2" />,
  },
  user: {
    base: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  chevronRight: { base: <path d="m9 18 6-6-6-6" /> },
  chevronLeft: { base: <path d="m15 18-6-6 6-6" /> },
  chevronDown: { base: <path d="m6 9 6 6 6-6" /> },
  external: {
    base: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <path d="M15 3h6v6M10 14 21 3" />
      </>
    ),
  },
  checkCircle: {
    base: <circle cx="12" cy="12" r="10" />,
    detail: <path d="m8 12 3 3 5-6" />,
  },
  lock: {
    base: <rect x="4" y="11" width="16" height="10" rx="2" />,
    detail: <path d="M8 11V7a4 4 0 0 1 8 0v4" />,
  },
  folder: {
    base: (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    ),
  },
  eye: {
    base: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  grid: {
    base: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  target: {
    base: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
  arrowRight: { base: <path d="M5 12h14M13 6l6 6-6 6" /> },
  star: {
    base: (
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    ),
  },
  accessibility: {
    base: (
      <>
        <circle cx="12" cy="4.5" r="2" />
        <path d="M5 8l7 1 7-1M12 9v5M9 21l3-7 3 7" />
      </>
    ),
  },
};

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  variant?: "outline" | "filled";
  size?: number;
};

/** 24px grid, 2px stroke, rounded caps. Decorative unless given an aria-label. */
export function Icon({
  name,
  variant = "outline",
  size = 24,
  ...props
}: IconProps) {
  const { base, detail, detailSolid } = shapes[name];
  const filled = variant === "filled";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      <g fill={filled ? "currentColor" : "none"}>{base}</g>
      {detail && (
        <g
          className={
            filled
              ? detailSolid
                ? "fill-white stroke-white"
                : "stroke-white"
              : undefined
          }
          fill={detailSolid && !filled ? "currentColor" : "none"}
        >
          {detail}
        </g>
      )}
    </svg>
  );
}
