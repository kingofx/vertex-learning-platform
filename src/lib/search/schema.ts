import { z } from "zod";

export const searchRequest = z.object({
  query: z.string().trim().min(1).max(200),
});

/** All the model returns: slugs and seconds in rank order. The server builds the cards. */
export const modelPicks = z.object({
  results: z
    .array(
      z.object({
        kind: z.enum(["lesson", "video"]),
        lessonSlug: z.string().min(1).max(200),
        startSeconds: z.number().int().min(0).nullable(),
      }),
    )
    .max(40),
});

export type ModelPick = z.infer<typeof modelPicks>["results"][number];
