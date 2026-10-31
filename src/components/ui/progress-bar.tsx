export function ProgressBar({
  value,
  label = "Course progress",
}: {
  value: number;
  label?: string;
}) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="flex items-center gap-4">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100"
      >
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-small whitespace-nowrap text-neutral-500">
        {percent}% complete
      </span>
    </div>
  );
}
