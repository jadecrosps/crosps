import Image from "next/image";
import Link from "next/link";
import { EmailCapture } from "./EmailCapture";

export type FooterLinks = Partial<Record<string, string>>;

const COLUMNS = [
  { title: "Explore", links: ["FAQ", "Stockists", "Shipping & Returns"] },
  { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy"] },
  { title: "Follow", links: ["Instagram", "Tiktok", "Contact"] },
];

const DEFAULT_LINKS: FooterLinks = { Instagram: "https://www.instagram.com/eatcrosps/" };

// Links without a destination yet fall back to "#".
export function Footer({ links = {} }: { links?: FooterLinks }) {
  const hrefs = { ...DEFAULT_LINKS, ...links };
  return (
    <footer className="flex flex-col gap-20 bg-cream px-5 pb-10 pt-14 md:px-10">
      <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="flex w-full max-w-[375px] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="type-subheading text-ink">Stay a little longer.</p>
            <p className="type-body text-ink-88">New places. New tables. New things from Crosps.</p>
          </div>
          <EmailCapture className="max-w-none" />
        </div>
        <div className="flex flex-wrap gap-10 md:gap-14">
          {COLUMNS.map((col, i) => (
            <div key={col.title} className={`flex flex-col gap-6 ${i > 0 ? "md:border-l md:border-ink-10 md:pl-14" : ""}`}>
              <p className="type-mono text-ink">{col.title}</p>
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
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <Image src="/v2/logo-ink.svg" alt="Crosps" width={140} height={32} />
        <p className="type-small text-ink-72">Copyright ©2026 Crosps. All Rights Reserved</p>
      </div>
    </footer>
  );
}
