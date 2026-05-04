"use client";

/* ╔══════════════════════════════════════════════════════════════════════╗
 * ║ ⚠️  CRITICAL — PHYSICAL PACKAGING DEPENDENCY                          ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║ This route (/hi) is the destination for QR codes printed on physical ║
 * ║ Crosps snack-bag packaging. Every bag in circulation routes here.    ║
 * ║                                                                      ║
 * ║   • DO NOT DELETE this route.                                        ║
 * ║   • DO NOT RENAME this route without adding a permanent 301 redirect ║
 * ║     from /hi → wherever it moves. (See vercel.json + vercel.json.md.) ║
 * ║   • DO NOT CHANGE the accepted `sku` values: "onion", "tomato",      ║
 * ║     "pepper". They are baked into printed QR codes — changing the    ║
 * ║     strings breaks every bag in the wild.                            ║
 * ║                                                                      ║
 * ║ Printed URLs (encoded in physical QR codes):                         ║
 * ║   https://eatcrosps.com/hi?sku=onion                                 ║
 * ║   https://eatcrosps.com/hi?sku=tomato                                ║
 * ║   https://eatcrosps.com/hi?sku=pepper                                ║
 * ║                                                                      ║
 * ║ See README.md → "⚠️ Critical: Physical packaging dependencies".      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { validateSku, type Sku } from "@/lib/sku";

type Step = "rating" | "feedback" | "email" | "done";
type Band = "low" | "mid" | "high";

export default function HiPage() {
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sku, setSku] = useState<Sku | null>(null);

  // Read ?sku= from URL once on mount; only accept the three valid values
  useEffect(() => {
    if (typeof window === "undefined") return;
    const param = new URLSearchParams(window.location.search).get("sku");
    setSku(validateSku(param));
  }, []);

  const band: Band = (() => {
    const r = rating ?? 0;
    if (r >= 4) return "high";
    if (r === 3) return "mid";
    return "low";
  })();

  const feedbackType: "improvement" | "almost_there" | "review" =
    band === "high" ? "review" : band === "mid" ? "almost_there" : "improvement";

  function handleRatingSelect(value: number) {
    setRating(value);
    track("rating_submitted", { rating: value });
    // Small delay so the user sees the star fill before transition
    setTimeout(() => setStep("feedback"), 220);
  }

  function handleFeedbackSend() {
    track("feedback_submitted", {
      rating: rating ?? 0,
      length: feedback.length,
    });
    setStep("email");
  }

  function handleFeedbackSkip() {
    track("feedback_skipped", { rating: rating ?? 0 });
    setStep("email");
  }

  async function submitToServer(emailToSend: string | null) {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToSend,
          rating,
          feedback_text: feedback,
          feedback_type: feedbackType,
          sku,
        }),
      });
    } catch (err) {
      // Errors are logged server-side; never block the user flow
      console.error("[hi] submission error", err);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    track("email_submitted", { rating: rating ?? 0 });
    setEmailSubmitted(true);
    await submitToServer(email);
    setSubmitting(false);
    setStep("done");
  }

  async function handleNoThanks() {
    setSubmitting(true);
    track("email_skipped", { rating: rating ?? 0 });
    setEmailSubmitted(false);
    await submitToServer(null);
    setSubmitting(false);
    setStep("done");
  }

  return (
    <main className="min-h-[100dvh] w-full bg-crosps-cream text-crosps-charcoal flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-12 md:max-w-lg md:pt-20">
        {step === "rating" && (
          <RatingStep
            rating={rating}
            hoverRating={hoverRating}
            onHover={setHoverRating}
            onSelect={handleRatingSelect}
          />
        )}

        {step === "feedback" && (
          <FeedbackStep
            band={band}
            value={feedback}
            onChange={setFeedback}
            onSubmit={handleFeedbackSend}
            onSkip={handleFeedbackSkip}
          />
        )}

        {step === "email" && (
          <EmailStep
            band={band}
            email={email}
            onChange={setEmail}
            onSubmit={handleEmailSubmit}
            onSkip={handleNoThanks}
            submitting={submitting}
          />
        )}

        {step === "done" && <DoneStep band={band} emailSubmitted={emailSubmitted} />}
      </div>
    </main>
  );
}

/* ── Steps ───────────────────────────────────────────────── */

