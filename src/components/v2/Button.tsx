import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "dark" | "light";
  href?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const VARIANTS = {
  dark: "bg-ink text-white hover:bg-ink-88",
  light: "bg-white text-ink backdrop-blur-[8px] hover:bg-cream",
};

export function Button({ children, variant = "dark", href, className = "", ...rest }: ButtonProps) {
  const classes = `type-button inline-flex items-center justify-center rounded-button px-10 py-4 whitespace-nowrap transition-colors duration-200 ${VARIANTS[variant]} ${className}`;

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

export function TextLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="type-button uppercase text-ink underline decoration-from-font underline-offset-4 transition-opacity hover:opacity-70"
    >
      {children} &rarr;
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
      className={`type-nav px-2 pb-0.5 pt-2 transition-opacity hover:opacity-70 ${tone === "light" ? "text-white" : "text-ink"}`}
    >
      {children}
    </Link>
  );
}
