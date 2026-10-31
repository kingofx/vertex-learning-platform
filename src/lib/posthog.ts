import posthog from "posthog-js";

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export function capturePostHogEvent(
  eventName: string,
  properties?: AnalyticsProperties,
) {
  if (!isConfigured) return;
  posthog.capture(eventName, properties);
}

export function identifyPostHogUser(
  distinctId: string,
  properties?: AnalyticsProperties,
) {
  if (!isConfigured) return;
  posthog.identify(distinctId, properties);
}

export function resetPostHogIdentity() {
  if (!isConfigured) return;
  posthog.reset();
}
