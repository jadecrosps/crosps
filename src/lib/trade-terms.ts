// Trade ordering rules, shared by the trade basket (browser) and the server actions.
export const TRADE = {
  minCases: 3,
  freeDeliveryFrom: 10, // cases
  palletFrom: 56, // a quarter pallet: 2 layers × 28 cases
  casesPerLayer: 28,
  smallOrderDelivery: 7.5, // £, under freeDeliveryFrom
  maxCasesPerLine: 1000,
};

export const TRADE_FLAVOURS = [
  { slug: "pepper", name: "Pepper Chips", handle: "trade-case-pepper-chips", image: "/v2/pack-pepper.png" },
  { slug: "onion", name: "Onion Chips", handle: "trade-case-onion-chips", image: "/v2/pack-onion.png" },
  { slug: "tomato", name: "Tomato Chips", handle: "trade-case-tomato-chips", image: "/v2/pack-tomato.png" },
] as const;

export type TradeSlug = (typeof TRADE_FLAVOURS)[number]["slug"];
export type TradeQuantities = Record<TradeSlug, number>;

export function totalCases(q: Partial<TradeQuantities>) {
  return TRADE_FLAVOURS.reduce((n, f) => n + (q[f.slug] ?? 0), 0);
}
