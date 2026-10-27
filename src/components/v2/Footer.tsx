import Image from "next/image";
import Link from "next/link";
import { EmailCapture } from "./EmailCapture";

export type FooterLinks = Partial<Record<string, string>>;

const COLUMNS = [
  { title: "Explore", links: ["FAQ", "Stockists", "Shipping & Returns"] },
  { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy"] },
  { title: "Follow", links: ["Instagram", "TikTok", "Contact"] },
];

const DEFAULT_LINKS: FooterLinks = {
  Instagram: "https://www.instagram.com/eatcrosps/",
  TikTok: "https://www.tiktok.com/@eatcrosps",
};

// Footer laid out after moremud.co: mission + links, newsletter, then a full-width logo.
// Links without a destination yet fall back to "#".
export function Footer({ links = {} }: { links?: FooterLinks }) {
  const hrefs = { ...DEFAULT_LINKS, ...links };
  return (
    <footer className="gutter-x flex flex-col gap-16 bg-cream pb-8 pt-14 md:gap-24 md:pt-20">
      <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <p className="type-mono max-w-[420px] text-ink">
          Crosps exists to put the vegetable first. Real slices of tomato, onion and pepper, cooked gently enough to keep
          their colour, shape and flavour. Made from crops, not compromises.
        </p>
        <div className="flex flex-wrap gap-10 md:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <p className="type-label text-ink">{col.title}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href={hrefs[link] ?? "#"} className="type-small text-ink-72 transition-colors hover:text-ink">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-[420px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="type-subheading text-ink">Stay a little longer.</p>
          <p className="type-body text-ink-88">New places. New tables. New things from Crosps.</p>
        </div>
        <EmailCapture className="max-w-none" />
      </div>

      <div className="flex flex-col gap-6">
        <Image src="/v2/crosps-logo-black.svg" alt="Crosps" width={314} height={76} className="h-auto w-full" />
        <p className="type-small text-ink-72">Copyright ©2026 Crosps. All Rights Reserved</p>
      </div>
    </footer>
  );
}
