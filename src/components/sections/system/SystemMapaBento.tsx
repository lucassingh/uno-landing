"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./SystemMapa.module.css";

const LAYERS = [
  { index: "01", label: "asistente", hint: "responde y filtra en el momento" },
  { index: "02", label: "panel · crm", hint: "ordena cada lead calificado" },
  { index: "03", label: "stock", hint: "avisa lo que se está por acabar" },
];

type Temp = "caliente" | "tibio" | "frío";

const LEADS: { name: string; channel: string; temp: Temp }[] = [
  { name: "Ludmila Rojas", channel: "TikTok", temp: "caliente" },
  { name: "Josefina Paz", channel: "Instagram", temp: "caliente" },
  { name: "Brenda Acuña", channel: "WhatsApp", temp: "tibio" },
  { name: "Pilar Vega", channel: "Web", temp: "tibio" },
  { name: "Martina Solís", channel: "TikTok", temp: "frío" },
];

const TEMP_CLASS: Record<Temp, string> = {
  caliente: styles.tempCaliente!,
  tibio: styles.tempTibio!,
  frío: styles.tempFrio!,
};

const BARS = [30, 42, 36, 58, 72, 100];
const REVENUE_TARGET = 2450000;

function formatCurrency(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

function LayersVisual() {
  return (
    <div className={styles.layerStack} aria-hidden="true">
      {LAYERS.map((l) => (
        <div key={l.index} className={styles.layerBar}>
          <div className={styles.layerBarTop}>
            <span className={styles.layerIndex}>{l.index}</span>
            <span className={styles.layerLabel}>{l.label}</span>
          </div>
          <p className={styles.layerHint}>{l.hint}</p>
        </div>
      ))}
    </div>
  );
}

function FilterVisual() {
  return (
    <div className={styles.filterMock} aria-hidden="true">
      <div className={styles.filterTabs}>
        <span className={`${styles.filterTab} ${styles.filterTabActive}`}>todos</span>
        <span className={styles.filterTab}>caliente</span>
        <span className={styles.filterTab}>tibio</span>
        <span className={styles.filterTab}>frío</span>
      </div>
      <div className={styles.leadList}>
        {LEADS.map((l) => (
          <div key={l.name} className={styles.leadRow} data-temp={l.temp}>
            <div className={styles.leadInfo}>
              <span className={styles.leadName}>{l.name}</span>
              <span className={styles.leadChannel}>{l.channel}</span>
            </div>
            <span className={`${styles.tempBadge} ${TEMP_CLASS[l.temp]}`}>{l.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Único card que necesita JS: el conteo de $ no se puede resolver en CSS puro. Entra/sale en
 * hover con motion.animate() sobre un MotionValue — más liviano que re-crear un spring a mano. */
function RevenueVisual() {
  const shouldReduceMotion = useReducedMotion();
  const [hover, setHover] = useState(false);
  // en touch no existe el hover que dispara el conteo: la card quedaba en "$ · · ·" para
  // siempre. Ahí se anima sola cuando entra en pantalla (una vez, sin loop).
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useMediaQuery("(hover: none)");
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const hovered = hover || (isTouch && inView);
  const [display, setDisplay] = useState("$ · · ·");
  const mv = useMotionValue(0);

  useMotionValueEvent(mv, "change", (latest) => {
    setDisplay(latest < 1000 ? "$ · · ·" : formatCurrency(latest));
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(hovered ? formatCurrency(REVENUE_TARGET) : "$ · · ·");
      return;
    }
    const controls = animate(mv, hovered ? REVENUE_TARGET : 0, {
      duration: hovered ? 1.1 : 0.3,
      ease: [0.2, 0.8, 0.2, 1],
    });
    return () => controls.stop();
  }, [hovered, shouldReduceMotion, mv]);

  return (
    <div
      ref={ref}
      className={styles.revenueMock}
      aria-hidden="true"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.revenueTop}>
        <span className={styles.revenueLabel}>ingresos del mes</span>
        <motion.span
          className={styles.revenueBadge}
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          +24%
        </motion.span>
      </div>
      <div className={styles.revenueValue}>{display}</div>
      <div className={styles.revenueBars}>
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className={i === BARS.length - 1 ? `${styles.revenueBar} ${styles.revenueBarLast}` : styles.revenueBar}
            initial={false}
            animate={{ height: hovered ? `${h}%` : "12%" }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay: hovered ? i * 0.04 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}

const CARDS = [
  {
    id: "layers",
    title: "un sistema, tres capas.",
    text: "el asistente, el panel y el stock corren juntos, sin integraciones raras ni planillas sueltas.",
    Visual: LayersVisual,
  },
  {
    id: "filter",
    title: "frío, tibio o caliente.",
    text: "cada lead entra clasificado por temperatura — vos decidís a quién llamar primero.",
    Visual: FilterVisual,
  },
  {
    id: "revenue",
    title: "y ahí se ve la ganancia.",
    text: "cuando el lead está ordenado y clasificado, cerrar la venta dejó de ser una lotería.",
    Visual: RevenueVisual,
  },
];

export function SystemMapaBento() {
  return (
    <div className={styles.bentoGrid}>
      {CARDS.map(({ id, title, text, Visual }) => (
        <div key={id} className={styles.bentoCard}>
          <div className={styles.bentoVisual}>
            <Visual />
          </div>
          <div className={styles.bentoBody}>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
