import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";

export function SiteHeader({ current }: { current?: "courses" | "learning" }) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-10">
      <nav aria-label="Main" className="flex items-center gap-5 sm:gap-10">
        <Logo />
        <ul className="flex items-center gap-4 sm:gap-8">
          <li>
            <Link
              href="/"
              aria-current={current === "courses" ? "page" : undefined}
              className="text-body"
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              href="/"
              aria-current={current === "learning" ? "page" : undefined}
              className="text-body"
            >
              My Learning
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="text-neutral-900"
        >
          <Icon name="bell" size={22} />
        </button>
        <Suspense fallback={<span className="size-12" aria-hidden="true" />}>
          <Show when="signed-out">
            <ButtonLink href="/sign-in" variant="text" size="md">
              Sign in
            </ButtonLink>
            <ButtonLink href="/sign-up" size="md">
              Sign up
            </ButtonLink>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </Suspense>
      </div>
    </header>
  );
}

/** Striped page background, the bordered 1200px frame and the header. */
export function SiteFrame({
  current,
  children,
}: {
  current?: "courses" | "learning";
  children: ReactNode;
}) {
  return (
    <div
      className="flex-1 bg-page"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 5px, rgba(234,88,12,0.05) 5px 6px)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1200px] flex-col overflow-hidden border-x border-neutral-100 bg-page">
        <SiteHeader current={current} />
        {children}
      </div>
    </div>
  );
}
