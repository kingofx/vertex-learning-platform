import Link from "next/link";
import { CourseCard } from "@/components/ui/cards";
import {
  DockerLogo,
  NextLogo,
  TypeScriptLogo,
} from "@/components/ui/course-logos";
import { Icon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

// Placeholder data until the Sanity course model exists.
const courses = [
  {
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    modules: 12,
    logo: <NextLogo />,
  },
  {
    title: "Docker Essentials",
    description:
      "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    modules: 8,
    logo: <DockerLogo />,
  },
  {
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    modules: 10,
    logo: <TypeScriptLogo />,
  },
];

const bars = [
  { l: "0%", w: "9%", h: "30%" },
  { l: "9%", w: "9%", h: "52%" },
  { l: "18%", w: "8%", h: "70%" },
  { l: "26%", w: "9%", h: "100%" },
  { l: "35%", w: "14%", h: "62%" },
  { l: "49%", w: "6%", h: "36%" },
  { l: "55%", w: "12%", h: "54%" },
  { l: "67%", w: "9%", h: "72%" },
  { l: "76%", w: "9%", h: "100%" },
  { l: "85%", w: "8%", h: "46%" },
  { l: "93%", w: "7%", h: "84%" },
];

export default function Home() {
  return (
    <div
      className="flex-1 bg-page"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 5px, rgba(234,88,12,0.05) 5px 6px)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1200px] flex-col overflow-hidden border-x border-neutral-100 bg-page">
        <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-10">
          <nav aria-label="Main" className="flex items-center gap-5 sm:gap-10">
            <Logo />
            <ul className="flex items-center gap-4 sm:gap-8">
              <li>
                <Link href="/" aria-current="page" className="text-body">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/" className="text-body">
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
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full bg-neutral-200 text-neutral-500"
            >
              <Icon name="user" size={22} />
            </span>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col">
          <section className="flex flex-col items-center border-b border-neutral-100 px-5 pt-14 pb-14 text-center sm:px-10 sm:pt-16">
            <p className="rounded-md border border-primary-200 bg-white/60 px-3.5 py-2 text-[12px] leading-4 font-medium tracking-[0.18em] text-primary-600 uppercase">
              Intelligent learning
            </p>
            <h1 className="mt-8 max-w-[640px] font-display text-[40px] leading-[1.1] font-medium tracking-tight sm:text-[56px]">
              Search your learning in plain English.
            </h1>
            <p className="mt-6 max-w-[460px] text-body-lg text-neutral-500">
              Vertex understands what you want to learn and finds the exact
              lessons across all your courses.
            </p>
            <ButtonLink
              href="/"
              className="mt-8 shadow-md"
              icon={<Icon name="arrowRight" size={20} />}
            >
              Explore Courses
            </ButtonLink>
            <label className="mt-12 flex h-[84px] w-full max-w-[740px] items-center gap-4 rounded-lg border border-neutral-100 bg-white px-6 text-neutral-500 shadow-md focus-within:border-primary-400">
              <span className="sr-only">Search your learning</span>
              <Icon name="search" size={26} />
              <input
                type="search"
                placeholder="Ask anything about your learning…"
                className="min-w-0 flex-1 bg-transparent text-body-lg text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-none"
              />
              <kbd className="hidden rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 font-sans text-body text-neutral-500 sm:block">
                ⌘ K
              </kbd>
            </label>
          </section>

          <section className="px-5 pt-14 sm:px-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-heading-1 font-medium">
                All Courses
              </h2>
              <ButtonLink
                href="/"
                variant="text"
                size="md"
                className="h-auto"
                icon={<Icon name="arrowRight" size={18} />}
              >
                View all courses
              </ButtonLink>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <li key={course.title} className="flex [&>article]:w-full">
                  <CourseCard large {...course} />
                </li>
              ))}
            </ul>
          </section>

          <div className="mx-5 mt-12 flex items-center gap-4 sm:mx-12">
            <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
            <p className="flex items-center gap-3 text-body text-neutral-700">
              <Icon name="star" size={22} className="text-primary-500" />
              New courses and lessons added every week.
            </p>
            <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
          </div>

          <div
            aria-hidden="true"
            className="relative mt-auto h-40 w-full sm:h-52"
          >
            {bars.map((bar, i) => (
              <span
                key={i}
                className="absolute bottom-0 bg-gradient-to-t from-primary-400 to-primary-300/10"
                style={{ left: bar.l, width: bar.w, height: bar.h }}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
