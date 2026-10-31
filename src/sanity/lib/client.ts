import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

const token = process.env.SANITY_API_READ_TOKEN

if (!token) {
  throw new Error('Missing environment variable: SANITY_API_READ_TOKEN')
}

/**
 * Read-only client for the private dataset. Server only: `server-only` makes
 * the build fail if a Client Component imports it, so the token never
 * reaches the browser.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token,
})
