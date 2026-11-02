import { CartProvider } from "@/components/v2/cart/CartProvider";
import { CookieBanner } from "@/components/v2/CookieBanner";
import { SignupPopup } from "@/components/v2/SignupPopup";

// Every V2 page shares one cart (Shopify), opened from the nav.
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CookieBanner />
      <SignupPopup />
    </CartProvider>
  );
}