function RatingStep({
  rating,
  hoverRating,
  onHover,
  onSelect,
}: {
  rating: number | null;
  hoverRating: number | null;
  onHover: (n: number | null) => void;
  onSelect: (n: number) => void;
}) {
  const active = hoverRating ?? rating ?? 0;

  return (
    <div className="flex flex-1 flex-col justify-center gap-10 fade-in">
      <div className="flex flex-col gap-3">
        <h1 className="text-[clamp(28px,7vw,44px)] leading-[1.15] tracking-tight">
          Thanks for your time.
          <br />
          We read <SerifAccent>every</SerifAccent> reply.
        </h1>
        <p className="text-[20px] leading-[1.4] text-crosps-charcoal-72">
          How were they?
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-start md:gap-4">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= active;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              onClick={() => onSelect(n)}
              onMouseEnter={() => onHover(n)}
              onMouseLeave={() => onHover(null)}
              className="group flex h-14 w-14 cursor-pointer items-center justify-center transition-transform duration-150 active:scale-90 md:h-16 md:w-16"
            >
              <Star filled={filled} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FeedbackStep({
  band,
  value,
  onChange,
  onSubmit,
  onSkip,
}: {
  band: Band;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}) {
  const copy = {
    low: {
      heading: "Thank you for being honest.",
      subhead:
        "Your feedback genuinely helps us get better. What would have made these worth a higher rating?",
      placeholder: "Tell us anything\u2026",
    },
    mid: {
      heading: "Thanks for the honesty.",
      subhead:
        "We're still getting these right. What would have tipped them from a 3 to a 5?",
      placeholder: "Tell us anything\u2026",
    },
    high: {
      heading: "Thank you for your time, it means a lot.",
      subhead:
        "Mind leaving us a quick review? It helps us get Crosps into the hands of more people and more flavours on the shelves.",
      placeholder: "Write your review\u2026",
    },
  }[band];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-1 flex-col gap-6 fade-in"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-[32px] leading-[1.1] tracking-tight md:text-[40px]">
          {copy.heading}
        </h1>
        <p className="text-[18px] leading-[1.4] text-crosps-charcoal-72">
          {copy.subhead}
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.placeholder}
        rows={6}
        className="w-full resize-none border border-crosps-charcoal-15 bg-white px-4 py-3 text-[16px] leading-[1.4] text-crosps-charcoal placeholder:text-crosps-charcoal/40 outline-none focus:border-crosps-charcoal"
      />

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="submit"
          className="w-full cursor-pointer bg-crosps-charcoal px-6 py-4 text-[16px] font-medium tracking-wide text-crosps-cream transition-opacity hover:opacity-90"
        >
          Send
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="cursor-pointer py-2 text-[14px] text-crosps-charcoal-72 underline-offset-4 hover:underline"
        >
          Skip
        </button>
      </div>
    </form>
  );
}

function EmailStep({
  band,
  email,
  onChange,
  onSubmit,
  onSkip,
  submitting,
}: {
  band: Band;
  email: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-6 fade-in">
      {band === "low" && (
        <div className="flex flex-col gap-3">
          <h1 className="text-[40px] leading-[1.05] tracking-tight md:text-[56px]">
            The door&rsquo;s <SerifAccent>open.</SerifAccent>
          </h1>
          <p className="text-[18px] leading-[1.45] text-crosps-charcoal-72">
            Maybe this flavour just wasn&rsquo;t for you, and that&rsquo;s
            okay.
          </p>
          <p className="text-[16px] leading-[1.5] text-crosps-charcoal-72">
            We&rsquo;ve got more flavours coming. If you&rsquo;d like to try
            the next one when it drops, we&rsquo;d love to have you. Thanks
            for giving us a try.
          </p>
          <p className="text-[16px] leading-[1.4] text-crosps-charcoal-72">
            - Jade x
          </p>
        </div>
      )}

      {band === "mid" && (
        <div className="flex flex-col gap-3">
          <h1 className="text-[40px] leading-[1.05] tracking-tight md:text-[56px]">
            We&rsquo;re getting <SerifAccent>closer.</SerifAccent>
          </h1>
          <p className="text-[16px] leading-[1.5] text-crosps-charcoal-72">
            You said these were almost there, and we really appreciate it. If
            you&rsquo;d like to stay in touch, drop your email and we&rsquo;ll
            let you know when the next flavour drops. We&rsquo;d love to know
            what you think of it compared to what you tried today.
          </p>
          <p className="text-[16px] leading-[1.4] text-crosps-charcoal-72">
            - Jade x
          </p>
        </div>
      )}

      {band === "high" && (
        <div className="flex flex-col gap-3">
          <h1 className="text-[40px] leading-[1.05] tracking-tight md:text-[56px]">
            Want <SerifAccent>in?</SerifAccent>
          </h1>
          <p className="text-[18px] leading-[1.4] text-crosps-charcoal-72">
            We make small batches and new flavours sell out fast. Drop your
            email and you&rsquo;ll be first to hear when we restock or drop
            something new… <SerifAccent>before</SerifAccent> it goes public.
          </p>
        </div>
      )}

      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@example.com"
        className="w-full border border-crosps-charcoal-15 bg-white px-4 py-4 text-[16px] leading-[1.4] text-crosps-charcoal placeholder:text-crosps-charcoal/40 outline-none focus:border-crosps-charcoal"
      />

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={submitting || !email}
          className="w-full cursor-pointer bg-crosps-charcoal px-6 py-4 text-[16px] font-medium tracking-wide text-crosps-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Sending…"
            : band === "low"
            ? "Keep me posted"
            : "Count me in"}
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={submitting}
          className="cursor-pointer py-2 text-[14px] text-crosps-charcoal-72 underline-offset-4 hover:underline disabled:opacity-50"
        >
          No thanks
        </button>
      </div>
    </form>
  );
}

