import { FolderIcon } from '@sanity/icons/Folder'
import { defineArrayMember, defineField, defineType } from 'sanity'

/** Embedded in course.modules. Numbers (Module 5, Lesson 5.1) come from order. */
export const courseModule = defineType({
  name: 'courseModule',
  title: 'Module',
  type: 'object',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 2 }),
    defineField({
      name: 'lessons',
      type: 'array',
      of: [
        defineArrayMember({ type: 'reference', to: [{ type: 'lesson' }] }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: 'title', lessons: 'lessons' },
    prepare: ({ title, lessons }) => ({
      title,
      subtitle: `${lessons?.length ?? 0} lessons`,
    }),
  },
})
