"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import styles from "./SystemHero.module.css";
import { Section, Container, Eyebrow, Button } from "@/components/ui";
import { useSiteReady } from "@/components/ui/Loader";
import { BrowserShowcase } from "./BrowserShowcase";

const HERO_SHOTS = [
  { id: "crm", src: "/system/hero/dashboard-crm.png" },
  { id: "stock", src: "/system/hero/dashboard-stock.png" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};

/** El browser mockup pesa más visualmente que una línea de texto, así que entra con un
 * recorrido más largo (desde más abajo) — se nota como una pieza aparte, no como un ítem más
 * del stagger de arriba, aunque comparte la misma cola de tiempos. */
const showcaseItem: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.2, 0.8, 0.2, 1] } },
};

export function SystemHero() {
  const shouldReduceMotion = useReducedMotion();
  const ready = useSiteReady();

  return (
    <Section id="top" bg="default" contained={false}>
      <motion.div
        variants={shouldReduceMotion ? undefined : container}
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : ready ? "show" : "hidden"}
      >
        <Container>
          <motion.div variants={shouldReduceMotion ? undefined : item}>
            <Eyebrow>el sistema +uno — por dentro</Eyebrow>
          </motion.div>
          <motion.h1 className={styles.heroTitle} variants={shouldReduceMotion ? undefined : item}>
            así es como tu negocio deja de perder ventas.
          </motion.h1>
          <motion.p
            className={styles.heroLead}
            variants={shouldReduceMotion ? undefined : item}
          >
            el asistente que filtra, el panel que ordena cada lead y el stock que avisa antes de que se acabe.
          </motion.p>
          <motion.div className={styles.ctaRow} variants={shouldReduceMotion ? undefined : item}>
            <Button href="#contacto" variant="primary" size="lg">
              reservá tu charla
            </Button>
            <Button href="#mapa" variant="outline" size="lg">
              ver el mapa completo
            </Button>
          </motion.div>
        </Container>

        <Container wide className={styles.showcaseWrap}>
          <motion.div variants={shouldReduceMotion ? undefined : showcaseItem}>
            <BrowserShowcase
              shots={HERO_SHOTS}
              ariaLabel="Vista animada del panel de leads y del panel de stock del Sistema +uno"
            />
          </motion.div>
        </Container>
      </motion.div>
    </Section>
  );
}
