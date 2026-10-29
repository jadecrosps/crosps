"use client";

import { useActionState, useId } from "react";
import { useRouter } from "next/navigation";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { logoutTrade, requestTradeLink, type LinkState } from "./actions";

const FIELD = "type-body w-full border-b border-ink-10 bg-transparent pb-2 pt-1 text-ink placeholder:text-ink-50 outline-none transition-colors focus:border-ink";

// Email login for approved stockists (Shopify customers tagged "trade").
export function TradeLogin({ expired = false }: { expired?: boolean }) {
  const id = useId();
  const [state, action, pending] = useActionState<LinkState, FormData>(requestTradeLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="flex flex-col items-start gap-3 bg-cream p-8 md:p-12">
        <h2 className="type-heading">
          Check your <SerifAccent>inbox.</SerifAccent>
        </h2>
        <p className="type-body max-w-[560px] text-ink-88">
          We’ve sent a login link to {state.email}. It works for 15 minutes. Can’t see it? Check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 bg-cream p-8 md:flex-row md:items-end md:justify-between md:p-12">
      <div className="flex max-w-[480px] flex-col gap-2">
        <h2 className="type-heading">
          Stockist <SerifAccent>login.</SerifAccent>
        </h2>
        <p className="type-body text-ink-88">Enter the email we approved and we’ll send you a login link. No password needed.</p>
        {expired && <p className="type-small text-tomato">That login link has expired or isn’t valid any more. Enter your email for a new one.</p>}
      </div>
      <form action={action} className="flex w-full max-w-[460px] flex-col gap-4">
        <label htmlFor={id} className="type-label text-ink">
          Email
        </label>
        <div className="flex items-end gap-3">
          <input id={id} name="email" type="email" required autoComplete="email" placeholder="you@yourshop.co.uk" defaultValue={state.email} className={FIELD} />
          <button
            type="submit"
            disabled={pending}
            className="type-mono shrink-0 cursor-pointer rounded-button bg-brown px-6 py-3 text-white transition-colors hover:bg-brown-88 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send link"}
          </button>
        </div>
        {state.status === "not_approved" && (
          <p role="alert" className="type-small text-tomato">
            That email isn’t approved for trade yet. Apply below and we’ll be in touch.
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="type-small text-tomato">
            {state.message}
          </p>
        )}
        {state.status === "idle" && <p className="type-small text-ink-50">Not a stockist yet? Apply below.</p>}
      </form>
    </div>
  );
}

export function TradeLogout() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await logoutTrade();
        router.refresh();
      }}
      className="type-mono cursor-pointer text-ink-72 underline underline-offset-4 hover:text-ink"
    >
      Log out
    </button>
  );
}
