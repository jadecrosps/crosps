"use client";

import { useId, useState } from "react";
import { sendContact } from "@/app/v2/contact-actions";
import { Button } from "./Button";

export type ContactTopic = "stock" | "hello";

const TOPICS: { id: ContactTopic; title: string; body: string }[] = [
  { id: "stock", title: "Want to stock Crosps?", body: "Shops, delis, cafés and restaurants." },
  { id: "hello", title: "Want to reach out?", body: "Questions, feedback, press or anything else." },
];

const BUSINESS_TYPES = ["Shop or deli", "Café", "Restaurant or bar", "Hotel", "Office", "Other"];
const VOLUMES = ["3–10 cases", "10–25 cases", "25–50 cases", "50+ cases or pallets", "Not sure yet"];

const FIELD = "type-body w-full border-b border-ink-10 bg-transparent pb-2 pt-1 text-ink placeholder:text-ink-50 outline-none transition-colors focus:border-ink";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-label text-ink">
        {label}
        {required && <span className="text-ink-50"> *</span>}
      </label>
      {children(id)}
    </div>
  );
}

export function ContactForm({
  initialTopic = "hello",
  onSubmit,
  submitLabel,
  note,
  lockTopic = false,
}: {
  initialTopic?: ContactTopic;
  lockTopic?: boolean; // hide the topic picker (e.g. the trade page)
  onSubmit?: (topic: ContactTopic, data: Record<string, string>) => void;
  submitLabel?: string;
  note?: React.ReactNode;
}) {
  const [topic, setTopic] = useState<ContactTopic>(initialTopic);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4 bg-cream p-8 md:p-10">
        <p className="type-heading text-ink">Thank you.</p>
        <p className="type-body text-ink-88">
          {topic === "stock"
            ? "We’ll look at your details and get back to you about stocking Crosps."
            : "We’ve got your message and will get back to you soon."}
        </p>
        <button type="button" onClick={() => setSent(false)} className="type-small cursor-pointer text-ink underline underline-offset-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        if (onSubmit) {
          onSubmit(topic, data);
          setSent(true);
          return;
        }
        setSending(true);
        setError(null);
        const r = await sendContact({ ...data, topic });
        setSending(false);
        if (r.ok) setSent(true);
        else setError(r.error);
      }}
      className="flex flex-col gap-10"
    >
      <fieldset className={`flex flex-col gap-3 ${lockTopic ? "hidden" : ""}`}>
        <legend className="type-label mb-3 text-ink">What’s it about?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer flex-col gap-1 border p-5 transition-colors ${
                topic === t.id ? "border-ink bg-white" : "border-ink-10 bg-white hover:border-ink-50"
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={t.id}
                checked={topic === t.id}
                onChange={() => setTopic(t.id)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-3 font-sans text-[18px] leading-[1.2] text-ink">
                {t.title}
                <span
                  aria-hidden
                  className={`size-2 shrink-0 rounded-full border border-ink transition-colors ${topic === t.id ? "bg-ink" : ""}`}
                />
              </span>
              <span className="type-small text-ink-72">{t.body}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Name" required>
          {(id) => <input id={id} name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />}
        </Field>
        <Field label="Email" required>
          {(id) => <input id={id} name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={FIELD} />}
        </Field>

        {topic === "stock" && (
          <>
            <Field label="Business name" required>
              {(id) => <input id={id} name="business" required autoComplete="organization" placeholder="Where you’d sell Crosps" className={FIELD} />}
            </Field>
            <Field label="Type of business">
              {(id) => (
                <select id={id} name="business_type" defaultValue="" className={`${FIELD} cursor-pointer appearance-none`}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Town or city" required>
              {(id) => <input id={id} name="city" required autoComplete="address-level2" placeholder="e.g. London" className={FIELD} />}
            </Field>
            <Field label="Expected order size">
              {(id) => (
                <select id={id} name="volume" defaultValue="" className={`${FIELD} cursor-pointer appearance-none`}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {VOLUMES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Website or Instagram">
              {(id) => <input id={id} name="website" placeholder="@yourshop" className={FIELD} />}
            </Field>
          </>
        )}
      </div>

      <Field label={topic === "stock" ? "Anything else?" : "Message"} required={topic === "hello"}>
        {(id) => (
          <textarea
            id={id}
            name="message"
            required={topic === "hello"}
            rows={4}
            placeholder={topic === "stock" ? "Tell us a little about your shop" : "How can we help?"}
            className={`${FIELD} resize-y`}
          />
        )}
      </Field>

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <input type="text" name="company_url" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-col items-start gap-4">
        <Button type="submit" disabled={sending}>
          {sending ? "Sending…" : (submitLabel ?? (topic === "stock" ? "Send enquiry" : "Send message"))}
        </Button>
        {error && (
          <p role="alert" className="type-body text-tomato">
            {error === "fallback" ? (
              <>
                Sorry, your message didn’t send. Please email us at{" "}
                <a href="mailto:jade@eatcrosps.com" className="underline underline-offset-4">
                  jade@eatcrosps.com
                </a>
                .
              </>
            ) : (
              error
            )}
          </p>
        )}
        {note && <p className="type-body text-ink-50">{note}</p>}
      </div>
    </form>
  );
}
