import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { Ticker } from "@/components/sections/Ticker";
import { ProductCards } from "@/components/sections/ProductCards";
import { CtaVerify } from "@/components/sections/CtaVerify";
import { PhotoGrid } from "@/components/sections/PhotoGrid";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueProposition />
        <Ticker />
        <ProductCards />
        <CtaVerify />
        <PhotoGrid />
      </main>
      <Footer />
    </>
  );
}
