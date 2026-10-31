"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import {
  identifyPostHogUser,
  resetPostHogIdentity,
} from "@/lib/posthog";

export function PostHogIdentity() {
  const { isLoaded, isSignedIn, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      if (identifiedUserId.current !== user.id) {
        identifyPostHogUser(user.id, {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName ?? undefined,
        });
        identifiedUserId.current = user.id;
      }
      return;
    }

    if (identifiedUserId.current) {
      resetPostHogIdentity();
      identifiedUserId.current = null;
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
