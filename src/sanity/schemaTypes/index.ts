import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { course } from './course'
import { courseModule } from './course-module'
import { instructor } from './instructor'
import { lesson } from './lesson'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [course, courseModule, lesson, instructor, category],
}
