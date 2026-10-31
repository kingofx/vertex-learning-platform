export type SearchResult = {
  kind: "video" | "lesson";
  lessonSlug: string;
  title: string;
  description: string;
  courseTitle: string;
  courseSlug: string;
  courseCover: string | null;
  /** "5.1", derived from module and lesson order. */
  label: string | null;
  moduleTitle: string | null;
  moduleNumber: number | null;
  thumbnail: string | null;
  durationSeconds: number | null;
  /** Only set on video results, verified against the video document. */
  startSeconds: number | null;
  keyPoints: string[];
  href: string;
};

export type SearchResponse = {
  query: string;
  results: SearchResult[];
  courseCount: number;
};
