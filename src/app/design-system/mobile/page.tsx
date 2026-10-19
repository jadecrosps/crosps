import type { Metadata } from "next";
import { MobilePreview } from "./MobilePreview";

export const metadata: Metadata = {
  title: "Mobile preview | Crosps",
  robots: { index: false, follow: false },
};

export default function MobilePreviewPage() {
  return <MobilePreview />;
}
