"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./BrowserShowcase.module.css";
import { cn } from "@/lib/utils";

export interface BrowserShot {
  id: string;
  src: string;
}

export interface BrowserShowcaseProps {
  shots: BrowserShot[];
  ariaLabel: string;
  addressLabel?: string;
  intervalMs?: number;
  /** modo controlado: si viene, se muestra esa captura y el ciclo automático no corre — lo
   * maneja el padre (ej. las pestañas captá/filtrá/ordená de SistemaMasUno en mobile). */
  activeIndex?: number;
  className?: string;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

/** Mockup de ventana de browser (chrome monocromo, sin colores de semáforo reales — se mantiene
 * a los 3 tokens de marca) que hace crossfade infinito entre las capturas que le pasen. Cada
 * imagen queda montada `intervalMs` antes de que AnimatePresence cruce a la siguiente (con una
 * sola imagen el intervalo simplemente no hace nada). Con prefers-reduced-motion el ciclo no
 * arranca y queda fija la primera captura. Compartido entre SystemHero y cualquier otra sección
 * que necesite el mismo mockup con otras capturas — no lo dupliques, agregá acá si hace falta
 * una variante. */
export function BrowserShowcase({
  shots,
  ariaLabel,
  addressLabel = "app.masuno.com",
  intervalMs = 4000,
  activeIndex,
  className,
}: BrowserShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const controlled = activeIndex !== undefined;

  useEffect(() => {
    if (controlled || shouldReduceMotion || shots.length < 2) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % shots.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [controlled, shouldReduceMotion, shots.length, intervalMs]);

  const current = shots[controlled ? activeIndex : active] ?? shots[0]!;

  return (
    <div className={cn(styles.browser, className)} role="img" aria-label={ariaLabel}>
      <div className={styles.browserBar}>
        <div className={styles.browserDots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.browserAddress}>
          <LockIcon />
          <span>{addressLabel}</span>
        </div>
        <div className={styles.browserReload} aria-hidden="true">
          <ReloadIcon />
        </div>
      </div>
      <div className={styles.browserScreen}>
        <AnimatePresence initial={false}>
          <motion.img
            key={current.id}
            src={current.src}
            alt=""
            className={styles.browserShot}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
