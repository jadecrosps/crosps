"use client";

import { useState } from "react";
import { QuantityStepper, useCart } from "../cart/CartProvider";
import type { SellingPlan } from "@/lib/shopify";

// Quantity + Add to cart. Shows "Subscribe and save" only when Shopify returns selling plans.
export function ProductPurchase({
  variantId,
  price,
  available,
  sellingPlans,
}: {
  variantId: string | null;
  price: { amount: number; currencyCode: string };
  available: boolean;
  sellingPlans: SellingPlan[];
}) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [planId, setPlanId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: price.currencyCode }).format(n);
  const plan = sellingPlans.find((p) => p.id === planId);
  const unit = plan?.percentOff ? price.amount * (1 - plan.percentOff / 100) : price.amount;

  async function add() {
    if (!variantId || !cart) {
      setMessage("Checkout isn’t connected yet. It will be once the Shopify store is linked.");
      return;
    }
    setBusy(true);
    setMessage(null);
    const ok = await cart.add(variantId, qty, planId ?? undefined);
    setBusy(false);
    if (!ok) setMessage(cart.error);
  }

  return (
    <div className="flex flex-col gap-4">
      {sellingPlans.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Purchase option</legend>
          {[{ id: null, name: "One-time purchase", percentOff: null } as const, ...sellingPlans].map((p) => (
            <label key={p.id ?? "once"} className={`flex cursor-pointer items-center justify-between gap-3 border px-4 py-4 ${planId === p.id ? "border-ink" : "border-ink-10"}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="plan" checked={planId === p.id} onChange={() => setPlanId(p.id)} className="sr-only" />
                <span aria-hidden className={`size-2 rounded-full border border-ink ${planId === p.id ? "bg-ink" : ""}`} />
                <span className="type-body">{p.name}</span>
                {p.percentOff ? <span className="type-label bg-onion/40 px-1.5 py-0.5">{p.percentOff}% off</span> : null}
              </span>
              <span className="type-price">{fmt(p.percentOff ? price.amount * (1 - p.percentOff / 100) : price.amount)}</span>
            </label>
          ))}
        </fieldset>
      )}
      <div className="flex gap-3">
        <QuantityStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} />
        <button
          type="button"
          onClick={add}
          disabled={!available || busy}
          className="type-button flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-button bg-ink px-6 text-white transition-colors hover:bg-ink-88 disabled:cursor-default disabled:opacity-50"
        >
          {!available ? "Sold out" : busy ? "Adding…" : `Add to cart · ${fmt(unit * qty)}`}
        </button>
      </div>
      {message && (
        <p role="status" className="type-small text-ink-72">
          {message}
        </p>
      )}
    </div>
  );
}
