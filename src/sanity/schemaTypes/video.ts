import { PlayIcon } from '@sanity/icons/Play'
import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Internal lookup for search, built by the ingestion pipeline (one document
 * per unique video URL). Never shown to learners and not listed in the Studio
 * structure.
 */
export const video = defineType({
  name: 'video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      description: 'Matches the videoUrl of the lessons that use this video.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapters',
      type: 'array',
      description: 'Table of contents, matched first.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
            }),
            defineField({
              name: 'label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'startSeconds' } },
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      type: 'array',
      description: 'Transcript in short timestamped pieces, matched second.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chunk',
          fields: [
            defineField({
              name: 'startSeconds',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
            }),
            defineField({
              name: 'text',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'text', subtitle: 'startSeconds' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'url' } },
})
