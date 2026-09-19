"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import styles from "./StickyScroll.module.css";
import { Card } from "./Card";

export interface StickyScrollItem {
  index: string;
  title: string;
  description: string;
  /** frase corta ("fundamento"): el por qué del paso, no el qué — refuerzo chico abajo de la
   * descripción, no un resumen de la misma. */
  principle: string;
  /** ruta pública al SVG animado del paso (loop en CSS, ver public/metodo/) */
  illustration: string;
}

export interface StickyScrollProps {
  items: StickyScrollItem[];
  className?: string;
}

/**
 * Sticky scroll reveal compacto: un único "slide" (texto + placeholder de ilustración) queda
 * fijo y centrado en pantalla durante TODO el recorrido del carril, y cambia de contenido a
 * medida que se scrollea. La tira visible no crece con la cantidad de pasos.
 *
 * El paso activo se deriva del PROGRESO de scroll del carril (0→1), no de "qué título está más
 * cerca del centro". Esto arregla dos cosas del enfoque anterior:
 *   1. Sync: antes la card quedaba pegada solo durante (alto_track − alto_card) px, pero los
 *      pasos se activaban repartidos en todo el track — los últimos pasos cambiaban cuando la
 *      card ya se había despegado y salido de pantalla.
 *   2. Espaciado: el slide queda centrado por sticky top:0 + flex, así se despega justo cuando
 *      el carril termina. No queda "cola" de scroll vacío antes de la sección siguiente, y la
 *      entrada y la salida quedan simétricas.
 */
export function StickyScroll({ items, className }: StickyScrollProps) {
  const shouldReduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Progreso 0→1 exactamente a lo largo del tramo en que el slide está pegado (sticky top:0,
  // alto 100vh), medido a mano sobre el carril: cuando su borde superior toca el borde superior
  // del viewport (rect.top = 0) el pin arranca (progreso 0); cuando su borde inferior toca el
  // borde inferior (rect.top = -(alto - 100vh)) el pin termina (progreso 1). Los N pasos se
  // reparten parejo en ese tramo. rAF-throttled para no medir en cada evento de scroll.
  const total = items.length;
  const updateActive = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const denom = rect.height - window.innerHeight;
    const progress = denom > 0 ? Math.min(1, Math.max(0, -rect.top / denom)) : 0;
    const i = Math.min(total - 1, Math.floor(progress * total));
    setActive((prev) => (prev === i ? prev : i));
  }, [total]);

  // el listener de scroll queda desconectado por completo mientras el carril no está cerca del
  // viewport (mismo patrón que TextReveal.tsx) — antes vivía prendido toda la sesión, sumando
  // trabajo de scroll de fondo en TODA la página incluso a kilómetros de Metodo.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateActive();
      });
    };

    let listening = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!listening) {
            listening = true;
            window.addEventListener("scroll", onScroll, { passive: true });
          }
          onScroll();
        } else if (listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "50% 0px 50% 0px" }
    );
    io.observe(el);
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [updateActive]);

  const current = items[active];
  if (!current) return null;

  return (
    <div className={className}>
      <div ref={wrapRef} className={styles.wrap}>
        {/* Carril invisible (opacity:0): le da a la sección su alto de scroll y mantiene el texto
            real de cada paso en el árbol de accesibilidad / indexable. El contenido que se ve es
            el slide sticky de abajo. */}
        <div className={styles.track}>
          {items.map((item) => (
            <div className={styles.trackStep} key={item.index}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.slides}>
          <div className={styles.slidesInner}>
            <Card raised className={styles.textCard}>
              <AnimatePresence>
                <motion.div
                  className={styles.textAnim}
                  key={current.index}
                  aria-hidden="true"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className={styles.stepIndex}>{current.index}</span>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{current.title}</h3>
                    <p className={styles.stepText}>{current.description}</p>
                    <p className={styles.stepPrinciple}>{current.principle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
            <div className={styles.visual}>
              <AnimatePresence>
                <motion.img
                  key={current.illustration}
                  src={current.illustration}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={styles.illustration}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            className={styles.scrollHint}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <svg
              className={styles.scrollMouse}
              width="26"
              height="40"
              viewBox="0 0 26 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1.5" y="1.5" width="23" height="37" rx="11.5" />
              <line className={styles.scrollWheel} x1="13" y1="9" x2="13" y2="15" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default StickyScroll;
