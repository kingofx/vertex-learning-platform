import { Icon } from "@/components/ui/icons";

/** Plain GET form: works without JavaScript and lands on /search?q=. */
export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" role="search" className="w-full max-w-[740px]">
      <label className="flex h-16 items-center gap-4 rounded-lg border border-neutral-100 bg-white px-5 text-neutral-500 shadow-md focus-within:border-primary-400 sm:px-6">
        <span className="sr-only">Search your learning</span>
        <Icon name="search" size={24} />
        <input
          type="search"
          name="q"
          required
          maxLength={200}
          defaultValue={defaultValue}
          placeholder="Ask anything about your learning…"
          className="min-w-0 flex-1 bg-transparent text-body-lg text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-none"
        />
        <kbd className="hidden rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-sans text-body text-neutral-500 sm:block">
          ⌘ K
        </kbd>
      </label>
    </form>
  );
}
