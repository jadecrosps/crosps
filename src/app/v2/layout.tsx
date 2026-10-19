import { CartProvider } from "@/components/v2/cart/CartProvider";

// Every V2 page shares one cart (Shopify), opened from the nav.
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
