"use client";

import { useId, useState } from "react";

export function EmailCapture({
  onSubmit,
  className = "",
}: {
  onSubmit?: (email: string) => void;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const id = useId();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) onSubmit?.(email);
      }}
      className={`flex w-full max-w-[357px] items-center justify-between gap-3 bg-white p-3 ${className}`}
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
        className="type-body min-w-0 flex-1 bg-transparent text-ink placeholder:text-ink-50 outline-none"
      />
      <button
        type="submit"
        className="type-button shrink-0 cursor-pointer rounded-button-sm bg-ink px-4 py-2 text-white transition-colors hover:bg-ink-88"
      >
        Join
      </button>
    </form>
  );
}