function DoneStep({
  band,
  emailSubmitted,
}: {
  band: Band;
  emailSubmitted: boolean;
}) {
  // 6 variants: 3 bands × email submitted/no email
  const copy = (() => {
    if (band === "high" && emailSubmitted) {
      return {
        heading: (
          <>
            You&rsquo;re <SerifAccent>in.</SerifAccent>
          </>
        ),
        body: "We'll let you know when the next one's ready. If you know someone who'd love these too, please send them our way. That's how small brands like ours grow. We appreciate you a lot!",
        big: true,
      };
    }
    if (band === "high" && !emailSubmitted) {
      return {
        heading: (
          <>
            Thank you, your time{" "}
            <SerifAccent>meant a lot.</SerifAccent>
          </>
        ),
        body: "Hope to see you back for the next flavour. If you know someone who'd love these too, please send them our way. That's how small brands like ours grow. We appreciate you a lot!",
        big: false,
      };
    }
    if (band === "mid" && emailSubmitted) {
      return {
        heading: (
          <>
            Thanks for <SerifAccent>that.</SerifAccent>
          </>
        ),
        body: "We really appreciate you taking the time. We'll let you know when the next flavour drops. We'd love to know what you think of it compared to the one you tried today.",
        big: false,
      };
    }
    if (band === "mid" && !emailSubmitted) {
      return {
        heading: (
          <>
            Thanks for <SerifAccent>that.</SerifAccent>
          </>
        ),
        body: "We really appreciate you taking the time. We hope to see you back when the next flavour lands.",
        big: false,
      };
    }
    if (band === "low" && emailSubmitted) {
      return {
        heading: (
          <>
            Thank you. <SerifAccent>Genuinely.</SerifAccent>
          </>
        ),
        body: "We read every word. We really hope the next flavour lands better for you. We will let you know when it drops. Thank you again for your time.",
        big: false,
      };
    }
    // low + no email
    return {
      heading: (
        <>
          Thank you. <SerifAccent>Genuinely.</SerifAccent>
        </>
      ),
      body: "We read every word and your time meant a lot. We hope you'll give us another shot one day.",
      big: false,
    };
  })();

  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-6 fade-in">
      <h1
        className={
          copy.big
            ? "text-[56px] leading-[1.05] tracking-tight md:text-[80px]"
            : "text-[36px] leading-[1.1] tracking-tight md:text-[48px]"
        }
      >
        {copy.heading}
      </h1>

      <p className="text-[18px] leading-[1.45] text-crosps-charcoal-72">
        {copy.body}
      </p>

      <p className="text-[18px] leading-[1.4] text-crosps-charcoal-72">
        - Jade x
      </p>

      <div className="mt-2 flex gap-5 text-[14px] text-crosps-charcoal-72">
        <a
          href="https://www.instagram.com/eatcrosps/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Instagram
        </a>
        <a
          href="https://www.tiktok.com/@eatcrosps"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          TikTok
        </a>
      </div>
    </div>
  );
}

/* ── Star icon ───────────────────────────────────────────── */

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      className="transition-colors duration-150"
      aria-hidden="true"
    >
      <path
        d="M12 2.5l2.94 6.34 6.96.78-5.18 4.74 1.45 6.84L12 17.77l-6.17 3.43 1.45-6.84-5.18-4.74 6.96-.78L12 2.5z"
        fill={filled ? "var(--color-crosps-charcoal)" : "transparent"}
        stroke="var(--color-crosps-charcoal)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
