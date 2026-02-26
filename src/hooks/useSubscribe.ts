"use client";

import { useState, useCallback } from "react";

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

  const subscribe = useCallback(async (email: string) => {
    setState({ isLoading: true, isSuccess: false, error: null });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({
          isLoading: false,
          isSuccess: false,
          error: data.error || "Something went wrong",
        });
        return;
      }

      setState({ isLoading: false, isSuccess: true, error: null });
    } catch {
      setState({
        isLoading: false,
        isSuccess: false,
        error: "Network error. Please try again.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isSuccess: false, error: null });
  }, []);

  return { ...state, subscribe, reset };
}
