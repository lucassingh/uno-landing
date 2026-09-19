import type { ColorToken } from "@/types/content";

/** Mapea un ColorToken a su CSS var(--color-x) — para pintar acentos inline. */
export const colorVar: Record<ColorToken, string> = {
  tinta: "var(--color-tinta)",
  blanco: "var(--color-blanco)",
  gris: "var(--color-gris)",
  rosa: "var(--color-rosa)",
  cyan: "var(--color-cyan)",
  amarillo: "var(--color-amarillo)",
  verde: "var(--color-verde)",
  naranja: "var(--color-naranja)",
};

/** Mismo mapeo en triplete "r, g, b" — para componer rgba() en efectos (glow, partículas). */
export const colorRgb: Record<ColorToken, string> = {
  tinta: "29, 29, 29",
  blanco: "255, 255, 255",
  gris: "242, 242, 242",
  rosa: "255, 0, 92",
  cyan: "0, 168, 225",
  amarillo: "255, 255, 0",
  verde: "155, 255, 0",
  naranja: "255, 92, 42",
};

/**
 * Espejo tipado de los design tokens (styles/tokens.css).
 * Para acceder a valores desde JS/TS con seguridad de tipos.
 */
export const theme = {
  colors: {
    tinta: "#1D1D1D",
    blanco: "#FFFFFF",
    gris: "#F2F2F2",
    rosa: "#FF005C",
    cyan: "#00A8E1",
    amarillo: "#FFFF00",
    verde: "#9BFF00",
    naranja: "#FF5C2A",
  },
  fonts: {
    display: "var(--font-display)",
    mono: "var(--font-mono)",
    body: "var(--font-body)",
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;
