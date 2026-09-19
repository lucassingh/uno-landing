"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./Consola.module.css";

/**
 * Consola / terminal "quiénes somos" — versión clara (fondo blanco, sombra blanca, líneas navy)
 * con copy en lenguaje humano (sin comandos técnicos), tipeado al entrar en viewport.
 *
 * GUARDADA para reutilizar: no está montada en la página. Para usarla, importala y renderizala
 * donde quieras (ej. una sección "cómo trabajamos"):
 *   import { Consola } from "@/components/sections/Consola";
 *   ...
 *   <Consola />
 */

const LINES = [
  "~ más uno",
  "> Somos devs, no una agencia de marketing.",
  "> El código y el diseño salen de la misma persona.",
  "> Nada de plantillas: cada proyecto se piensa desde cero.",
  "> No hacemos pauta, pero no perdemos ni un lead:",
  "  recibimos, filtramos, atendemos y ordenamos.",
  "> El lanzamiento no es el final.",
  "> Ahí es donde arrancamos de verdad.",
];
const FULL = LINES.join("\n");

function useInViewOnce(threshold = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setSeen(true); o.disconnect(); } },
      { threshold }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, seen };
}

function useTyping(text: string, active: boolean, speed = 16) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (reduce) { setN(text.length); return; }
    setN(0);
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= text.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [active, text, speed, reduce]);
  return n;
}

export interface ConsolaProps {
  id?: string;
  className?: string;
}

export function Consola({ id, className }: ConsolaProps) {
  const { ref, seen } = useInViewOnce(0.35);
  const n = useTyping(FULL, seen);
  const typed = FULL.slice(0, n);
  const rest = FULL.slice(n);

  return (
    <section id={id} className={`${styles.sec} ${className ?? ""}`}>
      <div className={styles.wrap}>
        <div className={styles.terminalOuter} ref={ref}>
          <p className={styles.kicker}>{"// quiénes somos"}</p>
          <div className={styles.terminal}>
            <div className={styles.bar}>
              <span className={`${styles.dot} ${styles.dot1}`} />
              <span className={`${styles.dot} ${styles.dot2}`} />
              <span className={`${styles.dot} ${styles.dot3}`} />
              <span className={styles.title}>más uno — quiénes somos</span>
            </div>
            <p className={styles.body}>
              <span>{typed}</span>
              <span className={styles.caret} />
              <span aria-hidden style={{ opacity: 0 }}>{rest}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Consola;
