interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "purple" | "outline" | "outline-white" | "dark";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-[16px] font-medium tracking-wide transition-colors duration-200 cursor-pointer";

  const variants = {
    primary: "bg-crosps-green text-white hover:bg-crosps-green-dark",
    purple: "bg-crosps-purple-dark text-white hover:bg-crosps-purple",
    outline:
      "border border-crosps-charcoal text-crosps-charcoal hover:bg-crosps-charcoal hover:text-white",
    "outline-white":
      "border border-white text-white hover:bg-white/10",
    dark: "bg-white text-crosps-charcoal hover:bg-crosps-cream",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
