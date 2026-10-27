"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../cart/CartProvider";

// "Add to cart" + "Learn more" under a product card.
export function QuickAdd({ href, variantId, available = true }: { href: string; variantId: string | null; available?: boolean }) {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function add() {
    if (!variantId || !cart) {
      setMessage("Checkout isn’t connected yet.");
      return;
    }
    setBusy(true);
    setMessage(await cart.add(variantId, 1));
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={add}
          disabled={!available || busy}
          className="type-label flex h-10 cursor-pointer items-center justify-center rounded-button bg-brown text-white transition-colors hover:bg-brown-88 disabled:cursor-default disabled:opacity-50"
        >
          {!available ? "Sold out" : busy ? "Adding…" : "Add to cart"}
        </button>
        <Link
          href={href}
          className="type-label flex h-10 items-center justify-center rounded-button border border-brown text-ink transition-colors hover:bg-brown hover:text-white"
        >
          Learn more
        </Link>
      </div>
      {message && (
        <p role="status" className="type-small text-ink-72">
          {message}
        </p>
      )}
    </div>
  );
}
