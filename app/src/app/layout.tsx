import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono as JetBrainsMono,
  Space_Grotesk as SpaceGrotesk,
} from "next/font/google";
import { ThemeVariables } from "./theme-variables";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = SpaceGrotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontMono = JetBrainsMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Recepie Hub",
  description: "A personal dashboard for beautifully browsing your recipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={[
          fontSans.variable,
          fontDisplay.variable,
          fontMono.variable,
          "bg-canvas text-text-primary antialiased font-sans",
        ].join(" ")}
      >
        <ThemeVariables />
        {children}
      </body>
    </html>
  );
}
