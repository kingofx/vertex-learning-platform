'use client'

/**
 * Config for the Sanity Studio mounted at /studio
 * (src/app/studio/[[...tool]]/page.tsx).
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    // GROQ playground inside the Studio.
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
