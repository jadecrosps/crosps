import type { Product, Feature, Ingredient, NavLink } from "@/types";

// ── Hero image ──────────────────────────────────────────────────────
// Change this URL to swap the hero background. Use any absolute URL or
// a path relative to /public (e.g. "/hero.jpg").
export const HERO_IMAGE = "/hero.png";

export const NAV_LINKS: NavLink[] = [
  { label: "Shop", href: "#products" },
  { label: "What", href: "#story" },
];

export const BADGES = [
  "Only 4 Ingredients",
  "No Additives",
  "Plant Based",
  "Soy Free",
  "Nut Free",
  "Gluten Free",
  "100% Real Vegetables",
  "High Fibre",
];

export const PRODUCTS: Product[] = [
  {
    name: "Onion",
    tagline: "Bold. Sweet. Unexpected",
    description:
      "Our most controversial flavour. Onions transformed into a delicately crisp, golden bite. Complex, savoury, you either love it or hate it",
    imageSrc: "/products/onion.png",
  },
  {
    name: "Tomato",
    tagline: "Bright. Tangy. Familiar",
    description:
      "A beloved favourite, gently crisped to capture it\u2019s juicy, vibrant flavour. Comforting yet elevated. One of our most popular SKUs.",
    imageSrc: "/products/tomato.png",
  },
  {
    name: "Pepper",
    tagline: "Sweet. Savoury. Underrated.",
    description:
      "One of the most popular vegetables in the world. Now re-imagined into a light crunch and bold colour. A classic with a refined twist.",
    imageSrc: "/products/pepper.png",
  },
];

export const FEATURES: Feature[] = [
  {
    title: "Better crunch, ",
    titleAccent: "less oil",
    description:
      "Refined by technique, not excess. Up to 50% less oil. All the flavour. None of the compromise.",
  },
  {
    title: "Nutrients, ",
    titleAccent: "preserved",
    description:
      "Lower heat keeps the good stuff. Antioxidants, vitamins, and colour. All intact, just crisped.",
  },
  {
    title: "Big flavour, ",
    titleAccent: "naturally",
    description:
      "Draws out and intensifies the veg\u2019s natural flavour. So what you taste is real tomato, real onion, real sweet potato.",
  },
  {
    title: "Ingredients you ",
    titleAccent: "recognise",
    description:
      "Just vegetables, oil, sea salt, and a touch of tapioca starch. No additives. No fillers. Nothing you can\u2019t pronounce.",
  },
];

export const INGREDIENT_TABS = ["Tomato", "Onion", "Peppers"] as const;

export const INGREDIENTS_BY_TAB: Record<string, Ingredient[]> = {
  Tomato: [
    { name: "Tomato", iconSrc: "/ingredients/tomato.png", description: "Refined by technique, not excess." },
    { name: "Sea Salt", iconSrc: "/ingredients/salt.png", description: "Refined by technique, not excess." },
    { name: "Olive Oil", iconSrc: "/ingredients/oil.png", description: "Refined by technique, not excess." },
    { name: "Tapioca Starch", iconSrc: "/ingredients/tapioca.png", description: "Refined by technique, not excess." },
  ],
  Onion: [
    { name: "Onion", iconSrc: "/products/onion.png", description: "Refined by technique, not excess." },
    { name: "Sea Salt", iconSrc: "/ingredients/salt.png", description: "Refined by technique, not excess." },
    { name: "Olive Oil", iconSrc: "/ingredients/oil.png", description: "Refined by technique, not excess." },
    { name: "Tapioca Starch", iconSrc: "/ingredients/tapioca.png", description: "Refined by technique, not excess." },
  ],
  Peppers: [
    { name: "Peppers", iconSrc: "/products/pepper.png", description: "Refined by technique, not excess." },
    { name: "Sea Salt", iconSrc: "/ingredients/salt.png", description: "Refined by technique, not excess." },
    { name: "Olive Oil", iconSrc: "/ingredients/oil.png", description: "Refined by technique, not excess." },
    { name: "Tapioca Starch", iconSrc: "/ingredients/tapioca.png", description: "Refined by technique, not excess." },
  ],
};

// ── About page ──────────────────────────────────────────────────────
export const ABOUT_TICKER_MESSAGE =
  "Welcome to the world of Crosps. Learn about how we're changing the future of healthy eating.";

export const ABOUT_VALUES = [
  "Start with real vegetables.",
  "Treat them gently.",
  "Let flavour do the talking.",
  "Make better choices feel easy.",
];

