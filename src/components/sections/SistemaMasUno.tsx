"use client";

import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import styles from "./SistemaMasUno.module.css";
import { Section, Container, SectionHeader, CardSwap, CardSwapCard, Button, ScrollReveal } from "@/components/ui";
import { BrowserShowcase } from "./system/BrowserShowcase";
import { cn } from "@/lib/utils";

const PASOS = [
  {
    id: "capta",
    label: "captá",
    text: "Una landing a medida, liviana y directa al grano: nada de plantillas ni relleno, solo lo necesario para que el visitante haga clic.",
    img: "/system/hero/dashboard-crm.png",
    alt: "Panel de leads del Sistema +uno",
  },
  {
    id: "filtra",
    label: "filtrá",
    text: "Responde al toque, entiende lenguaje natural y separa en segundos quién solo mira de quien realmente quiere comprar.",
    img: "/system/hero/dashboard-kanban.png",
    alt: "Tablero de leads organizados por estado del Sistema +uno",
  },
  {
    id: "ordena",
    label: "ordená",
    text: "Un tablero simple donde cada consulta queda clasificada por origen y urgencia, listo para que decidas a quién llamar primero.",
    img: "/system/hero/dashboard-stock.png",
    alt: "Panel de stock del Sistema +uno",
  },
];

const SHOTS = PASOS.map((p) => ({ id: p.id, src: p.img }));
/** cuánto queda cada paso en pantalla en el autoplay mobile (lo dura la barrita de la pestaña). */
const MOBILE_STEP_MS = 5500;

/**
 * Versión MOBILE del mazo (que en un celular no se apreciaba: tres capturas inclinadas,
 * achicadas y cortadas contra el borde). Mismo contenido, otra forma: pestañas captá · filtrá ·
 * ordená + UNA captura plana en el mismo mockup de browser que usa /system + el texto del paso.
 * Avanza sola (la barrita de la pestaña activa marca el tiempo, mismo mecanismo CSS que el
 * carrusel de Problema) solo mientras está en pantalla; apenas el usuario toca una pestaña, el
 * autoplay se apaga y manda él.
 */
function MobileSteps({ active, onChange }: { active: number; onChange: (i: number) => void }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [autoplay, setAutoplay] = useState(true);
  const current = PASOS[active]!;
  const playing = autoplay && !shouldReduceMotion;

  return (
    <div ref={ref} className={styles.mobileSteps}>
      <div className={styles.stepTabs} role="tablist" aria-label="Las tres partes del sistema">
        {PASOS.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`sistema-tab-${p.id}`}
              aria-selected={isActive}
              aria-controls="sistema-step-panel"
              className={cn(styles.stepTab, isActive && styles.stepTabActive)}
              onClick={() => {
                setAutoplay(false);
                onChange(i);
              }}
            >
              <span className={styles.stepTabIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.stepTabLabel}>{p.label}</span>
              {isActive && playing ? (
                <span
                  key={active}
                  className={cn(styles.stepTabFill, !inView && styles.stepTabFillPaused)}
                  style={{ animationDuration: `${MOBILE_STEP_MS}ms` }}
                  onAnimationEnd={() => onChange((active + 1) % PASOS.length)}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div id="sistema-step-panel" role="tabpanel" aria-labelledby={`sistema-tab-${current.id}`}>
        <BrowserShowcase shots={SHOTS} activeIndex={active} ariaLabel={current.alt} />
        <p key={active} className={styles.mobileStepText}>{current.text}</p>
      </div>

      <Button href="/system" variant="primary" className={styles.mobileCta}>
        ver el sistema por dentro →
      </Button>
    </div>
  );
}

export function SistemaMasUno() {
  const [active, setActive] = useState(0);
  const current = PASOS[active]!;

  return (
    <Section id="sistema" bg="default" contained={false} className={styles.sistema}>
      {/* misma receta que .grid en Hero.module.css: dos columnas de grid dentro del Container
          wide — el texto no puede "perder" ancho a manos de las cards porque son tracks
          separados, y la columna del mazo puede sangrar más allá de SU propio borde derecho
          (overflow:visible) sin arriesgarse a invadir nunca la columna de texto. */}
      <Container wide className={styles.layout}>
        <ScrollReveal direction="left" className={styles.textCol}>
          <SectionHeader
            eyebrow="el sistema +uno"
            title="captá. filtrá. ordená."
            intro="Un sistema de ventas llave en mano: la web que trae, la IA que atiende, el panel que ordena."
            size="lg"
          />
          <p key={active} className={styles.stepText}>{current.text}</p>
          <div className={styles.ctaRow}>
            <Button href="/system" variant="primary">ver el sistema por dentro →</Button>
          </div>
        </ScrollReveal>

        {/* desktop: mazo 3D. Las dos versiones viven siempre en el DOM y el corte es puro CSS
            (mismo criterio que Proyectos) — sin salto de hidratación. El mazo oculto no cicla:
            su IntersectionObserver nunca lo ve en pantalla. */}
        <div className={styles.deckCol}>
          <div className={styles.deckStage}>
            {/* pisos originales (480/380px) desbordaban en celulares angostos (<480px de
                viewport) — el coeficiente vw queda igual que antes (recién entra en juego
                arriba de los ~960px de ancho de pantalla), solo se bajó el piso mínimo. */}
            <CardSwap
              width="clamp(260px, 50vw, 960px)"
              height="clamp(210px, 40vw, 740px)"
              cardDistance={140}
              verticalDistance={120}
              skewAmount={9}
              delay={5800}
              dropDistance={260}
              onActiveChange={setActive}
            >
              {PASOS.map((p) => (
                <CardSwapCard key={p.id}>
                  <img src={p.img} alt={p.alt} className={styles.deckImg} />
                </CardSwapCard>
              ))}
            </CardSwap>
          </div>
        </div>

        <MobileSteps active={active} onChange={setActive} />
      </Container>
    </Section>
  );
}
