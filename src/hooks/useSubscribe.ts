"use client";

import { useState, useCallback } from "react";

/**
 * Newsletter subscription hook — calls Klaviyo's Client Subscriptions API
 * directly from the browser. Used by:
 *   - src/components/layout/Footer.tsx
 *   - src/components/sections/about/AboutNewsletter.tsx
 *
 * Both forms feed the same "Website Newsletter" list (R4S9v7).
 *
 * NOTE: This is unrelated to the /hi QR-feedback flow. That uses a
 * separate list and a server route (/api/feedback) — see src/lib/klaviyo.ts.
 *
 * The Klaviyo Public Company ID is intentionally exposed in client-side
 * code; it's a public identifier (Klaviyo's Client API is designed for it).
 */

const KLAVIYO_COMPANY_ID = "WSHPRF";
const NEWSLETTER_LIST_ID = "R4S9v7";

const KLAVIYO_SUBSCRIPTIONS_URL =
  `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`;

const FRIENDLY_ERROR =
  "Something went wrong. Please try again or email us directly.";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface UseSubscribeReturn extends SubscribeState {
  subscribe: (email: string) => Promise<void>;
  reset: () => void;
}

export function useSubscribe(): UseSubscribeReturn {
  const [state, setState] = useState<SubscribeState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const subscribe = useCallback(async (rawEmail: string) => {
    const email = rawEmail.trim();

    if (!EMAIL_REGEX.test(email)) {
      setState({
        isLoading: false,
        isSuccess: false,
        error: "Please enter a valid email address.",
      });
      return;
    }

    setState({ isLoading: true, isSuccess: false, error: null });

    try {
      const res = await fetch(KLAVIYO_SUBSCRIPTIONS_URL, {
        method: "POST",
        headers: {
          revision: "2024-10-15",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: { email },
                },
              },
            },
            relationships: {
              list: {
                data: { type: "list", id: NEWSLETTER_LIST_ID },
              },
            },
          },
        }),
      });

      // Klaviyo returns 202 Accepted on success; treat any 2xx as success.
      if (res.status >= 200 && res.status < 300) {
        setState({ isLoading: false, isSuccess: true, error: null });
        return;
      }

      setState({ isLoading: false, isSuccess: false, error: FRIENDLY_ERROR });
    } catch {
      setState({ isLoading: false, isSuccess: false, error: FRIENDLY_ERROR });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isSuccess: false, error: null });
  }, []);

  return { ...state, subscribe, reset };
}
