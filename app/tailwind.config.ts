import type { Config } from "tailwindcss";
import tokens from "./src/design-system/tokens.json";

const toVarName = (token: string) =>
  token
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

const semanticColor = (name: string) =>
  `rgb(var(--color-${toVarName(name)}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: semanticColor("canvas"),
        surface: semanticColor("surface"),
        card: semanticColor("card"),
        cardAlt: semanticColor("cardAlt"),
        muted: semanticColor("muted"),
        mutedAlt: semanticColor("mutedAlt"),
        text: {
          primary: semanticColor("textPrimary"),
          secondary: semanticColor("textSecondary"),
        },
        accent: semanticColor("accent"),
        accentSoft: semanticColor("accentSoft"),
        accentMuted: semanticColor("accentMuted"),
        highlight: semanticColor("highlight"),
        success: semanticColor("success"),
        warning: semanticColor("warning"),
        border: semanticColor("border"),
      },
      spacing: tokens.primitives.spacing,
      borderRadius: tokens.primitives.radii,
      boxShadow: tokens.primitives.shadows,
      fontFamily: {
        sans: tokens.fonts.sans,
        display: tokens.fonts.display,
        mono: tokens.fonts.mono,
      },
    },
  },
  plugins: [],
};

export default config;
