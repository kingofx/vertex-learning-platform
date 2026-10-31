/**
 * Hosts the Sanity Studio inside the Next.js app at /studio.
 * Studio access is controlled by Sanity sign-in, not Clerk.
 */
import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
