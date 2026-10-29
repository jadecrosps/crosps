"use client";

import { useActionState, useId } from "react";
import { useRouter } from "next/navigation";
import { unlockTrade, lockTrade, type UnlockState } from "./actions";

const FIELD = "type-body w-full border-b border-ink-10 bg-transparent pb-2 pt-1 text-ink placeholder:text-ink-50 outline-none transition-colors focus:border-ink";

// Password box for stockists; on success the page re-renders with trade details.
export function TradeLogin() {
  const router = useRouter();
  const id = useId();
  const [state, action, pending] = useActionState(async (prev: UnlockState, form: FormData) => {
    const next = await unlockTrade(prev, form);
    if (!next.error) router.refresh();
    return next;
  }, { error: null });

  return (
    <form action={action} className="flex w-full max-w-[420px] flex-col gap-4">
      <label htmlFor={id} className="type-label text-ink">
        Trade password
      </label>
      <div className="flex items-end gap-3">
        <input id={id} name="password" type="password" required autoComplete="current-password" placeholder="Enter password" className={FIELD} />
        <button
          type="submit"
          disabled={pending}
          className="type-mono shrink-0 cursor-pointer rounded-button bg-brown px-6 py-3 text-white transition-colors hover:bg-brown-88 disabled:opacity-50"
        >
          {pending ? "Checking…" : "Unlock"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="type-small text-tomato">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function TradeLogout() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await lockTrade();
        router.refresh();
      }}
      className="type-mono cursor-pointer text-ink-72 underline underline-offset-4 hover:text-ink"
    >
      Log out
    </button>
  );
}
