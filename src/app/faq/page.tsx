import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FaqSection } from "@/components/sections/FaqSection";

export const metadata = {
  title: "FAQ | Crosps — Real Vegetables, Unreal Crunch",
  description:
    "Frequently asked questions about Crosps: ingredients, vegan options, where to buy, and more.",
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28">
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
