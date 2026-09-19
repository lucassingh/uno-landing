"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

/** Cada visual vive en un loop propio: mientras esa card siga activa, la escena entera se
 * reinicia y se repite cada `intervalMs` — así "muestra todo" en vez de quedar quieta después
 * del primer render. El remount (key=cycle) es lo que resetea el estado interno de cada escena.
 * Extraído de SystemAsistenteShowcase (que fue el primero en usarlo) para que SystemMulticanal
 * lo reuse sin duplicar la lógica del ciclo. */
function useLoopCycle(intervalMs: number, paused: boolean) {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCycle((c) => c + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, paused]);
  return cycle;
}

export function LoopReplay({ intervalMs, children }: { intervalMs: number; children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const cycle = useLoopCycle(intervalMs, !!shouldReduceMotion);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cycle}
        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
