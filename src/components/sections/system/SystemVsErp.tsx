"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import styles from "./SystemVsErp.module.css";
import { Section, Eyebrow, Button, ScrollReveal } from "@/components/ui";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

type Row = {
  metric: string;
  erp: { value: string; width: number };
  uno: { value: string; width: number };
};

const ROWS: Row[] = [
  {
    metric: "tiempo de implementación",
    erp: { value: "3 a 6 meses", width: 95 },
    uno: { value: "online en días", width: 14 },
  },
  {
    metric: "quién lo hace andar",
    erp: { value: "un equipo de IT contratado aparte", width: 88 },
    uno: { value: "el dueño del negocio, solo", width: 20 },
  },
  {
    metric: "funciones que te sobran",
    erp: { value: "8 de cada 10, sin usar nunca", width: 82 },
    uno: { value: "casi ninguna", width: 12 },
  },
  {
    metric: "precio",
    erp: { value: "por módulo y por usuario, sin techo", width: 92 },
    uno: { value: "un plan, un precio fijo", width: 18 },
  },
];

function Bar({
  className,
  width,
  active,
  reduce,
  delay = 0,
}: {
  className?: string;
  width: number;
  active: boolean;
  reduce: boolean;
  delay?: number;
}) {
  if (!active || reduce) {
    return <div className={className} style={{ width: reduce ? `${width}%` : 0 }} />;
  }
  return (
    <motion.div
      className={className}
      initial={{ width: "0%" }}
      animate={{ width: ["0%", `${width}%`] }}
      transition={{ duration: 1.1, ease: EASE, delay, repeat: Infinity, repeatType: "loop", repeatDelay: 4 }}
    />
  );
}

function CompareRow({ index, row, active, reduce }: { index: number; row: Row; active: boolean; reduce: boolean }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>
        <span className={styles.rowIndex}>{String(index).padStart(2, "0")}</span>
        <span className={styles.rowMetric}>{row.metric}</span>
      </div>
      <div className={styles.bars}>
        <div className={styles.barLine}>
          <span className={styles.barTag}>ERP tradicional</span>
          <div className={styles.track}>
            <Bar className={styles.fillErp} width={row.erp.width} active={active} reduce={reduce} />
          </div>
          <span className={styles.barValue}>{row.erp.value}</span>
        </div>
        <div className={styles.barLine}>
          <span className={styles.barTag}>Sistema +uno</span>
          <div className={styles.track}>
            <Bar className={styles.fillUno} width={row.uno.width} active={active} reduce={reduce} delay={0.15} />
          </div>
          <span className={styles.barValue}>{row.uno.value}</span>
        </div>
      </div>
    </div>
  );
}

export function SystemVsErp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-15% 0px" });
  const reduce = useReducedMotion() ?? false;

  return (
    <Section id="vs-erp" bg="default">
      <ScrollReveal>
        <header className={styles.header}>
          <Eyebrow>por qué no es un ERP carísimo</Eyebrow>
          <h2 className={styles.title}>todo a la vista en 5 segundos, no un curso de implementación.</h2>
          <p className={styles.intro}>
            Sistemas administrativos complejos y costosos, con funciones que jamás vas a usar. El
            Sistema +uno va al hueso.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className={styles.card} ref={containerRef}>
          <div className={styles.rows}>
            {ROWS.map((row, i) => (
              <CompareRow key={row.metric} index={i + 1} row={row} active={inView} reduce={reduce} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className={styles.ctaBand}>
          <p className={styles.ctaText}>
            No competimos en cantidad de funciones. Competimos en que lo uses de verdad.
          </p>
          <Button href="#contacto" variant="invert" size="lg">
            hablemos
          </Button>
        </div>
      </ScrollReveal>
    </Section>
  );
}
