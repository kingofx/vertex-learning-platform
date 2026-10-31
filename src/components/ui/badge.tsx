type Variant = "video" | "lesson" | "popular";

const variants: Record<Variant, string> = {
  video: "bg-primary-100 text-primary-600",
  lesson: "bg-lesson-100 text-lesson-600",
  popular: "bg-primary-200/60 text-primary-600",
};

export function Badge({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-2 py-1 text-[11px] leading-none font-semibold tracking-wide uppercase ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
