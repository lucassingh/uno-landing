"use client";

import { useEffect, useRef } from "react";
import styles from "./TextReveal.module.css";
import { cn } from "@/lib/utils";

const COMPLETE = 0.9;

export interface TextRevealProps {
  text: string;
  className?: string;
  accentWords?: string[];
}

/**
 * Reveal PINEADO y SCRUBBABLE, con el progreso calculado A MANO (sin framer) para que sea
 * predecible: progress = cuánto scrolleaste DENTRO del contenedor alto (0 = su borde superior en
 * el tope del viewport; 1 = scrolleaste (alto - 100vh) más). Es MONÓTONO con el scroll:
 *   - bajás  -> progress sube  -> se PINTA;
 *   - subís  -> progress baja  -> se DESPINTA (reverso exacto);
 *   - abajo del todo -> progress = 1 -> queda BLANCO (y al pasar de largo sigue en 1 = blanco).
 * Cada palabra tiene su ventana; las palabras-ancla viran a amarillo. Actualiza en un rAF por
 * frame de scroll y solo mientras la sección está cerca del viewport (gate por IntersectionObserver).
 */
export function TextReveal({ text, className, accentWords = [] }: TextRevealProps) {
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const words = Array.from(outer.querySelectorAll<HTMLElement>("[data-word]"));
    const NUM = words.length;
    if (!NUM) return;

    // reduced motion: todo encendido, sin scroll-driven
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((el) => {
        if (el.dataset.accent === "1") el.style.color = "#FFD300";
        else el.style.opacity = "1";
      });
      return;
    }

    const WINDOW = Math.min(0.14, 4 / NUM);
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = outer.getBoundingClientRect();
      const denom = outer.offsetHeight - window.innerHeight;
      let p = denom > 0 ? -rect.top / denom : rect.top < 0 ? 1 : 0;
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      for (let i = 0; i < NUM; i++) {
        const start = (i / NUM) * (COMPLETE - WINDOW);
        let t = (p - start) / WINDOW;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const e = t * t * (3 - 2 * t); // smoothstep
        const el = words[i]!;
        if (el.dataset.accent === "1") {
          el.style.color = `rgba(255, ${Math.round(250 - 39 * e)}, ${Math.round(229 - 229 * e)}, ${(0.3 + 0.7 * e).toFixed(3)})`;
        } else {
          el.style.opacity = (0.3 + 0.7 * e).toFixed(3);
        }
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    let listening = false;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en?.isIntersecting) {
          if (!listening) { listening = true; window.addEventListener("scroll", onScroll, { passive: true }); }
          onScroll();
        } else if (listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "50% 0px 50% 0px" }
    );
    io.observe(outer);
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [text, accentWords]);

  const accentSet = new Set(accentWords.map((w) => w.toLowerCase()));

  return (
    <div ref={outerRef} className={styles.pinOuter}>
      <div className={styles.pinInner}>
        <div className={styles.container}>
        <p className={cn(styles.text, className)}>
          {text.split(" ").map((word, i) => {
            const isAccent = accentSet.has(word.toLowerCase());
            return (
              <span key={`${word}-${i}`} className={styles.wordWrap}>
                <span
                  data-word
                  data-accent={isAccent ? "1" : "0"}
                  className={styles.word}
                  style={isAccent ? { color: "rgba(255,250,229,0.3)" } : { opacity: 0.3 }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </p>
        </div>
      </div>
    </div>
  );
}

export default TextReveal;
