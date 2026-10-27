import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "dark" | "light";
  href?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const VARIANTS = {
  dark: "bg-brown text-white hover:bg-brown-88",
  light: "bg-white text-ink backdrop-blur-[8px] hover:bg-stone",
};

export function Button({ children, variant = "dark", href, className = "", ...rest }: ButtonProps) {
  const classes = `type-mono inline-flex items-center justify-center rounded-button px-10 py-4 whitespace-nowrap transition-colors duration-200 ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={`cursor-pointer disabled:opacity-50 ${classes}`} {...rest}>
      {children}
    </button>
  );
}

// Arrow whose shaft extends on hover of the parent link.
function Arrow() {
  return (
    <span aria-hidden className="relative flex h-[10px] w-3 items-center transition-[width] duration-300 ease-out group-hover/link:w-7">
      <span className="h-px w-full bg-current" />
      <span className="absolute right-0 size-[7px] rotate-45 border-r border-t border-current" />
    </span>
  );
}

export function TextLink({
  children,
  href,
  className = "",
  underline = true,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  underline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group/link type-mono inline-flex items-center gap-2 text-ink ${className}`}
    >
      <span className={underline ? "underline decoration-from-font underline-offset-4" : ""}>{children}</span>
      <Arrow />
    </Link>
  );
}

export function NavLink({
  children,
  href,
  tone = "light",
}: {
  children: React.ReactNode;
  href: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href={href}
      className={`type-nav border-b border-transparent px-2 pb-0.5 pt-2 transition-colors hover:border-current ${tone === "light" ? "text-white" : "text-ink"}`}
    >
      {children}
    </Link>
  );
}
