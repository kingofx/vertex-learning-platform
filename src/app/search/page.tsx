import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchForm } from "@/components/search/search-form";
import { SearchResults } from "@/components/search/search-results";
import { SiteFrame } from "@/components/site-header";

export const metadata: Metadata = { title: "Search | Vertex" };

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <SiteFrame current="courses">
      <main className="relative z-10 flex flex-col px-5 pt-12 pb-16 sm:px-10 sm:pb-24">
        <Suspense fallback={<div className="flex justify-center"><SearchForm /></div>}>
          <Results {...props} />
        </Suspense>
      </main>
    </SiteFrame>
  );
}

async function Results({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 200);
  if (!query) redirect("/");
  return <SearchResults key={query} query={query} />;
}
