import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCard, LessonCard, ResourceCard } from "@/components/ui/cards";
import { Icon, type IconName } from "@/components/ui/icons";
import { SearchInput, Select } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Breadcrumbs, NavBar, Pagination } from "@/components/ui/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusIndicator } from "@/components/ui/status-indicator";

export const metadata: Metadata = {
  title: "Design System · Vertex",
};

const primary = [
  { name: "Primary 500", hex: "#F97316", cls: "bg-primary-500" },
  { name: "Primary 400", hex: "#FB923C", cls: "bg-primary-400" },
  { name: "Primary 300", hex: "#FDBA74", cls: "bg-primary-300" },
  { name: "Primary 200", hex: "#FED7AA", cls: "bg-primary-200" },
  { name: "Primary 100", hex: "#FFEEE5", cls: "bg-primary-100" },
];

const neutral = [
  { name: "Neutral 900", hex: "#0F172A", cls: "bg-neutral-900" },
  { name: "Neutral 700", hex: "#334155", cls: "bg-neutral-700" },
  { name: "Neutral 500", hex: "#64748B", cls: "bg-neutral-500" },
  { name: "Neutral 300", hex: "#CBD5E1", cls: "bg-neutral-300" },
  { name: "Neutral 200", hex: "#E2E8F0", cls: "bg-neutral-200" },
  { name: "Neutral 100", hex: "#F1F5F9", cls: "bg-neutral-100" },
  { name: "Neutral 50", hex: "#FAFAFC", cls: "bg-neutral-50" },
  { name: "White", hex: "#FFFFFF", cls: "bg-white" },
];

const typeScale = [
  ["Display 1", "Playfair Display", "48 / 56", "Bold", "Page titles"],
  ["Display 2", "Playfair Display", "36 / 44", "Bold", "Section titles"],
  ["Heading 1", "Inter", "28 / 36", "Semi Bold", "Card titles"],
  ["Heading 2", "Inter", "22 / 30", "Semi Bold", "Sub section"],
  ["Heading 3", "Inter", "18 / 26", "Medium", "Small titles"],
  ["Body Large", "Inter", "16 / 24", "Regular", "Body copy"],
  ["Body", "Inter", "14 / 20", "Regular", "Supporting text"],
  ["Small", "Inter", "12 / 16", "Regular", "Captions, meta"],
];

const spacing = [4, 8, 12, 16, 24, 32, 40, 48, 64];

const radii = [
  { label: "4px", name: "xs", cls: "rounded-xs" },
  { label: "8px", name: "sm", cls: "rounded-sm" },
  { label: "12px", name: "md", cls: "rounded-md" },
  { label: "16px", name: "lg", cls: "rounded-lg" },
  { label: "24px", name: "xl", cls: "rounded-xl" },
  { label: "Full", name: "circle", cls: "rounded-full" },
];

const shadows = [
  { name: "Sm", cls: "shadow-sm", lines: ["0 1px 2px 0", "rgba(15, 23, 42, 0.05)"] },
  { name: "Md", cls: "shadow-md", lines: ["0 4px 12px -2px", "rgba(15, 23, 42, 0.08)"] },
  { name: "Lg", cls: "shadow-lg", lines: ["0 12px 24px -4px", "rgba(15, 23, 42, 0.10)"] },
  { name: "Xl", cls: "shadow-xl", lines: ["0 20px 40px -8px", "rgba(15, 23, 42, 0.12)"] },
];

const iconNames: IconName[] = [
  "bell",
  "search",
  "play",
  "document",
  "bookmark",
  "chart",
  "clock",
  "user",
  "chevronRight",
];

const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "eye",
    title: "Clarity First",
    text: "Every element should communicate clearly.",
  },
  {
    icon: "grid",
    title: "Consistency",
    text: "Use components and patterns consistently across the platform.",
  },
  {
    icon: "target",
    title: "Focus & Calm",
    text: "Remove noise and highlight what matters.",
  },
  {
    icon: "accessibility",
    title: "Accessible",
    text: "Design with accessibility and inclusivity in mind.",
  },
];

