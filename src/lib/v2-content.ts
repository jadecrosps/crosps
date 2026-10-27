import type { Crop } from "@/components/v2/CroppedImage";
import type { FaqGroup } from "@/components/v2/FaqDirectory";

// Shared V2 content, used by the design system and the V2 pages.

export type Product = {
  slug: "onion" | "tomato" | "pepper";
  name: string;
  descriptor: string;
  price: string;
  image: string;
  hoverImage: string;
  hoverCrop: Crop;
  tag: string;
  status: string;
};

export const PRODUCTS: Product[] = [
  { slug: "onion", name: "Onion Chips", descriptor: "Sweet, savoury, delicate.", price: "21.99 GBP", image: "/v2/pack-onion.png", hoverImage: "/v2/hover-onion.jpg", hoverCrop: { width: 164.2, height: 218.2, left: -32.1, top: -46.4 }, tag: "8×30g bags", status: "Pre order" },
  { slug: "pepper", name: "Pepper Chips", descriptor: "Bright, crisp, naturally sweet.", price: "21.99 GBP", image: "/v2/pack-pepper.png", hoverImage: "/v2/hover-pepper.jpg", hoverCrop: { width: 128.87, height: 171.24, left: -14.43, top: -54.8 }, tag: "8×30g bags", status: "Pre order" },
  { slug: "tomato", name: "Tomato Chips", descriptor: "Rich, tangy, umami.", price: "21.99 GBP", image: "/v2/pack-tomato.png", hoverImage: "/v2/hover-tomato.jpg", hoverCrop: { width: 174.44, height: 231.81, left: -21.46, top: -92.47 }, tag: "8×30g bags", status: "Pre order" },
];

export const TICKER = ["Only 4 Ingredients", "Gluten Free", "Plant Based", "High Fibre", "Real Vegetables", "No Added Sugar"];

// Current eatcrosps.com/faq answers, grouped, plus allergens.
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "ingredients",
    title: "Ingredients & Nutrition",
    items: [
      {
        question: "What are Crosps made of?",
        answer:
          "Crosps are vegetable crisps made from just four ingredients: the vegetable itself, oil, tapioca starch and a touch of sea salt. Just simple, recognisable ingredients.",
      },
      {
        question: "Are your products vegan?",
        answer:
          "All Crosps flavours are 100% plant-based. They are packed in a facility which also handles cereals containing gluten, milk, sesame and egg.",
      },
      {
        question: "Do Crosps contain any allergens?",
        answer:
          "No. Crosps contain no allergens. They are packed in a facility which also handles cereals containing gluten, milk, sesame and egg.",
      },
      {
        question: "Can kids eat Crosps?",
        answer:
          "Crosps are made from simple, real ingredients and are a source of fibre. They’re a snack the whole family can enjoy. As with any snack, we recommend them as part of a balanced diet.",
      },
    ],
  },
  {
    id: "product",
    title: "The Product",
    items: [
      {
        question: "How are they so crunchy?",
        answer:
          "We use a gentle baking process that crisps the vegetables without excess oil. Lower heat helps preserve nutrients and flavour while still giving you that satisfying crunch you expect from a great crisp.",
      },
      {
        question: "What makes Crosps different from normal crisps?",
        answer:
          "Crosps start with real vegetables as the main ingredient, not potato or corn. We use up to 50% less oil, keep the good stuff (fibre, nutrients), and let the natural flavour of the veg lead. No artificial flavours or unnecessary additives.",
      },
    ],
  },
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        question: "Can I order a single pack?",
        answer:
          "We’re only launching with our pack of 8 for now. You can find single packs at our stockists, or sign up to our mailing list to hear where they’re available next.",
      },
    ],
  },
  {
    id: "stockists",
    title: "Stockists",
    items: [
      {
        question: "Where can I buy Crosps?",
        answer:
          "We’re launching soon. Join our mailing list or follow us on social for stockist updates and where to find Crosps near you.",
      },
    ],
  },
];

export const STOCKISTS = [
  { src: "/v2/stockist-farmerj.png", alt: "Farmer J", w: 134, h: 76 },
  { src: "/v2/stockist-superette.png", alt: "Superette", w: 167, h: 50 },
  { src: "/v2/stockist-fenwick.png", alt: "Fenwick", w: 150, h: 76 },
  { src: "/v2/stockist-wholefoods.png", alt: "Whole Foods Market", w: 76, h: 76 },
];

// Tapioca copy is a draft, to be confirmed.
export const INGREDIENT_INFO = {
  oil: "We use non-hydrogenated rapeseed oil, which is naturally low in saturated fat and has a clean, neutral taste, so the vegetable stays the main flavour.",
  tapioca: "A light starch from the cassava root. It helps each slice crisp evenly, and it’s naturally gluten free.",
};

