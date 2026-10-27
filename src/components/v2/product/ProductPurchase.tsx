"use client";

import { useState } from "react";
import { useCart } from "../cart/CartProvider";
import type { SellingPlan } from "@/lib/shopify";

const QUANTITIES = [1, 2, 3];
// UK shipping in Shopify: £3.95, free on orders of £40 and over.
const FREE_SHIPPING_FROM = 40;

// Quantity cards + Add to cart (moremud.co layout). "Subscribe and save" only appears
// when Shopify returns selling plans for the product.
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
    setMessage(await cart.add(variantId, qty, planId ?? undefined));
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="type-label mb-3 text-ink">Select quantity</legend>
        <div className="grid grid-cols-3 gap-2">
          {QUANTITIES.map((n) => {
            const freeDelivery = price.amount * n >= FREE_SHIPPING_FROM;
            return (
              <label
                key={n}
                className={`relative flex cursor-pointer flex-col items-center gap-1 border bg-white px-2 pb-3 pt-5 text-center transition-colors ${
                  qty === n ? "border-ink" : "border-ink-10 hover:border-ink-50"
                }`}
              >
                <input type="radio" name="qty" checked={qty === n} onChange={() => setQty(n)} className="sr-only" />
                {freeDelivery && (
                  <span className="type-label absolute -top-2.5 bg-ink px-2 py-0.5 text-[10px] text-white">Free delivery</span>
                )}
                <span className="type-body text-ink">
                  {n} {n === 1 ? "case" : "cases"}
                </span>
                <span className="type-small text-ink-50">{n * 8} bags</span>
                <span className="type-price text-[14px]">{fmt(price.amount * n)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {sellingPlans.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="type-label mb-3 text-ink">Select offer</legend>
          {[{ id: null, name: "One-time purchase", percentOff: null } as const, ...sellingPlans].map((p) => (
            <label
              key={p.id ?? "once"}
              className={`flex cursor-pointer items-center justify-between gap-3 border bg-white px-4 py-4 ${planId === p.id ? "border-ink" : "border-ink-10"}`}
            >
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

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={add}
          disabled={!available || busy}
          className="type-mono flex h-[52px] w-full cursor-pointer items-center justify-center rounded-button bg-ink px-6 text-white transition-colors hover:bg-ink-88 disabled:cursor-default disabled:opacity-50"
        >
          {!available ? "Sold out" : busy ? "Adding…" : `Add to cart · ${fmt(unit * qty)}`}
        </button>
        <p className="type-small text-center text-ink-72">UK delivery £3.95 · Free on orders over £{FREE_SHIPPING_FROM}</p>
        {message && (
          <p role="status" className="type-small text-center text-ink-72">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