function Section({
  number,
  title,
  className = "",
  children,
}: {
  number: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`section-${number}`}
      className={`min-w-0 rounded-xl border border-neutral-100 bg-white p-5 sm:p-6 ${className}`}
    >
      <h2
        id={`section-${number}`}
        className="mb-5 flex gap-3 text-small font-semibold tracking-[0.14em] text-neutral-900 uppercase"
      >
        <span className="text-primary-500">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-small font-medium text-neutral-700">{children}</h3>
  );
}

function SpecList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-small text-neutral-500">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] p-4 sm:p-6">
      <div className="grid gap-4">
        {/* Header + 01 Colors */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          <header className="flex min-w-0 flex-col justify-between gap-8 rounded-xl border border-neutral-100 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-6">
              <Logo />
              <h1 className="text-display-2">Design System</h1>
              <p className="text-body text-neutral-700">
                A unified design language for Vertex learning platform. Clean,
                modern and focused on clarity, consistency and intuitive
                learning experiences.
              </p>
            </div>
            <p className="text-small tracking-wider text-neutral-700 uppercase">
              Version 1.0 <span className="mx-2">·</span> May 2025
            </p>
          </header>

          <Section number="01" title="Colors">
            <SubHeading>Primary</SubHeading>
            <ul className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {primary.map((c) => (
                <li key={c.name}>
                  <div className={`h-14 rounded-md ${c.cls}`} />
                  <p className="mt-2 text-[11px] leading-4 text-neutral-700">
                    {c.name}
                    <br />
                    {c.hex}
                  </p>
                </li>
              ))}
            </ul>
            <SubHeading>Neutral</SubHeading>
            <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {neutral.map((c) => (
                <li key={c.name}>
                  <div
                    className={`h-12 rounded-md border border-neutral-100 ${c.cls}`}
                  />
                  <p className="mt-2 text-[11px] leading-4 text-neutral-700">
                    {c.name}
                    <br />
                    {c.hex}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* 02 Typography + 03 Type scale */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
          <Section number="02" title="Typography">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <span className="font-display text-[56px] leading-none">Ag</span>
                <div>
                  <p className="text-body-lg font-medium">Playfair Display</p>
                  <p className="text-small text-neutral-500">
                    Elegant · Readable · Timeless
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[56px] leading-none font-medium">Ag</span>
                <div>
                  <p className="text-body-lg font-medium">Inter</p>
                  <p className="text-small text-neutral-500">
                    Clean · Modern · Highly legible
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section number="03" title="Type Scale">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-small">
                <thead className="text-neutral-700">
                  <tr>
                    <th className="pb-3 font-medium">Style</th>
                    <th className="pb-3 font-medium">Font</th>
                    <th className="pb-3 font-medium">Size / Line Height</th>
                    <th className="pb-3 font-medium">Weight</th>
                    <th className="pb-3 font-medium">Use</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-500">
                  {typeScale.map(([style, font, size, weight, use]) => (
                    <tr key={style}>
                      <th className="py-1.5 pr-4 font-medium text-neutral-900">
                        {style}
                      </th>
                      <td className="py-1.5 pr-4">{font}</td>
                      <td className="py-1.5 pr-4">{size}</td>
                      <td className="py-1.5 pr-4">{weight}</td>
                      <td className="py-1.5">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* 04 Spacing + 05 Radius & Shadows */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Section number="04" title="Spacing System">
            <p className="mb-6 text-small text-neutral-700">Base unit: 4px</p>
            <ul className="flex flex-wrap items-end gap-x-5 gap-y-4">
              {spacing.map((px) => (
                <li key={px} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-xs bg-primary-200"
                    style={{ width: px, height: px }}
                  />
                  <p className="text-center text-[11px] leading-4 text-neutral-700">
                    {px}
                    <br />
                    <span className="text-neutral-500">({px / 16}rem)</span>
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <Section number="05" title="Radius & Shadows">
            <SubHeading>Radius</SubHeading>
            <ul className="mb-6 flex flex-wrap gap-4">
              {radii.map((r) => (
                <li key={r.name} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-12 border border-neutral-300 bg-white ${r.cls}`}
                  />
                  <p className="text-center text-[11px] leading-4 text-neutral-700">
                    {r.label}
                    <br />
                    <span className="text-neutral-500">({r.name})</span>
                  </p>
                </li>
              ))}
            </ul>
            <SubHeading>Shadows</SubHeading>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {shadows.map((s) => (
                <li
                  key={s.name}
                  className={`rounded-sm border border-neutral-100 bg-white p-3 ${s.cls}`}
                >
                  <p className="text-small font-semibold">{s.name}</p>
                  <p className="mt-1 text-[10px] leading-3.5 text-neutral-500">
                    {s.lines[0]}
                    <br />
                    {s.lines[1]}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* 06 Icons + 07 Buttons + 08 Inputs */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,2.1fr)_minmax(0,0.85fr)]">
          <Section number="06" title="Icons">
            <SubHeading>Outline Style</SubHeading>
            <ul className="mb-5 flex flex-wrap gap-3 text-neutral-900">
              {iconNames.map((name) => (
                <li key={name}>
                  <Icon name={name} size={20} />
                </li>
              ))}
            </ul>
            <SubHeading>Filled Style</SubHeading>
            <ul className="mb-6 flex flex-wrap gap-3 text-neutral-900">
              {iconNames.map((name) => (
                <li key={name}>
                  <Icon name={name} variant="filled" size={20} />
                </li>
              ))}
            </ul>
            <SubHeading>Icon Specs</SubHeading>
            <SpecList
              items={[
                "24x24px grid",
                "2px stroke weight (outline)",
                "Rounded line caps",
                "Consistent optical balance",
              ]}
            />
          </Section>

          <Section
            number="07"
            title="Buttons"
            className="lg:order-last lg:col-span-2 xl:order-none xl:col-span-1"
          >
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[auto_repeat(4,max-content)] items-center justify-between gap-x-4 gap-y-3">
                <span />
                {["Primary", "Secondary", "Tertiary", "Text"].map((v) => (
                  <span key={v} className="text-small text-neutral-700">
                    {v}
                  </span>
                ))}

                <span className="pr-2 text-small text-neutral-700">Default</span>
                <Button size="md">Get Started</Button>
                <Button size="md" variant="secondary">
                  Explore Courses
                </Button>
                <Button
                  size="md"
                  variant="tertiary"
                  icon={<Icon name="external" size={14} />}
                >
                  View Lesson
                </Button>
                <Button
                  variant="text"
                  size="md"
                  icon={<Icon name="play" size={16} />}
                >
                  Watch Video
                </Button>

                <span className="pr-2 text-small text-neutral-700">Hover</span>
                <Button size="md" forceHover>
                  Get Started
                </Button>
                <Button size="md" variant="secondary" forceHover>
                  Explore Courses
                </Button>
                <Button
                  size="md"
                  variant="tertiary"
                  forceHover
                  icon={<Icon name="external" size={14} />}
                >
                  View Lesson
                </Button>
                <Button
                  variant="text"
                  size="md"
                  forceHover
                  icon={<Icon name="play" size={16} />}
                >
                  Watch Video
                </Button>

                <span className="pr-2 text-small text-neutral-700">Disabled</span>
                <Button size="md" disabled>
                  Get Started
                </Button>
                <Button size="md" variant="secondary" disabled>
                  Explore Courses
                </Button>
                <Button
                  size="md"
                  variant="tertiary"
                  disabled
                  icon={<Icon name="external" size={14} />}
                >
                  View Lesson
                </Button>
                <Button
                  variant="text"
                  size="md"
                  disabled
                  icon={<Icon name="play" size={16} />}
                >
                  Watch Video
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <SubHeading>Button Specs</SubHeading>
              <SpecList
                items={[
                  "Height: 44px (default)",
                  "Padding: 0 16px (lg), 0 12px (md)",
                  "Radius: 12px",
                  "Font: Inter Medium (14–16px)",
                ]}
              />
            </div>
          </Section>

          <Section number="08" title="Inputs">
            <div className="flex flex-col gap-5">
              <div>
                <SubHeading>Search / Text Input</SubHeading>
                <SearchInput />
              </div>
              <div>
                <SubHeading>Select</SubHeading>
                <Select label="Sort by" defaultValue="relevant">
                  <option value="relevant">Most Relevant</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                </Select>
              </div>
              <div>
                <SubHeading>Field Specs</SubHeading>
                <SpecList
                  items={[
                    "Height: 44px",
                    "Radius: 12px",
                    "Border: 1px solid #E2E8F0",
                    "Padding: 0 16px",
                    "Focus: Border color #FB923C",
                  ]}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* 09 Badges + 10 Status + 11 Progress */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]">
          <Section number="09" title="Badges / Tags">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              <li>
                <SubHeading>Video</SubHeading>
                <Badge variant="video">Video</Badge>
              </li>
              <li>
                <SubHeading>Lesson</SubHeading>
                <Badge variant="lesson">Lesson</Badge>
              </li>
              <li>
                <SubHeading>Popular</SubHeading>
                <Badge variant="popular">Popular</Badge>
              </li>
            </ul>
          </Section>

          <Section number="10" title="Status / Indicators">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              <li>
                <StatusIndicator status="in-progress" />
              </li>
              <li>
                <StatusIndicator status="completed" />
              </li>
              <li>
                <StatusIndicator status="now-playing" />
              </li>
              <li>
                <StatusIndicator status="locked" />
              </li>
            </ul>
          </Section>

          <Section number="11" title="Progress Bar">
            <ProgressBar value={35} />
          </Section>
        </div>

        {/* 12 Cards */}
        <Section number="12" title="Cards">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <li className="flex flex-col gap-2">
              <SubHeading>Course Card</SubHeading>
              <CourseCard
                logo={<span className="text-heading-3 font-semibold">N</span>}
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                modules={12}
              />
            </li>
            <li className="flex flex-col gap-2">
              <SubHeading>Lesson Card (Video)</SubHeading>
              <LessonCard
                kind="video"
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                meta="Lesson 5.1 · 12:45"
                actionLabel="Watch from 12:45"
              />
            </li>
            <li className="flex flex-col gap-2">
              <SubHeading>Lesson Card (Lesson)</SubHeading>
              <LessonCard
                kind="lesson"
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                meta="Module 5"
                actionLabel="View lesson"
              />
            </li>
            <li className="flex flex-col gap-2">
              <SubHeading>Resource Card</SubHeading>
              <ResourceCard
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                meta="PDF · 1.2 MB"
              />
            </li>
          </ul>
        </Section>

        {/* 13 Navigation */}
        <Section number="13" title="Navigation">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1.6fr_1fr] lg:items-center">
            <NavBar
              tabs={[
                { label: "Courses", href: "#", active: true },
                { label: "My Learning", href: "#" },
              ]}
            />
            <div>
              <p className="mb-2 text-small text-neutral-700">Breadcrumbs</p>
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "#" },
                  { label: "Next.js for Production", href: "#" },
                  { label: "Data Fetching & Caching" },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-small text-neutral-700">Pagination</p>
              <Pagination pages={[1, 2, 3, "ellipsis", 8]} current={1} />
            </div>
          </div>
        </Section>

        {/* 14 Principles */}
        <Section number="14" title="Principles">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <li key={p.title} className="flex items-start gap-4">
                <Icon
                  name={p.icon}
                  size={28}
                  className="mt-0.5 shrink-0 text-neutral-700"
                />
                <div>
                  <p className="text-body font-semibold">{p.title}</p>
                  <p className="text-small text-neutral-500">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </main>
  );
}
