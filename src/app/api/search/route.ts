import { hydrate } from "@/lib/search/hydrate";
import { pickResults, SearchConfigError } from "@/lib/search/agent";
import { rateLimited } from "@/lib/search/rate-limit";
import { searchRequest } from "@/lib/search/schema";

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return json({ error: "Too many searches. Try again in a minute." }, 429);
  }

  let parsed;
  try {
    parsed = searchRequest.safeParse(await request.json());
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!parsed.success) {
    return json({ error: "Enter a search between 1 and 200 characters." }, 400);
  }

  try {
    const picks = await pickResults(parsed.data.query);
    return json(await hydrate(parsed.data.query, picks));
  } catch (error) {
    if (error instanceof SearchConfigError) {
      return json({ error: "Search is not configured." }, 503);
    }
    console.error("search failed:", error instanceof Error ? error.message : "unknown error");
    return json({ error: "Search is unavailable right now." }, 502);
  }
}
