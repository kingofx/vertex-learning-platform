import { BookIcon } from '@sanity/icons/Book'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) =>
            rule.required().warning('Alt text helps accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      description: 'Display price in USD. 0 means free.',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'popular',
      type: 'boolean',
      description: 'Shows the "Popular" badge.',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      description: 'Shown for display only.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'outcomes',
      title: 'What you’ll learn',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'outcome',
          fields: [
            defineField({
              name: 'icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Layers', value: 'layers' },
                  { title: 'Database', value: 'database' },
                  { title: 'Gauge', value: 'gauge' },
                  { title: 'Cloud', value: 'cloud' },
                  { title: 'Code', value: 'code' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Rocket', value: 'rocket' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'title', subtitle: 'icon' } },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      type: 'array',
      of: [defineArrayMember({ type: 'courseModule' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      level: 'level',
      instructor: 'instructor.name',
      media: 'coverImage',
    },
    prepare: ({ title, level, instructor, media }) => ({
      title,
      subtitle: [level, instructor].filter(Boolean).join(' · '),
      media,
    }),
  },
})
