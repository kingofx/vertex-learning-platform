import { PlayIcon } from '@sanity/icons/Play'
import { defineArrayMember, defineField, defineType } from 'sanity'

const VIDEO_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'bunny.net', 'mediadelivery.net']

export const lesson = defineType({
  name: 'lesson',
  type: 'document',
  icon: PlayIcon,
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
      rows: 2,
      description: 'One or two sentences shown under the title and on search cards.',
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      description: 'YouTube, Vimeo or Bunny link. The lesson page embeds it.',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https'] })
          .custom((value) => {
            if (!value) return true
            try {
              const host = new URL(value).hostname
              return VIDEO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
                ? true
                : 'Use a YouTube, Vimeo or Bunny link'
            } catch {
              return 'Enter a valid URL'
            }
          }),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'duration',
      type: 'number',
      description: 'Video length in seconds.',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'freePreview',
      type: 'boolean',
      description: 'Shows a "free preview" label. It does not gate access.',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      description: 'Shown for display only.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'notes',
      type: 'array',
      description: 'Lesson notes and overview.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'keyPoints',
      type: 'array',
      description: 'Shown under "In this lesson you will".',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'proTip', type: 'text', rows: 3 }),
    defineField({
      name: 'resources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'resource',
          fields: [
            defineField({
              name: 'type',
              type: 'string',
              options: {
                list: [
                  { title: 'Article', value: 'article' },
                  { title: 'Repository', value: 'repository' },
                  { title: 'Video', value: 'video' },
                  { title: 'Download', value: 'download' },
                  { title: 'Link', value: 'link' },
                ],
                layout: 'radio',
              },
              initialValue: 'article',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'type' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary', media: 'thumbnail' },
  },
})