export const REVIEWS = [
  {
    quote: "The tomato chips were delicious! Would pair extremely well with a crisp white wine in the summer!",
    author: "Anne-Marie, London",
  },
  { quote: "Very hard to pick one but tomatoes 🍅 are my winner. LOVE LOVE LOVE them!", author: "Orla, Dublin" },
];

// Where V2 pages link to. Points at the current site until each V2 page exists.
export const V2_LINKS = {
  home: "/v2",
  shop: "/v2#shop",
  about: "/v2/about",
  faq: "/v2/faq",
  contact: "/v2/contact",
  product: (slug: string) => `/v2/products/${slug}`,
  policy: (handle: string) => `/v2/policies/${handle}`,
};

// Side margin for V2 pages. Default 100px; ?gutter=40|60|80|100|120 to compare.
export function gutterStyle(gutter?: string): React.CSSProperties {
  const px = [40, 60, 80, 100, 120].includes(Number(gutter)) ? Number(gutter) : 100;
  return { "--gutter": `${px}px` } as React.CSSProperties;
}

// Product page content. Prices and checkout come from Shopify when it's
// connected; these are the fallbacks and the copy.
export type Stat = { value: string; unit?: string; label: string };
export type NutritionRow = { label: string; per100: string; perServing: string; sub?: boolean };

export type ProductDetails = {
  shopifyHandle: string;
  benefits: string[];
  stats: Stat[];
  ingredients: string;
  nutrition: NutritionRow[];
  vegetable: { label: string; image: string; crop?: Crop; colour: string };
  paragraphs: string[];
  gallery: { src: string; alt: string; contain?: boolean }[];
};

