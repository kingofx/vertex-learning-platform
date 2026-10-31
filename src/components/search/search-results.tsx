"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Select } from "@/components/ui/input";
import type { SearchResponse } from "@/lib/search/types";
import { LessonResult, VideoResult } from "./result-cards";
import { SearchForm } from "./search-form";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; data: SearchResponse };

type Sort = "relevant" | "title" | "shortest";

function Banner({ emphasis }: { emphasis?: boolean }) {
  return (
    <div
      className={`flex flex-col items-start gap-4 rounded-lg border border-primary-200/60 bg-primary-100/50 p-5 sm:flex-row sm:items-center sm:justify-between ${emphasis ? "py-10" : ""}`}
    >
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500">
          <Icon name="search" size={22} />
        </span>
        <div>
          <p className="font-display text-body-lg font-medium">
            Can’t find what you’re looking for?
          </p>
          <p className="text-small text-neutral-500">
            Try different keywords or browse our full course catalog.
          </p>
        </div>
      </div>
      <ButtonLink
        href="/"
        variant="tertiary"
        size="md"
        className="h-12 px-6 text-primary-600"
        icon={<Icon name="arrowRight" size={16} />}
      >
        Browse all courses
      </ButtonLink>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[170px] animate-pulse rounded-lg border border-neutral-100 bg-white/60"
        />
      ))}
    </div>
  );
}

function Shell({
  query,
  summary,
  children,
}: {
  query: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <p className="rounded-md border border-primary-200 bg-white/60 px-3.5 py-2 text-[12px] leading-4 font-medium tracking-[0.18em] text-primary-600 uppercase">
          Search results
        </p>
        <h1 className="font-display text-display-2 font-medium break-words sm:text-display-1">
          Results for <span className="text-primary-500">“{query}”</span>
        </h1>
        <p className="min-h-6 text-body-lg text-neutral-500">{summary}</p>
        <div className="mt-2 flex w-full justify-center">
          <SearchForm defaultValue={query} />
        </div>
      </header>
      {children}
    </div>
  );
}

export function SearchResults({ query }: { query: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [sort, setSort] = useState<Sort>("relevant");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        const body = await response.json();
        if (!response.ok) {
          setState({
            status: "error",
            message: typeof body?.error === "string" ? body.error : "Search failed.",
          });
          return;
        }
        setState({ status: "done", data: body as SearchResponse });
      } catch {
        if (controller.signal.aborted) return;
        setState({ status: "error", message: "Search is unavailable right now." });
      }
    })();
    return () => controller.abort();
  }, [query]);

  if (state.status === "loading") {
    return (
      <Shell query={query} summary="Searching…">
        <div aria-busy="true">
          <Skeleton />
        </div>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell query={query} summary="">
        <div
          role="alert"
          className="flex flex-col items-start gap-4 rounded-lg border border-neutral-100 bg-white/70 p-6"
        >
          <p className="text-body-lg">{state.message}</p>
          <ButtonLink
            href={`/search?q=${encodeURIComponent(query)}`}
            variant="tertiary"
            size="md"
          >
            Try again
          </ButtonLink>
        </div>
      </Shell>
    );
  }

  const { results, courseCount } = state.data;
  if (results.length === 0) {
    return (
      <Shell query={query} summary="No results found">
        <Banner emphasis />
      </Shell>
    );
  }

  const sorted = [...results];
  if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "shortest") {
    sorted.sort(
      (a, b) => (a.durationSeconds ?? Infinity) - (b.durationSeconds ?? Infinity),
    );
  }

  return (
    <Shell
      query={query}
      summary={`Found ${results.length} results across ${courseCount} ${courseCount === 1 ? "course" : "courses"}`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-body-lg">{results.length} results</p>
          <Select
            label="Sort results"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="w-[190px]"
          >
            <option value="relevant">Most Relevant</option>
            <option value="title">Title A–Z</option>
            <option value="shortest">Shortest first</option>
          </Select>
        </div>
        <ul className="flex flex-col gap-4">
          {sorted.map((result) => (
            <li key={`${result.kind}-${result.lessonSlug}-${result.startSeconds ?? ""}`}>
              {result.kind === "video" ? (
                <VideoResult result={result} />
              ) : (
                <LessonResult result={result} />
              )}
            </li>
          ))}
        </ul>
        <Banner />
      </div>
    </Shell>
  );
}
