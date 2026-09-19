"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./FaqAccordion.module.css";
import { cn } from "@/lib/utils";
import { Section } from "./Section";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Card } from "./Card";
import { DotGrid } from "./DotGrid";
import { ScrollReveal } from "./ScrollReveal";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqAccordionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  items: FaqItem[];
}

type IndexedItem = { item: FaqItem; index: number };

function FaqColumn({
  items,
  openIndex,
  onToggle,
}: {
  items: IndexedItem[];
  openIndex: number | null;
  onToggle: (index: number) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <ul className={styles.list}>
      {items.map(({ item, index }) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-q-${index}`;
        return (
          <li key={item.q} className={styles.item}>
            <button
              type="button"
              id={buttonId}
              className={styles.q}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(index)}
            >
              <span>{item.q}</span>
              <span className={cn(styles.icon, isOpen && styles.iconOpen)} aria-hidden="true">
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.answerWrap}
                  initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <p className={styles.a}>{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Sección de FAQ reutilizable: fondo DotGrid full-bleed + card con el acordeón repartido en 2
 * columnas parejas. Antes esto vivía duplicado — Faq.tsx (home, 1 columna) y SystemFaq.tsx
 * (/system, <details> nativo sin DotGrid) — ahora ambos son wrappers finitos de este componente,
 * cada uno con su propio título/intro/preguntas.
 */
export function FaqAccordion({ id = "faq", eyebrow, title, intro, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const indexed: IndexedItem[] = items.map((item, index) => ({ item, index }));
  const half = Math.ceil(indexed.length / 2);
  const columns = [indexed.slice(0, half), indexed.slice(half)];

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <Section id={id} bg="default" contained={false} className={styles.faq}>
      <div className={styles.bg} aria-hidden="true">
        <DotGrid gap={9} dotSize={3} proximity={90} baseColor="#031844" activeColor="#3A10E5" />
      </div>
      <Container className={styles.inner}>
        <ScrollReveal>
          <Card raised className={styles.listCard}>
            <SectionHeader eyebrow={eyebrow} nowrap size="sm" title={title} intro={intro} />
            <div className={styles.lists}>
              {columns.map((col, i) => (
                <FaqColumn key={i} items={col} openIndex={openIndex} onToggle={handleToggle} />
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
