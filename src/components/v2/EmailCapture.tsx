"use client";

import { useId, useState } from "react";
import { useSubscribe } from "@/hooks/useSubscribe";

// Joins the Klaviyo "Website Newsletter" list unless an onSubmit override is passed.
export function EmailCapture({
  onSubmit,
  className = "",
}: {
  onSubmit?: (email: string) => void;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const id = useId();
  const { subscribe, isLoading, isSuccess, error } = useSubscribe();

  if (isSuccess) {
    return (
      <p role="status" className={`type-body w-full max-w-[357px] bg-white p-4 text-ink ${className}`}>
        You’re on the list. We’ll be in touch.
      </p>
    );
  }

  return (
    <div className={`flex w-full max-w-[357px] flex-col gap-2 ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          if (onSubmit) onSubmit(email);
          else void subscribe(email);
        }}
        className="flex w-full items-center justify-between gap-3 bg-white p-3"
      >
        <label className="sr-only" htmlFor={id}>
          Email address
        </label>
        <input
          id={id}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          aria-invalid={!!error || undefined}
          className="type-body min-w-0 flex-1 bg-transparent text-ink placeholder:text-ink-50 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="type-mono shrink-0 cursor-pointer rounded-button-sm bg-ink px-4 py-2 text-white transition-colors hover:bg-ink-88 disabled:opacity-50"
        >
          {isLoading ? "Joining…" : "Join"}
        </button>
      </form>
      {error && (
        <p role="alert" className="type-small text-tomato">
          {error}
        </p>
      )}
    </div>
  );
}
