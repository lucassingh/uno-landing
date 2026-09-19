"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./SlideCarousel.module.css";
import { GradientText } from "./GradientText";
import { cn } from "@/lib/utils";

export interface SlideCarouselItem {
  id: string;
  text: string;
}

export interface SlideCarouselProps {
  items: SlideCarouselItem[];
  autoplayDelay?: number;
  className?: string;
}

const MOBILE_BREAKPOINT = 640;

/** En mobile el slide entra/sale en vertical en vez de horizontal (pedido puntual: "que la
 * animación sea vertical" ahí) — el resto del mecanismo es idéntico en los dos breakpoints. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5v15l14-7.5-14-7.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5h4v15H6v-15Zm8 0h4v15h-4v-15Z" />
    </svg>
  );
}

/** Card blanca con borde (mismo lenguaje que el resto del sitio) que va mostrando un dolor a la
 * vez. El selector de slide vive AFUERA de la card, centrado 20px abajo — no es un overlay sobre
 * el contenido. El progreso real se anima en CSS puro (`onAnimationEnd` dispara el avance, no un
 * setInterval en JS aparte) y pausar congela el fill en su lugar en vez de reiniciarlo. */
export function SlideCarousel({ items, autoplayDelay = 6000, className }: SlideCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const goTo = useCallback((i: number) => {
    setActiveIndex((prev) => (prev === i ? prev : i));
  }, []);

  const handleAutoAdvance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const active = items[activeIndex];
  if (!active) return null;

  const autoplayOn = !shouldReduceMotion;
  const offAxis = isMobile ? { y: 24 } : { x: 24 };
  const onAxisExit = isMobile ? { y: -24 } : { x: -24 };

  return (
    <div className={className}>
      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className={styles.slide}
            initial={shouldReduceMotion ? undefined : { opacity: 0, ...offAxis }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, ...onAxisExit }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className={styles.text}>
              <GradientText>{active.text}</GradientText>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        <div className={styles.dots} role="group" aria-label="Ir a un problema específico">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Problema ${i + 1} de ${items.length}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className={cn(styles.dot, i === activeIndex && styles.dotActive)}
              onClick={() => goTo(i)}
            >
              {i === activeIndex ? (
                autoplayOn ? (
                  <span
                    key={activeIndex}
                    className={cn(styles.fill, !playing && styles.fillPaused)}
                    style={{ animationDuration: `${autoplayDelay}ms` }}
                    onAnimationEnd={handleAutoAdvance}
                  />
                ) : (
                  <span className={styles.fillStatic} />
                )
              ) : null}
            </button>
          ))}
        </div>
        {autoplayOn ? (
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SlideCarousel;
