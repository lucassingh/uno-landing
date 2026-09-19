"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Cubes.module.css";
import { cn } from "@/lib/utils";

const GRID_SIZE = 3;
const CELLS = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
  row: Math.floor(i / GRID_SIZE),
  col: i % GRID_SIZE,
}));
const FACES = ["front", "back", "left", "right", "top", "bottom"] as const;
/** Fila 1, columna 2 (0-index) — la celda +1 real del isotipo (branding/03-logo/02-isotipo/isotipo.svg: única con rotate(-21deg)). */
const SPECIAL_INDEX = 5;

/** Grilla de cubos 3D; la celda +1 pulsa de tamaño con la inclinación real del isotipo (adaptado del patrón Cubes de reactbits al sistema +1). */
export function Cubes({ className, ready = true }: { className?: string; ready?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  // el pulso (scale sobre un cubo 3D con caras de borde punteado) repinta en cada frame; solo
  // importa cuando el Hero está quieto en pantalla. Al scrollear fuera del Hero lo pausamos para
  // que no repinte y compita con el scroll durante la transición a la sección siguiente.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPaused(!e?.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = { opacity: 0, x: "26vw", y: "20vh", scale: 0.7 };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <div ref={stageRef} className={cn(styles.stage, paused && styles.paused, className)} aria-hidden="true">
      <motion.div
        className={styles.entrance}
        initial={hidden}
        animate={ready ? shown : hidden}
        transition={
          shouldReduceMotion
            ? { duration: 0.5 }
            : { type: "spring", stiffness: 70, damping: 16, mass: 0.9 }
        }
      >
        <div className={styles.grid}>
          {CELLS.map(({ row, col }, i) => {
            const isSpecial = i === SPECIAL_INDEX;
            return (
              <div
                key={`${row}-${col}`}
                className={cn(styles.cube, isSpecial && styles.special, shouldReduceMotion && styles.cubeStill)}
              >
                {FACES.map((face) => (
                  <div key={face} className={cn(styles.face, styles[face])} />
                ))}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
