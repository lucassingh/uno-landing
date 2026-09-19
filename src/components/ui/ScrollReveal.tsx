"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export type ScrollRevealDirection = "up" | "down" | "left" | "right";

export interface ScrollRevealProps {
  children: ReactNode;
  /** de dónde "viene" el elemento — "left"/"right" son las mitades de un converge al centro
   * (envolvé cada mitad con su propia dirección), "up" es el clásico full-width que sube. */
  direction?: ScrollRevealDirection;
  delay?: number;
  duration?: number;
  /** cuánto se desplaza antes de asentarse, en px */
  distance?: number;
  className?: string;
}

const AXIS: Record<ScrollRevealDirection, "x" | "y"> = {
  up: "y",
  down: "y",
  left: "x",
  right: "x",
};
const SIGN: Record<ScrollRevealDirection, 1 | -1> = { up: 1, down: -1, left: -1, right: 1 };

/**
 * Reveal de entrada al scroll, genérico y reutilizable (Hero/About/Metodo ya tienen la suya
 * propia y más específica — esto es para el resto). Envolvé UN bloque por instancia: para un
 * "dos cajas que se juntan al centro", envolvé la de la izquierda con direction="left" y la de
 * la derecha con direction="right" por separado, no hay una prop "converge" — son dos reveals
 * independientes que casualmente van a direcciones opuestas.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 32,
  className,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const offset = distance * SIGN[direction];
  const initialOffset = AXIS[direction] === "x" ? { x: offset } : { y: offset };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -10% 0px" }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
