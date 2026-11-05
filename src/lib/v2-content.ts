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
  hoverCrop?: Crop;
  tag: string;
  status: string;
};

// Shop switch. While false, every product shows "Coming soon", prices are hidden and nothing
// can be added to the cart. Trade ordering on /v2/trade is separate and stays open.
export const SHOP_OPEN = false;
const STATUS = SHOP_OPEN ? "Pre order" : "Coming soon";

export const PRODUCTS: Product[] = [
  { slug: "pepper", name: "Pepper Chips", descriptor: "Bright, crisp, naturally sweet.", price: "21.99 GBP", image: "/v2/pack-pepper.png", hoverImage: "/v2/crosps-pepper-chips-on-the-go.jpg", tag: "8×30g bags", status: STATUS },
  { slug: "onion", name: "Onion Chips", descriptor: "Sweet, savoury, delicate.", price: "21.99 GBP", image: "/v2/pack-onion.png", hoverImage: "/v2/hover-onion.jpg", hoverCrop: { width: 164.2, height: 218.2, left: -32.1, top: -46.4 }, tag: "8×30g bags", status: STATUS },
  { slug: "tomato", name: "Tomato Chips", descriptor: "Rich, tangy, umami.", price: "21.99 GBP", image: "/v2/pack-tomato.png", hoverImage: "/v2/hover-tomato.jpg", hoverCrop: { width: 174.44, height: 231.81, left: -21.46, top: -92.47 }, tag: "8×30g bags", status: STATUS },
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
        question: "Are they vegan?",
        answer:
          "All Crosps flavours are 100% plant-based. They are packed in a facility which also handles cereals containing gluten, milk, sesame and egg.",
      },
      {
        question: "Are your products gluten-free?",
        answer:
          "Yes. All Crosps flavours are naturally gluten-free. They are packed in a facility which also handles cereals containing gluten, milk, sesame and egg.",
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
        question: "What makes Crosps different from normal crisps?",
        answer:
          "Most crisps begin with potato or corn. Ours begin with the vegetable itself: real tomato, onion and bell pepper, gently crisped so that their natural colour and character lead every bite. Just four considered ingredients, high in fibre, with no artificial flavours.",
      },
      {
        question: "Why do the colour and shape vary from bag to bag?",
        answer:
          "Because they’re made from real vegetables, and no two vegetables are the same. The size, shape and colour of each slice comes from the vegetable itself, so every bag looks a little different.",
      },
      {
        question: "What flavours are there, and what do they go well with?",
        answer:
          "There are three: Tomato (rich, tangy, umami), Onion (sweet, savoury, delicate) and Pepper (bright, crisp, naturally sweet). The list of ways to enjoy them is endless: straight out of the bag, on avo toast, crumbled over salads or sprinkled on soups. They’re also lovely with hummus or a nice glass of wine.",
      },
      {
        question: "Is the packaging recyclable?",
        answer: "Yes. Our bags can be recycled at store drop-off points that collect soft plastics. Please don’t put them in your recycling at home.",
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
      {
        question: "Do you do bundles, subscriptions or gift boxes?",
        answer:
          "Not yet. For now we only sell cases of 8 bags in a single flavour, with no mixed packs. Sign up to our mailing list to hear when this changes.",
      },
      {
        question: "Can I order for an event or office, or stock them in my shop or café?",
        answer:
          "Yes. To stock Crosps in your shop or café, apply for a trade account on our Trade page. For an event or office order, or if you’d rather talk to us first, send us a message in the contact section.",
      },
      {
        question: "My order arrived damaged. What should I do?",
        answer:
          "We’re sorry about that. Email jade@eatcrosps.com with your order number and a photo if you can, and we’ll put it right.",
      },
    ],
  },
  {
    id: "stockists",
    title: "Buying & Delivery",
    items: [
      {
        question: "Where can I buy them, and where do you deliver?",
        answer:
          "You can pre-order on our website, and we deliver to UK addresses only for now. Pre-orders ship as soon as our first batch is ready, and we’ll email you when yours is on its way.",
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

// rating: stars to show (omit when the reviewer didn't give one).
// title/body: the reviewer's first sentence and the rest, in their own words.
export const REVIEWS: { quote: string; title: string; body: string; author: string; rating?: number }[] = [
  {
    quote: "The tomato chips were delicious! Would pair extremely well with a crisp white wine in the summer!",
    title: "The tomato chips were delicious!",
    body: "Would pair extremely well with a crisp white wine in the summer!",
    author: "Emma, London",
    rating: 5,
  },
  {
    quote: "Love the tomato flavour crosps! Delicious alternative to crisps. I’m hooked!",
    title: "Love the tomato flavour crosps!",
    body: "Delicious alternative to crisps. I’m hooked!",
    author: "Anne-Marie, London",
  },
  {
    quote: "Very hard to pick one but tomatoes 🍅 are my winner. LOVE LOVE LOVE them!",
    title: "Very hard to pick one but tomatoes 🍅 are my winner.",
    body: "LOVE LOVE LOVE them!",
    author: "Orla, Dublin",
    rating: 5,
  },
  {
    quote:
      "Absolutely beautiful snack. I love the fact they’re sweet and savoury so you hit both of your cravings. They don’t last long in my house as it’s loved by my kids and us adults.",
    title: "Absolutely beautiful snack.",
    body: "I love the fact they’re sweet and savoury so you hit both of your cravings. They don’t last long in my house as it’s loved by my kids and us adults.",
    author: "Charlotte, Dublin",
    rating: 5,
  },
  {
    quote:
      "I tried the tomato and the onion flavours. They’re both delightful. I preferred the tomato flavour, although I can sense that the onion one will be great with dips.",
    title: "I tried the tomato and the onion flavours.",
    body: "They’re both delightful. I preferred the tomato flavour, although I can sense that the onion one will be great with dips.",
    author: "Romana, London",
    rating: 5,
  },
];

// Where V2 pages link to. The pages live in src/app/v2 but are served from the site root
// (see the rewrites in next.config.ts), so links use the clean addresses.
export const V2_LINKS = {
  home: "/",
  shop: "/#shop",
  about: "/about",
  faq: "/faq",
  contact: "/contact",
  trade: "/trade",
  product: (slug: string) => `/products/${slug}`,
  policy: (handle: string) => `/policies/${handle}`,
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
  description: string;
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
    description:
      "Bright, tangy and layered with rich umami flavour. A delicious balance of sweetness, savoury depth and subtle acidity, they bring every crunchy bite to life.",
    paragraphs: [
      "Tomatoes do more than add flavour. Naturally rich in lycopene, vitamin C and potassium, they’re a nutrient-dense vegetable (or fruit!) that brings colour and crunch to every bite.",
      "Gently crisped to preserve their goodness, these vibrant slices pack all the character of a tangy, delicious tomato, with a crispy twist.",
    ],
    gallery: [
      { src: "/v2/pack-tomato.png", alt: "Tomato Chips pack", contain: true },
      { src: "/v2/crosps-tomato-chips.jpg", alt: "Crosps Tomato Chips on a steel plate" },
      { src: "/v2/hover-tomato.jpg", alt: "Tomato Chips on the go" },
      { src: "/v2/ing-tomato.jpg", alt: "Fresh tomato" },
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
    description:
      "Mellow, sweet and deeply savoury. Familiar yet full of character, they deliver a satisfying crunch and a comforting, moreish finish in every bite.",
    paragraphs: [
      "Our most controversial flavour. Onions transformed into a delicately crisp, golden bite.",
      "Complex and savoury: you either love it or hate it.",
    ],
    gallery: [
      { src: "/v2/pack-onion.png", alt: "Onion Chips pack", contain: true },
      { src: "/v2/crosps-onion-chips.jpg", alt: "Crosps Onion Chips, white and purple onion, on a steel plate" },
      { src: "/v2/hover-onion.jpg", alt: "Onion Chips on the go" },
      { src: "/v2/ing-onion-red.jpg", alt: "Red onion, sliced" },
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
    description:
      "Vibrant and distinctive, capturing the unique character of green, yellow and red bell peppers. Gently sweet and full of flavour, they deliver a colourful and satisfying crunch in every bite.",
    paragraphs: [
      "One of the most popular vegetables in the world, now reimagined as a light crunch with bold colour.",
      "A classic with a refined twist.",
    ],
    gallery: [
      { src: "/v2/pack-pepper.png", alt: "Pepper Chips pack", contain: true },
      { src: "/v2/crosps-pepper-chips.jpg", alt: "Crosps Pepper Chips, green, red and yellow pepper, on a steel plate" },
      { src: "/v2/story.jpg", alt: "A pepper crisp next to a fresh slice of pepper" },
      { src: "/v2/ing-pepper.jpg", alt: "Fresh green pepper" },
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
  Trade: V2_LINKS.trade,
  "Shipping & Returns": V2_LINKS.policy("shipping-policy"),
  "Refund Policy": V2_LINKS.policy("refund-policy"),
  "Terms of Service": V2_LINKS.policy("terms-of-service"),
  "Privacy Policy": V2_LINKS.policy("privacy-policy"),
  Contact: V2_LINKS.contact,
};
