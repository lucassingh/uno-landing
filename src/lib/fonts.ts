import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

/**
 * Montserrat vía next/font/google (display, self-hosted en build por Next).
 * Mono y body siguen locales (woff2 en src/fonts).
 */

/** Display — titulares. */
export const montserrat = Montserrat({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

/** Mono — labels, specs, detalle utilitario. */
export const jetbrains = localFont({
  src: [
    { path: "../fonts/jetbrains-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/jetbrains-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

/** Cuerpo — texto corrido y UI. */
export const inter = localFont({
  src: [
    { path: "../fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

/** Clase con las 3 variables, para el <html>. */
export const fontVariables = [montserrat.variable, jetbrains.variable, inter.variable].join(" ");
