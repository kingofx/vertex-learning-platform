import Link from "next/link";
import { Icon } from "./icons";
import { Logo } from "./logo";

export function NavBar({
  tabs,
}: {
  tabs: { label: string; href: string; active?: boolean }[];
}) {
  return (
    <nav
      aria-label="Main"
      className="flex items-center gap-4 sm:gap-8"
    >
      <Logo />
      <ul className="flex items-center gap-4 sm:gap-6">
        {tabs.map((tab) => (
          <li key={tab.label}>
            <Link
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={`text-body font-medium ${
                tab.active
                  ? "text-primary-500"
                  : "text-neutral-900 hover:text-primary-500"
              }`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-small">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {last || !item.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-neutral-900" : "text-neutral-500"}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              )}
              {!last && (
                <Icon
                  name="chevronRight"
                  size={12}
                  className="text-neutral-300"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Pagination({
  pages,
  current,
}: {
  pages: (number | "ellipsis")[];
  current: number;
}) {
  const item =
    "inline-flex size-8 items-center justify-center rounded-sm text-body";

  return (
    <nav aria-label="Pagination">
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <button
            type="button"
            aria-label="Previous page"
            className={`${item} text-neutral-500 hover:bg-neutral-100`}
          >
            <Icon name="chevronLeft" size={16} />
          </button>
        </li>
        {pages.map((page, index) => (
          <li key={`${page}-${index}`}>
            {page === "ellipsis" ? (
              <span className={`${item} text-neutral-500`} aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                aria-current={page === current ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={`${item} ${
                  page === current
                    ? "border border-primary-500 text-primary-500"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label="Next page"
            className={`${item} text-neutral-500 hover:bg-neutral-100`}
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
