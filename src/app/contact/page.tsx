import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata = {
  title: "Contact | Crosps — Real Vegetables, Unreal Crunch",
  description:
    "Get in touch with Crosps. Questions, stockist enquiries, or feedback — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
