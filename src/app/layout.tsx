import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MagickWeb — Free Browser-Based Image Editor",
  description:
    "A powerful, free image editor powered by ImageMagick WebAssembly. Resize, blur, sharpen, convert, and apply 19+ effects. Your images never leave your device.",
  keywords: "image editor, imagemagick, wasm, blur, resize, grayscale, sepia, free, browser",
  openGraph: {
    title: "MagickWeb — Free Browser Image Editor",
    description: "ImageMagick in your browser. 19+ operations. Private, fast, free.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
