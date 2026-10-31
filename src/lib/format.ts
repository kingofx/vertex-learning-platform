/** 4320 -> "1h 12m", 2700 -> "45m". */
export function formatDuration(seconds: number | null | undefined) {
  const total = Math.round((seconds ?? 0) / 60);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

/** 2100 -> "2.1k", 18240 -> "18.2k", 950 -> "950". */
export function formatCount(count: number | null | undefined) {
  const n = count ?? 0;
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

const levels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function formatLevel(level: string | null | undefined) {
  return level ? (levels[level] ?? level) : "";
}
