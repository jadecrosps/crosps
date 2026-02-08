import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaVerify } from "@/components/sections/CtaVerify";
import { Ingredients } from "@/components/sections/Ingredients";
import { PhotoGrid } from "@/components/sections/PhotoGrid";
import {
  AboutHero,
  BrandPhilosophy,
  HowItBegan,
  ValuesList,
  YouMightAlsoLike,
} from "@/components/sections/about";

export const metadata = {
  title: "About | Crosps — Real Vegetables, Unreal Crunch",
  description:
    "How Crosps began, our values, and our commitment to clean, delicious vegetable crisps made from real ingredients.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28">
        <AboutHero />
        <HowItBegan />
        <BrandPhilosophy />
        <ValuesList />
        <Ingredients
          subtitle="Nothing to hide. Choose your bliss."
          cta={{ label: "SHOP CROPS", href: "/#products" }}
        />
        <CtaVerify />
        <YouMightAlsoLike />
        <PhotoGrid />
      </main>
      <Footer />
    </>
  );
}
