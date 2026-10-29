"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addToCart, getCart, updateCartLine, type CartResult } from "@/app/v2/cart-actions";
import type { Cart } from "@/lib/shopify";
import { Button } from "../Button";

type CartContextValue = {
  cart: Cart | null;
  count: number;
  open: () => void;
  // Resolves to null on success, or a message to show.
  add: (variantId: string, quantity: number, sellingPlanId?: string) => Promise<string | null>;
  pending: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

// Null outside a CartProvider (e.g. the design system), so the nav can fall back to a plain link.
export function useCart() {
  return useContext(CartContext);
}

const ERRORS = {
  not_configured: "Checkout isn’t connected yet. It will be once the Shopify store is linked.",
  failed: "Something went wrong. Please try again.",
  sold_out: "Sorry, this is sold out right now.",
};

// Cart with one line's quantity changed, priced from its current unit price, so the
// drawer can update before Shopify answers. Shopify's reply replaces it.
function withQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  const lines = cart.lines.flatMap((l) => {
    if (l.id !== lineId) return [l];
    if (quantity <= 0) return [];
    const unit = Number(l.total.amount) / l.quantity;
    return [{ ...l, quantity, total: { ...l.total, amount: String(unit * quantity) } }];
  });
  return {
    ...cart,
    lines,
    totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: { ...cart.subtotal, amount: String(lines.reduce((n, l) => n + Number(l.total.amount), 0)) },
  };
}

function money(m: { amount: string; currencyCode: string }) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: m.currencyCode }).format(Number(m.amount));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  // Quantity clicks are sent once the shopper pauses, one per line, and only the
  // newest reply is applied, so fast clicking can't leave an older quantity showing.
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const latest = useRef(0);

  const apply = useCallback((r: CartResult) => {
    if (r.ok) {
      setCart(r.cart);
      setError(null);
      return true;
    }
    setError(ERRORS[r.error]);
    return false;
  }, []);

  useEffect(() => {
    getCart().then((r) => r.ok && setCart(r.cart));
  }, []);

  // Esc closes; lock page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const add = useCallback(
    async (variantId: string, quantity: number, sellingPlanId?: string) => {
      // Open straight away; the new line appears when Shopify answers.
      setOpen(true);
      setPending(true);
      const r = await addToCart(variantId, quantity, sellingPlanId);
      setPending(false);
      if (!apply(r)) setOpen(false);
      return r.ok ? null : ERRORS[r.error];
    },
    [apply],
  );

  const update = (lineId: string, quantity: number) => {
    if (!cart) return;
    const id = cart.id;
    setCart((c) => c && withQuantity(c, lineId, quantity));
    clearTimeout(timers.current.get(lineId));
    timers.current.set(
      lineId,
      setTimeout(async () => {
        const n = ++latest.current;
        const r = await updateCartLine(id, lineId, quantity);
        if (n !== latest.current) return;
        // On failure, show what Shopify actually has.
        if (!apply(r)) getCart().then((g) => g.ok && n === latest.current && setCart(g.cart));
      }, 350),
    );
  };

  const count = cart?.totalQuantity ?? 0;

  return (
    <CartContext.Provider value={{ cart, count, open: () => setOpen(true), add, pending, error }}>
      {children}
      <div
        aria-hidden={!isOpen}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white text-ink shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-10 px-6 py-5">
          <p className="type-nav">Your cart ({count})</p>
          <button type="button" onClick={() => setOpen(false)} className="type-nav cursor-pointer hover:opacity-70">
            Close
          </button>
        </div>

        {!cart || cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start gap-4 px-6 py-10">
            <p className="type-heading">{pending ? "Adding to your cart…" : "Your cart is empty."}</p>
            {error && <p className="type-small text-ink-72">{error}</p>}
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {pending && (
                <li aria-live="polite" className="type-small border-b border-ink-10 py-4 text-ink-50">
                  Adding to your cart…
                </li>
              )}
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4 border-b border-ink-10 py-5">
                  <div className="relative size-[88px] shrink-0 bg-paper">
                    {line.image && <Image src={line.image} alt="" fill sizes="88px" className="object-contain p-2" />}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link href={`/v2/products/${line.handle.replace(/-chips$/, "")}`} className="font-sans text-[16px] leading-[1.2]">
                          {line.title}
                        </Link>
                        <p className="type-small text-ink-50">{line.plan ?? "8×30g bags"}</p>
                      </div>
                      <p className="type-price">{money(line.total)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper value={line.quantity} onChange={(q) => update(line.id, q)} small />
                      <button type="button" onClick={() => update(line.id, 0)} className="type-small cursor-pointer text-ink-50 underline underline-offset-4 hover:text-ink">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 border-t border-ink-10 px-6 py-6">
              <div className="flex justify-between">
                <p className="type-body">Subtotal</p>
                <p className="type-price">{money(cart.subtotal)}</p>
              </div>
              <p className="type-small text-ink-50">Shipping calculated at checkout.</p>
              {error && <p className="type-small text-tomato">{error}</p>}
              <Button href={cart.checkoutUrl} className="w-full">
                Checkout
              </Button>
            </div>
          </>
        )}
      </aside>
    </CartContext.Provider>
  );
}

export function QuantityStepper({ value, onChange, small = false }: { value: number; onChange: (q: number) => void; small?: boolean }) {
  const btn = `flex cursor-pointer items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30 ${
    small ? "size-8" : "size-12"
  }`;
  return (
    <div className={`inline-flex items-center border border-ink-10 ${small ? "h-8" : "h-[52px]"}`}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} disabled={value <= 1} className={btn}>
        −
      </button>
      <span aria-live="polite" className={`type-body text-center ${small ? "w-6" : "w-8"}`}>
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} className={btn}>
        +
      </button>
    </div>
  );
}
