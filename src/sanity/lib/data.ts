import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import type { COURSE_QUERY_RESULT, LESSON_QUERY_RESULT } from '../../../sanity.types'
import { client } from './client'
import {
  CATEGORIES_QUERY,
  COURSE_QUERY,
  COURSE_SLUGS_QUERY,
  COURSES_QUERY,
  INSTRUCTOR_QUERY,
  INSTRUCTOR_SLUGS_QUERY,
  LESSON_QUERY,
  LESSON_SLUGS_QUERY,
} from './queries'

/**
 * Server-side read layer. Every function caches for a few minutes and is
 * tagged so a later webhook can revalidate by `revalidateTag`.
 */

type Numbered<M extends { lessons: unknown }> = M extends {
  lessons: Array<infer L> | null
}
  ? Omit<M, 'lessons'> & {
      /** 1-based position in the course. */
      number: number
      lessons: Array<NonNullable<L> & { number: string }>
    }
  : never

/** Module and lesson numbers (Module 5, Lesson 5.1) come from order, not storage. */
function numberModules<M extends { lessons: unknown }>(
  modules: M[] | null,
): Numbered<M>[] {
  return (modules ?? []).map((module, i) => {
    const lessons = (module.lessons as unknown[] | null) ?? []
    return {
      ...module,
      number: i + 1,
      lessons: lessons
        .filter((lesson) => lesson !== null)
        .map((lesson, j) => ({ ...(lesson as object), number: `${i + 1}.${j + 1}` })),
    } as unknown as Numbered<M>
  })
}

export async function getCourses() {
  'use cache'
  cacheLife('minutes')
  cacheTag('course', 'category')

  return client.fetch(COURSES_QUERY)
}

export async function getCourse(slug: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag('course', `course:${slug}`, 'lesson', 'instructor', 'category')

  const course = await client.fetch(COURSE_QUERY, { slug })
  if (!course) return null

  return { ...course, modules: numberModules(course.modules) }
}

type LessonResult = NonNullable<LESSON_QUERY_RESULT>
type CourseResult = NonNullable<COURSE_QUERY_RESULT>

export async function getLesson(slug: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag('lesson', `lesson:${slug}`, 'course')

  const lesson: LessonResult | null = await client.fetch(LESSON_QUERY, { slug })
  if (!lesson) return null

  const { course } = lesson
  if (!course) return { ...lesson, course: null, position: null }

  const modules = numberModules(course.modules)
  const flat = modules.flatMap((module) =>
    module.lessons.map((item) => ({ module, item })),
  )
  const index = flat.findIndex(({ item }) => item.slug === slug)
  const current = flat[index]

  const neighbour = (entry: (typeof flat)[number] | undefined) =>
    entry
      ? {
          title: entry.item.title,
          slug: entry.item.slug,
          durationSeconds: entry.item.durationSeconds,
        }
      : null

  return {
    ...lesson,
    course: { ...course, modules },
    position: current
      ? {
          moduleNumber: current.module.number,
          moduleTitle: current.module.title,
          moduleCount: modules.length,
          /** Shown as "Lesson 5.1". */
          label: current.item.number,
          previous: neighbour(flat[index - 1]),
          next: neighbour(flat[index + 1]),
        }
      : null,
  }
}

export async function getInstructor(slug: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag('instructor', `instructor:${slug}`, 'course')

  return client.fetch(INSTRUCTOR_QUERY, { slug })
}

export async function getCategories() {
  'use cache'
  cacheLife('minutes')
  cacheTag('category')

  return client.fetch(CATEGORIES_QUERY)
}

/** For generateStaticParams. */
export async function getCourseSlugs() {
  'use cache'
  cacheLife('minutes')
  cacheTag('course')

  return client.fetch(COURSE_SLUGS_QUERY)
}

export async function getLessonSlugs() {
  'use cache'
  cacheLife('minutes')
  cacheTag('lesson')

  return client.fetch(LESSON_SLUGS_QUERY)
}

export async function getInstructorSlugs() {
  'use cache'
  cacheLife('minutes')
  cacheTag('instructor')

  return client.fetch(INSTRUCTOR_SLUGS_QUERY)
}

export type Course = NonNullable<Awaited<ReturnType<typeof getCourse>>>
export type Lesson = NonNullable<Awaited<ReturnType<typeof getLesson>>>
export type { CourseResult }
