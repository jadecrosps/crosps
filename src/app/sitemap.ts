import type { MetadataRoute } from "next";
import { PRODUCTS, V2_LINKS } from "@/lib/v2-content";

const SITE = "https://eatcrosps.com";

// Public pages of the site, for search engines.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    V2_LINKS.home,
    ...PRODUCTS.map((p) => V2_LINKS.product(p.slug)),
    V2_LINKS.about,
    V2_LINKS.faq,
    V2_LINKS.contact,
    V2_LINKS.trade,
    ...["shipping-policy", "refund-policy", "terms-of-service", "privacy-policy"].map(V2_LINKS.policy),
  ];
  return paths.map((path) => ({ url: `${SITE}${path === "/" ? "" : path}` }));
}
