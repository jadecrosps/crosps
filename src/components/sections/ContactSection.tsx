"use client";

import { useState } from "react";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section className="bg-crosps-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Left: info panel (light purple) */}
          <div className="flex flex-col justify-center bg-crosps-purple-dust p-8 md:p-10 lg:p-12">
            <span className="mb-6 inline-flex w-fit border border-crosps-charcoal-15 bg-white px-4 py-2 text-[12px] font-medium leading-[1.4] tracking-[1px] text-crosps-charcoal">
              Say hi
            </span>
            <h1 className="mb-4 font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] text-crosps-charcoal">
              Contact us
            </h1>
            <p className="text-[16px] leading-[1.6] text-crosps-charcoal-88">
              Looking to stock Crosps? Have a question or enquiry? You&apos;ll find further details in our FAQs below but if they don&apos;t cover what you&apos;re looking for, we&apos;d be delighted to hear from you.
            </p>
          </div>

          {/* Right: form */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-[12px] font-medium uppercase tracking-widest text-crosps-charcoal">
                  Full name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full border-0 border-b border-crosps-charcoal-15 bg-transparent pb-3 text-[16px] leading-[1.5] text-crosps-charcoal placeholder:text-crosps-charcoal/50 outline-none transition-colors focus:border-crosps-charcoal"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-[12px] font-medium uppercase tracking-widest text-crosps-charcoal">
                  Email address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your@email.com"
                  required
                  className="w-full border-0 border-b border-crosps-charcoal-15 bg-transparent pb-3 text-[16px] leading-[1.5] text-crosps-charcoal placeholder:text-crosps-charcoal/50 outline-none transition-colors focus:border-crosps-charcoal"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-[12px] font-medium uppercase tracking-widest text-crosps-charcoal">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please enter text here"
                  required
                  rows={5}
                  className="w-full resize-y border border-crosps-charcoal-15 bg-transparent px-0 py-3 text-[16px] leading-[1.5] text-crosps-charcoal placeholder:text-crosps-charcoal/50 outline-none transition-colors focus:border-crosps-charcoal"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-fit items-center justify-center border-2 border-crosps-charcoal bg-white px-8 py-4 text-[14px] font-medium uppercase tracking-widest text-crosps-charcoal transition-colors hover:bg-crosps-charcoal hover:text-white"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
