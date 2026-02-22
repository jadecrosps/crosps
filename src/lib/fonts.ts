import localFont from "next/font/local";

export const saans = localFont({
  src: [
    {
      path: "../../public/fonts/Saans/Saans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-saans",
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
