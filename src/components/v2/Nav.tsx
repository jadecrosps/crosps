import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./Button";

export function Nav({ tone = "light", cartCount = 0 }: { tone?: "light" | "dark"; cartCount?: number }) {
  return (
    <nav className="flex h-[84px] items-center justify-between px-5 md:px-10">
      <div className="hidden items-center gap-[13px] md:flex">
        <NavLink href="#" tone={tone}>Shop</NavLink>
        <NavLink href="#" tone={tone}>About</NavLink>
        <NavLink href="#" tone={tone}>FAQ</NavLink>
      </div>
      <Link href="/" aria-label="Crosps home" className="md:absolute md:left-1/2 md:-translate-x-1/2">
        <Image src={tone === "light" ? "/v2/logo-white.svg" : "/v2/logo-ink.svg"} alt="Crosps" width={110} height={26} />
      </Link>
      <NavLink href="#" tone={tone}>Cart ({cartCount})</NavLink>
    </nav>
  );
}
