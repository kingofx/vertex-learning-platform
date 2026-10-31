import { ButtonLink } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navigation";

export default function Home() {
  return (
    <>
      <header className="border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
        <NavBar
          tabs={[
            { label: "Courses", href: "/", active: true },
            { label: "My Learning", href: "/" },
          ]}
        />
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6">
        <h1 className="text-display-2 sm:text-display-1">Vertex</h1>
        <p className="text-body-lg text-neutral-700">
          Learning platform coming soon.
        </p>
        <ButtonLink href="/design-system">View the design system</ButtonLink>
      </main>
    </>
  );
}
