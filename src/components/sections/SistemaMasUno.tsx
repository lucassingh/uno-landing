"use client";

import { useState } from "react";
import styles from "./SistemaMasUno.module.css";
import { Section, Container, SectionHeader, CardSwap, CardSwapCard, Button, ScrollReveal } from "@/components/ui";

const PASOS = [
  {
    id: "capta",
    text: "Una landing a medida, liviana y directa al grano: nada de plantillas ni relleno, solo lo necesario para que el visitante haga clic.",
    img: "/system/hero/dashboard-crm.png",
    alt: "Panel de leads del Sistema +uno",
  },
  {
    id: "filtra",
    text: "Responde al toque, entiende lenguaje natural y separa en segundos quién solo mira de quien realmente quiere comprar.",
    img: "/system/hero/dashboard-kanban.png",
    alt: "Tablero de leads organizados por estado del Sistema +uno",
  },
  {
    id: "ordena",
    text: "Un tablero simple donde cada consulta queda clasificada por origen y urgencia, listo para que decidas a quién llamar primero.",
    img: "/system/hero/dashboard-stock.png",
    alt: "Panel de stock del Sistema +uno",
  },
];

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
      </Container>
    </Section>
  );
}
