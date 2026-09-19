"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./SystemRubro.module.css";
import { Section, SectionHeader, Grainient, ScrollReveal } from "@/components/ui";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

type RubroId = "indumentaria" | "repuestos";

const RUBROS: { id: RubroId; label: string; fields: { label: string; value: string }[] }[] = [
  {
    id: "indumentaria",
    label: "indumentaria",
    fields: [
      { label: "regla de calificación", value: "¿Pregunta por talle o por mayor? Eso decide si es venta unitaria o mayorista." },
      { label: "atributos de producto", value: "Talle, color, temporada." },
      { label: "si no califica", value: "Se lo deriva al catálogo online, sin perder el contacto." },
    ],
  },
  {
    id: "repuestos",
    label: "repuestos",
    fields: [
      { label: "regla de calificación", value: "¿Tiene marca, modelo y año del auto? Con eso cotiza directo." },
      { label: "atributos de producto", value: "Marca, modelo, año, número de pieza." },
      { label: "si no califica", value: "Se deriva a un técnico para confirmar compatibilidad." },
    ],
  },
];

export function SystemRubro() {
  const [active, setActive] = useState(0);
  const current = RUBROS[active]!;

  return (
    <Section id="rubro" bg="default">
      <ScrollReveal>
        <SectionHeader
          eyebrow="no es un molde para todos"
          title="se configura para tu rubro, no al revés."
          intro="El motor es el mismo para todos los clientes. Lo que cambia es la capa de configuración: tus reglas, tu catálogo, tus atributos, tu forma de calificar un lead."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
      <div className={styles.panel}>
        <div className={styles.motor} aria-hidden="true">
          <Grainient
            className={styles.motorBg}
            color1="#031844"
            color2="#3A10E5"
            color3="#031844"
            timeSpeed={0.15}
            grainScale={1.2}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/isotipo-white.svg" alt="" className={styles.motorWatermark} />
          <div className={styles.motorContent}>
            <span className={styles.motorLabel}>el motor</span>
            <p className={styles.motorCaption}>no cambia, sea cual sea tu rubro.</p>
          </div>
        </div>

        <div className={styles.config}>
          <div className={styles.tabs} role="group" aria-label="Elegir rubro de ejemplo">
            {RUBROS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                className={styles.tab}
                onClick={() => setActive(i)}
              >
                {i === active ? (
                  <motion.span
                    layoutId="rubroTabPill"
                    className={styles.tabPill}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                ) : null}
                <span className={styles.tabLabel} data-active={i === active}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className={styles.fields}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
            >
              {current.fields.map((f) => (
                <motion.div
                  key={f.label}
                  className={styles.field}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span className={styles.fieldLabel}>{f.label}</span>
                  <p className={styles.fieldValue}>{f.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </ScrollReveal>
    </Section>
  );
}
