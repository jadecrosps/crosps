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
          "All Crosps flavours are 100% plant-based. They are packed in a facility which also handles cereals containing gluten, peanuts, other nuts, sesame, egg and milk.",
      },
      {
        question: "Do Crosps contain any allergens?",
        answer:
          "No. Crosps contain no allergens. They are packed in a facility which also handles cereals containing gluten, peanuts, other nuts, sesame, egg and milk.",
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
  about: "/about",
  faq: "/v2/faq",
  contact: "/contact",
  product: (slug: string) => `/v2#shop-${slug}`,
};

// Side margin for V2 pages. Default 80px; ?gutter=40|60|80|100|120 to compare.
export function gutterStyle(gutter?: string): React.CSSProperties {
  const px = [40, 60, 80, 100, 120].includes(Number(gutter)) ? Number(gutter) : 80;
  return { "--gutter": `${px}px` } as React.CSSProperties;
}
