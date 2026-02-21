"use client";

import { useState } from "react";
import Image from "next/image";

export function CtaVerify() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setEmail("");
  }

  return (
    <section id="signup" className="bg-white py-0">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row">
          {/* Left: green light panel */}
          <div className="flex shrink-0 flex-col items-center justify-center bg-crosps-green-light px-6 py-20 md:w-[42%] md:px-6 md:py-[185px]">
            <div className="flex max-w-[336px] flex-col items-center gap-10">
              {/* NEWS badge */}
              <span className="bg-white px-3 py-2 text-[12px] font-medium leading-[1.4] tracking-[1px] text-crosps-charcoal">
                STAY UP TO DATE
              </span>

              {/* Heading + body */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="font-serif text-[32px] italic leading-none text-crosps-charcoal">
                  You&apos;ll want in early.
                </h2>
                <div className="text-[16px] leading-[1.5] text-crosps-charcoal-88">
                  <p>Launching with tomato, pepper and onion.</p>
                  <p>Get in now, and have no regrets later.</p>
                </div>
              </div>

              {/* Email input */}
              <form
                onSubmit={handleSubmit}
                className="w-full"
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-transparent text-[16px] leading-[1.5] text-crosps-charcoal placeholder:text-crosps-charcoal/50 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 cursor-pointer text-[16px] leading-none text-crosps-charcoal-72 hover:text-crosps-charcoal"
                  >
                    Enter
                  </button>
                </div>
                <div className="h-px w-full bg-crosps-charcoal-15" />
              </form>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative aspect-[786/621] w-full md:flex-1">
            <Image
              src="/brocolli_car.png"
              alt="Person holding broccoli in a car"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
