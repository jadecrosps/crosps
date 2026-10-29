"use client";

import { useState } from "react";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { TRADE, TRADE_FLAVOURS, totalCases, type TradeQuantities } from "@/lib/trade-terms";
import { requestPalletQuote, tradeCheckout } from "./actions";

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
const FIELD = "type-body w-full border-b border-ink-10 bg-transparent pb-2 pt-1 text-ink placeholder:text-ink-50 outline-none transition-colors focus:border-ink";
const EMPTY: TradeQuantities = { pepper: 0, onion: 0, tomato: 0 };

// Cases per flavour: type a number or use − / +; "+1 layer" adds a pallet layer (28).
function CaseInput({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const set = (n: number) => onChange(Math.min(Math.max(Math.floor(n) || 0, 0), TRADE.maxCasesPerLine));
  const btn = "flex size-12 cursor-pointer items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30";
  return (
    <div className="inline-flex h-[52px] items-center border border-ink-10">
      <button type="button" aria-label={`Fewer ${label}`} onClick={() => set(value - 1)} disabled={value <= 0} className={btn}>
        −
      </button>
      <input
        aria-label={`${label} cases`}
        inputMode="numeric"
        value={value}
        onChange={(e) => set(Number(e.target.value.replace(/\D/g, "")))}
        className="type-body w-12 bg-transparent text-center outline-none"
      />
      <button type="button" aria-label={`More ${label}`} onClick={() => set(value + 1)} className={btn}>
        +
      </button>
    </div>
  );
}

export function TradeBasket({ prices }: { prices: Partial<Record<(typeof TRADE_FLAVOURS)[number]["slug"], number>> }) {
  const [qty, setQty] = useState<TradeQuantities>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [palletSent, setPalletSent] = useState(false);

  const cases = totalCases(qty);
  const subtotal = TRADE_FLAVOURS.reduce((s, f) => s + qty[f.slug] * (prices[f.slug] ?? 0), 0);
  const pallet = cases >= TRADE.palletFrom;
  const delivery = pallet ? null : cases >= TRADE.freeDeliveryFrom ? 0 : TRADE.smallOrderDelivery;
  const toFree = Math.max(0, TRADE.freeDeliveryFrom - cases);
  const layers = Math.ceil(cases / TRADE.casesPerLayer);
  const missing = TRADE_FLAVOURS.some((f) => prices[f.slug] === undefined);

  async function checkout() {
    setBusy(true);
    setError(null);
    const r = await tradeCheckout(qty);
    if (r.ok && r.url) window.location.href = r.url;
    else {
      setError(r.ok ? "Something went wrong." : r.error);
      setBusy(false);
    }
  }

  async function quote(form: FormData) {
    setBusy(true);
    setError(null);
    const r = await requestPalletQuote(qty, Object.fromEntries(form) as Record<string, string>);
    setBusy(false);
    if (r.ok) setPalletSent(true);
    else setError(r.error);
  }

  if (palletSent) {
    return (
      <div className="flex flex-col items-start gap-3 bg-cream p-8 md:p-12">
        <h3 className="type-heading">
          Request <SerifAccent>sent.</SerifAccent>
        </h3>
        <p className="type-body max-w-[560px] text-ink-88">
          Thanks. We’ve got your order for {cases} cases and will email you a delivery price and a payment link within one working day. Nothing
          is charged until you pay.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="flex flex-col">
        {TRADE_FLAVOURS.map((f) => (
          <div key={f.slug} className="flex flex-wrap items-center gap-5 border-t border-ink-10 py-5 last:border-b">
            <div className="relative size-[96px] shrink-0 bg-paper">
              <Image src={f.image} alt="" fill sizes="96px" className="object-contain p-2" />
            </div>
            <div className="flex min-w-[160px] flex-1 flex-col gap-1">
              <p className="font-sans text-[20px] leading-[1.2]">{f.name}</p>
              <p className="type-label text-ink-72">Case of 8 × 30g · {prices[f.slug] !== undefined ? gbp(prices[f.slug]!) : "—"} per case</p>
            </div>
            <div className="flex items-center gap-3">
              <CaseInput label={f.name} value={qty[f.slug]} onChange={(n) => setQty({ ...qty, [f.slug]: n })} />
              <button
                type="button"
                onClick={() => setQty({ ...qty, [f.slug]: qty[f.slug] + TRADE.casesPerLayer })}
                className="type-mono cursor-pointer whitespace-nowrap text-ink-72 underline underline-offset-4 hover:text-ink"
              >
                +1 layer
              </button>
            </div>
            <p className="type-price hidden w-24 text-right sm:block">{gbp(qty[f.slug] * (prices[f.slug] ?? 0))}</p>
          </div>
        ))}
        <p className="type-small pt-4 text-ink-50">
          Mix any flavours. Minimum {TRADE.minCases} cases · £{TRADE.smallOrderDelivery.toFixed(2)} delivery under {TRADE.freeDeliveryFrom} cases · free{" "}
          {TRADE.freeDeliveryFrom}–{TRADE.palletFrom - 1} cases · pallets from {TRADE.palletFrom} cases. A layer is {TRADE.casesPerLayer} cases.
        </p>
      </div>

      <aside className="flex h-fit flex-col gap-5 bg-cream p-6 md:p-8">
        <p className="type-heading">
          Your <SerifAccent>order.</SerifAccent>
        </p>
        <dl className="flex flex-col gap-3">
          <div className="flex justify-between">
            <dt className="type-body">
              {cases} cases ({cases * 8} bags)
            </dt>
            <dd className="type-price">{gbp(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="type-body">Delivery</dt>
            <dd className="type-price">{delivery === null ? "By pallet" : cases === 0 ? "—" : delivery ? gbp(delivery) : "Free"}</dd>
          </div>
          <div className="flex justify-between border-t border-ink-10 pt-3">
            <dt className="type-body">{pallet ? "Cases total" : "Total"}</dt>
            <dd className="type-price">{gbp(subtotal + (cases && delivery ? delivery : 0))}</dd>
          </div>
        </dl>

        {cases > 0 && cases < TRADE.minCases && (
          <p className="type-small text-tomato">
            Minimum order is {TRADE.minCases} cases. Add {TRADE.minCases - cases} more.
          </p>
        )}
        {cases >= TRADE.minCases && toFree > 0 && (
          <p className="type-small text-ink-72">
            Add {toFree} more {toFree === 1 ? "case" : "cases"} for free delivery.
          </p>
        )}
        {cases >= TRADE.freeDeliveryFrom && !pallet && <p className="type-small text-ink-72">Free delivery by parcel.</p>}

        {pallet ? (
          <form action={quote} className="flex flex-col gap-4">
            <p className="type-small text-ink-72">
              That’s a pallet order ({layers} {layers === 1 ? "layer" : "layers"}). Tell us where it’s going and we’ll email you a delivery price
              and a booked delivery time before you pay.
            </p>
            <input name="address1" required placeholder="Delivery address" autoComplete="address-line1" className={FIELD} />
            <input name="address2" placeholder="Address line 2 (optional)" autoComplete="address-line2" className={FIELD} />
            <div className="grid grid-cols-2 gap-4">
              <input name="city" required placeholder="Town or city" autoComplete="address-level2" className={FIELD} />
              <input name="postcode" required placeholder="Postcode" autoComplete="postal-code" className={FIELD} />
            </div>
            <input name="phone" placeholder="Phone for the driver (optional)" autoComplete="tel" className={FIELD} />
            <textarea name="notes" rows={2} placeholder="Delivery notes, e.g. tail-lift, opening hours (optional)" className={`${FIELD} resize-y`} />
            <button
              type="submit"
              disabled={busy || missing}
              className="type-mono w-full cursor-pointer rounded-button bg-brown px-10 py-4 text-white transition-colors hover:bg-brown-88 disabled:cursor-default disabled:opacity-40"
            >
              {busy ? "Sending…" : "Request pallet quote"}
            </button>
            <p className="type-small text-ink-50">No payment yet. We’ll reply within one working day.</p>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={checkout}
              disabled={busy || missing || cases < TRADE.minCases}
              className="type-mono w-full cursor-pointer rounded-button bg-brown px-10 py-4 text-white transition-colors hover:bg-brown-88 disabled:cursor-default disabled:opacity-40"
            >
              {busy ? "Opening checkout…" : "Checkout"}
            </button>
            <p className="type-small text-ink-50">Pay by card on Shopify’s secure checkout. Shops on 30-day terms: email us.</p>
          </>
        )}
        {error && (
          <p role="alert" className="type-small text-tomato">
            {error}
          </p>
        )}
        {missing && <p className="type-small text-tomato">Trade products aren’t available right now. Please email jade@eatcrosps.com.</p>}
      </aside>
    </div>
  );
}
