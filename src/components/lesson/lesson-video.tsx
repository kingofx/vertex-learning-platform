const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"];
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function youtubeId(videoUrl: string) {
  try {
    const url = new URL(videoUrl);
    if (!YOUTUBE_HOSTS.includes(url.hostname)) return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : (url.searchParams.get("v") ?? "");
    return YOUTUBE_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

function startSeconds(value: string | string[] | undefined) {
  const seconds = Number.parseInt(Array.isArray(value) ? value[0] : (value ?? ""), 10);
  return Number.isFinite(seconds) && seconds > 0 && seconds < 86_400 ? seconds : 0;
}

/**
 * Provider embed, no custom player. Only YouTube is supported for now; `?t=`
 * on the page URL sets the start second.
 */
export async function LessonVideo({
  videoUrl,
  title,
  searchParams,
}: {
  videoUrl: string | null;
  title: string;
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { t } = await searchParams;
  const id = videoUrl ? youtubeId(videoUrl) : null;
  const start = startSeconds(t);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
      {id ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0${start ? `&start=${start}` : ""}`}
          title={`Video: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-body text-neutral-300">
          Video unavailable
        </div>
      )}
    </div>
  );
}

export function VideoFallback() {
  return <div className="aspect-video w-full rounded-lg bg-neutral-900" />;
}
