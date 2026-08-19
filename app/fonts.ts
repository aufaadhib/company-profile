import localFont from "next/font/local";

export const lexend = localFont({
  src: [
    { path: "../public/fonts/lexend-400.ttf", weight: "400" },
    { path: "../public/fonts/lexend-500.ttf", weight: "500" },
    { path: "../public/fonts/lexend-600.ttf", weight: "600" },
    { path: "../public/fonts/lexend-700.ttf", weight: "700" },
  ],
  variable: "--font-lexend",
  display: "swap",
});

export const sourceSans = localFont({
  src: [
    { path: "../public/fonts/source-sans-400.ttf", weight: "400" },
    { path: "../public/fonts/source-sans-500.ttf", weight: "500" },
    { path: "../public/fonts/source-sans-600.ttf", weight: "600" },
    { path: "../public/fonts/source-sans-700.ttf", weight: "700" },
  ],
  variable: "--font-source-sans",
  display: "swap",
});
