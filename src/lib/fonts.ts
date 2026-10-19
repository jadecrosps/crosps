import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";

export const saans = localFont({
  src: [
    {
      path: "../../public/fonts/Saans/Saans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Saans/Saans-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-saans",
  display: "swap",
});

// Stand-in for "Saans Mono", which is only available as an unlicensed trial.
export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const daVinci = localFont({
  src: [
    {
      path: "../../public/fonts/Da Vinci/TRJNDaVinci-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Da Vinci/TRJNDaVinci-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Da Vinci/TRJNDaVinci-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Da Vinci/TRJNDaVinci-Italic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-da-vinci",
  display: "swap",
});
