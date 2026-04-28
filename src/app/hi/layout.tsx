import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hi | Crosps",
  description: "Tell us how your Crosps were.",
  robots: { index: false, follow: false },
};

export default function HiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
