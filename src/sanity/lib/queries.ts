import { defineQuery } from 'next-sanity'

const imageFields = /* groq */ `asset, hotspot, crop, alt`

export const COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] | order(popular desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    popular,
    studentCount,
    coverImage { ${imageFields} },
    "category": category->{ title, "slug": slug.current },
    "moduleCount": count(modules),
    "durationSeconds": math::sum(modules[].lessons[]->durationSeconds)
  }
`)

export const COURSE_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    price,
    popular,
    studentCount,
    coverImage { ${imageFields} },
    outcomes[] { _key, icon, title, description },
    "instructor": instructor->{
      _id, name, "slug": slug.current, photo { ${imageFields} }, expertise
    },
    "category": category->{ _id, title, "slug": slug.current },
    "modules": modules[] {
      _key,
      title,
      summary,
      "durationSeconds": math::sum(lessons[]->durationSeconds),
      "lessons": lessons[]->{
        _id, title, "slug": slug.current, summary, durationSeconds, freePreview
      }
    },
    "moduleCount": count(modules),
    "durationSeconds": math::sum(modules[].lessons[]->durationSeconds)
  }
`)

export const LESSON_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    videoUrl,
    poster { ${imageFields} },
    durationSeconds,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[] { _key, type, title, description, url },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      "slug": slug.current,
      level,
      coverImage { ${imageFields} },
      "instructor": instructor->{ name, "slug": slug.current },
      "modules": modules[] {
        _key,
        title,
        "durationSeconds": math::sum(lessons[]->durationSeconds),
        "lessons": lessons[]->{
          _id, title, "slug": slug.current, durationSeconds
        }
      }
    }
  }
`)

export const INSTRUCTOR_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo { ${imageFields} },
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      level,
      coverImage { ${imageFields} },
      "moduleCount": count(modules),
      "durationSeconds": math::sum(modules[].lessons[]->durationSeconds)
    }
  }
`)

export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id, title, "slug": slug.current, description
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)]{ "slug": slug.current }
`)

export const LESSON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && defined(slug.current)]{ "slug": slug.current }
`)

export const INSTRUCTOR_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && defined(slug.current)]{ "slug": slug.current }
`)