export const PRODUCT_DETAILS: Record<Product["slug"], ProductDetails> = {
  tomato: {
    shopifyHandle: "tomato-chips",
    benefits: [
      "Bright and tangy, naturally sweet and rich in umami.",
      "Made from 88% real tomato. Just four ingredients.",
      "Perfect as they are, or crumbled over salads and soups.",
    ],
    stats: [
      { value: "88", unit: "%", label: "Tomato" },
      { value: "4", label: "Ingredients" },
      { value: "14", unit: "g", label: "Fibre /100g" },
      { value: "89", unit: "kcal", label: "Per serving" },
      { value: "ZERO", label: "Added sugar" },
    ],
    ingredients: "Tomato (88%), Rapeseed Oil, Tapioca Starch, Sea Salt.",
    nutrition: [
      { label: "Energy", per100: "2449kJ / 592kcal", perServing: "367kJ / 89kcal" },
      { label: "Fat", per100: "48g", perServing: "7.2g" },
      { label: "of which saturates", per100: "3.5g", perServing: "0.5g", sub: true },
      { label: "Carbohydrate", per100: "27g", perServing: "4.1g" },
      { label: "of which sugars", per100: "18g", perServing: "2.7g", sub: true },
      { label: "Fibre", per100: "14g", perServing: "2.1g" },
      { label: "Protein", per100: "6.0g", perServing: "0.9g" },
      { label: "Salt", per100: "0.14g", perServing: "0.02g" },
    ],
    vegetable: { label: "Tomato", image: "/v2/ing-tomato.jpg", colour: "var(--color-tomato)" },
    paragraphs: [
      "Tomatoes do more than add flavour. Naturally rich in lycopene, vitamin C and potassium, they’re a nutrient-dense vegetable (or fruit!) that brings colour and crunch to every bite.",
      "Gently crisped to preserve their goodness, these vibrant slices pack all the character of a tangy, delicious tomato, with a crispy twist.",
    ],
    gallery: [
      { src: "/v2/pack-tomato.png", alt: "Tomato Chips pack", contain: true },
      { src: "/v2/hover-tomato.jpg", alt: "Tomato Chips on the go" },
      { src: "/v2/ing-tomato.jpg", alt: "Fresh tomato" },
      { src: "/v2/crisps-mix.jpg", alt: "Crosps vegetable crisps" },
    ],
  },
  onion: {
    shopifyHandle: "onion-chips",
    benefits: [
      "A mellow sweetness with a savoury finish.",
      "Made from 90% real white and purple onion. Just four ingredients.",
      "Perfect as they are, or crumbled over salads and soups.",
    ],
    stats: [
      { value: "90", unit: "%", label: "Onion" },
      { value: "4", label: "Ingredients" },
      { value: "27", unit: "g", label: "Fibre /100g" },
      { value: "69", unit: "kcal", label: "Per serving" },
      { value: "ZERO", label: "Added sugar" },
    ],
    ingredients: "Onion (90%) (White 65%, Purple 35%), Rapeseed Oil, Tapioca Starch, Sea Salt.",
    nutrition: [
      { label: "Energy", per100: "1898kJ / 458kcal", perServing: "285kJ / 69kcal" },
      { label: "Fat", per100: "28g", perServing: "4.2g" },
      { label: "of which saturates", per100: "2.0g", perServing: "0.3g", sub: true },
      { label: "Carbohydrate", per100: "33g", perServing: "5.0g" },
      { label: "of which sugars", per100: "33g", perServing: "5.0g", sub: true },
      { label: "Fibre", per100: "27g", perServing: "4.1g" },
      { label: "Protein", per100: "5.0g", perServing: "0.8g" },
      { label: "Salt", per100: "0.4g", perServing: "0.06g" },
    ],
    vegetable: { label: "Onion", image: "/v2/ing-onion-red.jpg", colour: "var(--color-onion)" },
    paragraphs: [
      "Our most controversial flavour. Onions transformed into a delicately crisp, golden bite.",
      "Complex and savoury: you either love it or hate it.",
    ],
    gallery: [
      { src: "/v2/pack-onion.png", alt: "Onion Chips pack", contain: true },
      { src: "/v2/hover-onion.jpg", alt: "Onion Chips on the go" },
      { src: "/v2/ing-onion-red.jpg", alt: "Red onion, sliced" },
      { src: "/v2/lifestyle-pack.jpg", alt: "Carrying Crosps" },
      { src: "/v2/crisps-mix.jpg", alt: "Crosps vegetable crisps" },
    ],
  },
  pepper: {
    shopifyHandle: "pepper-chips",
    benefits: [
      "Gently sweet and full of flavour.",
      "Made from 88% real green, red and yellow bell pepper. Just four ingredients.",
      "Perfect as they are, or crumbled over salads and soups.",
    ],
    stats: [
      { value: "88", unit: "%", label: "Bell pepper" },
      { value: "4", label: "Ingredients" },
      { value: "16", unit: "g", label: "Fibre /100g" },
      { value: "80", unit: "kcal", label: "Per serving" },
      { value: "ZERO", label: "Added sugar" },
    ],
    ingredients: "Bell Pepper (88%) (Green 50%, Red 30%, Yellow 20%), Rapeseed Oil, Tapioca Starch, Sea Salt.",
    nutrition: [
      { label: "Energy", per100: "2211kJ / 533kcal", perServing: "332kJ / 80kcal" },
      { label: "Fat", per100: "37g", perServing: "5.6g" },
      { label: "of which saturates", per100: "3.0g", perServing: "0.5g", sub: true },
      { label: "Carbohydrate", per100: "35g", perServing: "5.3g" },
      { label: "of which sugars", per100: "24g", perServing: "3.6g", sub: true },
      { label: "Fibre", per100: "16g", perServing: "2.4g" },
      { label: "Protein", per100: "7.0g", perServing: "1.1g" },
      { label: "Salt", per100: "0.57g", perServing: "0.09g" },
    ],
    vegetable: {
      label: "Pepper",
      image: "/v2/ing-pepper.jpg",
      crop: { width: 128.33, height: 136.89, left: 0.01, top: -18.45 },
      colour: "var(--color-pepper)",
    },
    paragraphs: [
      "One of the most popular vegetables in the world, now reimagined as a light crunch with bold colour.",
      "A classic with a refined twist.",
    ],
    gallery: [
      { src: "/v2/pack-pepper.png", alt: "Pepper Chips pack", contain: true },
      { src: "/v2/story.jpg", alt: "A pepper crisp next to a fresh slice of pepper" },
      { src: "/v2/ing-pepper.jpg", alt: "Fresh green pepper" },
      { src: "/v2/lifestyle-pack.jpg", alt: "Carrying Crosps" },
      { src: "/v2/crisps-mix.jpg", alt: "Crosps vegetable crisps" },
    ],
  },
};

// Benefits, stats, ingredients and nutrition come from the approved packaging
// proofs (UFP 5234 V2, 18-09-2026). A serving is 15g; each bag is 2 servings.

export const ALLERGEN_NOTE =
  "Crosps contain no allergens. They are packed in a facility which also handles cereals containing gluten, milk, sesame and egg.";

// Footer link targets shared by every V2 page.
export const V2_FOOTER_LINKS = {
  FAQ: V2_LINKS.faq,
  Stockists: `${V2_LINKS.contact}?topic=stock`,
  "Shipping & Returns": V2_LINKS.policy("refund-policy"),
  "Terms of Service": V2_LINKS.policy("terms-of-service"),
  "Privacy Policy": V2_LINKS.policy("privacy-policy"),
  Contact: V2_LINKS.contact,
};
