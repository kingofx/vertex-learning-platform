import { Icon } from "./icons";

type Status = "in-progress" | "completed" | "now-playing" | "locked";

const labels: Record<Status, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  "now-playing": "Now Playing",
  locked: "Locked",
};

function Glyph({ status }: { status: Status }) {
  switch (status) {
    case "in-progress":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2.5"
            className="stroke-primary-200"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="38 50"
            transform="rotate(-90 10 10)"
            className="stroke-primary-500"
          />
        </svg>
      );
    case "completed":
      return <Icon name="checkCircle" size={20} className="text-success-500" />;
    case "now-playing":
      return <Icon name="play" variant="filled" size={20} className="text-primary-500" />;
    case "locked":
      return <Icon name="lock" size={20} className="text-neutral-500" />;
  }
}

export function StatusIndicator({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-2 text-body text-neutral-700">
      <Glyph status={status} />
      {labels[status]}
    </span>
  );
}
