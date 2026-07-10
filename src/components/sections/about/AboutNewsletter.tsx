"use client";

import { useState, useEffect } from "react";
import { useSubscribe } from "@/hooks/useSubscribe";

export function AboutNewsletter() {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, isSuccess, error } = useSubscribe();

  useEffect(() => {
    if (isSuccess) setEmail("");
  }, [isSuccess]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || isLoading) return;
    await subscribe(email);
  }

  return (
    <section className="bg-crosps-offwhite py-16 md:py-20" id="contact">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mx-auto max-w-[560px]">
          <h2 className="mb-6 font-serif text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] text-crosps-charcoal">
            Join our mailing list before your friends do.
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex h-[50px] items-center justify-between border border-crosps-charcoal-15 bg-white px-6 py-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              className="w-full bg-transparent text-[16px] leading-[1.5] text-crosps-charcoal placeholder:text-crosps-charcoal/50 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0 cursor-pointer text-[14px] font-medium uppercase tracking-wide text-crosps-charcoal transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isLoading ? "..." : "Subscribe"}
            </button>
          </form>
          {isSuccess && (
            <p className="mt-3 text-[14px] text-crosps-charcoal">
              You&apos;re in! We&apos;ll be in touch.
            </p>
          )}
          {error && (
            <p className="mt-3 text-[14px] text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
