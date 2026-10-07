"use client";

import { useState } from "react";
import styles from "./Testimonials.module.css";
import { Section, SectionHeader, Grid, Col, Card, TypeText, ScrollReveal } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

// mismos clientes ficticios que Proyectos (Almenar, Trigo, Faro) — un solo universo de placeholders
// en vez de inventar nombres nuevos acá. Contenido real pendiente, como Pricing.
const TESTIMONIOS: Testimonial[] = [
  {
    id: "almenar",
    name: "Marina Alsina",
    role: "Contadora, Estudio Almenar",
    quote:
      "Dejamos de perder turnos por WhatsApp cruzado. La calculadora de honorarios sola nos ahorra media hora por consulta, y eso que discutimos cada coma del texto.",
  },
  {
    id: "trigo",
    name: "Nico Ferreyra",
    role: "Dueño, Panadería Trigo",
    quote:
      "Subo el catálogo un domingo a la noche y el lunes ya está andando. No necesito llamar a nadie para cambiar un precio, y eso para mí vale más que cualquier animación.",
  },
  {
    id: "faro",
    name: "Valeria Sosa",
    role: "Directora, Consultora Faro",
    quote:
      "Vinimos por una web y nos fuimos con una marca entera. La reunión de escuchar duró una hora y se notó en cada decisión de ahí en adelante.",
  },
  {
    id: "hilo",
    name: "Bruno Ledesma",
    role: "Dueño, Sastrería Hilo",
    quote:
      "No teníamos identidad, competíamos solo por precio. Ahora tenemos marca propia y una web que nos hace ver tan bien como cosemos — la gente nos busca por nombre, no de casualidad.",
  },
  {
    id: "cauce",
    name: "Renata Quiroga",
    role: "Fundadora, Estudio Cauce",
    quote:
      "Antes explicábamos quiénes éramos en cada reunión. Ahora mandamos el link y listo — la marca hace ese trabajo sola.",
  },
  {
    id: "delnorte",
    name: "Emiliano Roca",
    role: "Gerente, Distribuidora del Norte",
    quote:
      "No existíamos en internet. Hoy nos encuentran clientes que ni sabíamos que estaban buscándonos, y el WhatsApp ya no se nos llena de curiosos.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const [activeId, setActiveId] = useState(TESTIMONIOS[0]!.id);
  const active = TESTIMONIOS.find((t) => t.id === activeId)!;

  return (
    <Section id="testimonios" bg="default">
      <ScrollReveal>
        <SectionHeader
          nowrap
          title="mejor que lo cuenten ellos"
          intro="Nada de frases genéricas: esto es lo que nos dicen después de laburar juntos."
        />
      </ScrollReveal>
      <Grid className={styles.gridGap}>
        <Col span={12} md={6} className={styles.listCol}>
          <ScrollReveal direction="left">
          <Card raised className={styles.listCard}>
            <ul className={styles.list}>
              {TESTIMONIOS.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={cn(styles.item, isActive && styles.itemActive)}
                      aria-current={isActive}
                      onClick={() => setActiveId(t.id)}
                    >
                      <span className={styles.avatar} aria-hidden="true">
                        {initials(t.name)}
                      </span>
                      <span className={styles.who}>
                        <span className={styles.name}>{t.name}</span>
                        <span className={styles.role}>{t.role}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
          </ScrollReveal>
        </Col>
        <Col span={12} md={6}>
          <ScrollReveal direction="right">
          {/* mobile: la lista de la izquierda (oculta ahí) se apila ARRIBA de la cita y tocar un
              nombre cambiaba un texto que quedaba fuera de pantalla. En su lugar, una fila de
              avatares pegada a la cita — selector y resultado en la misma pantalla. */}
          <div className={styles.mobilePicker} role="group" aria-label="Elegí un testimonio">
            {TESTIMONIOS.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={cn(styles.mobileAvatar, isActive && styles.mobileAvatarActive)}
                  aria-label={`${t.name}, ${t.role}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveId(t.id)}
                >
                  {initials(t.name)}
                </button>
              );
            })}
          </div>
          <div className={styles.quotePanel}>
            <span className={styles.quoteMark} aria-hidden="true">
              &ldquo;
            </span>
            <div className={styles.quoteBody}>
              <TypeText
                key={active.id}
                as="p"
                text={active.quote}
                typingSpeed={20}
                className={styles.quote}
                aria-hidden="true"
              />
              {/* versión completa y estática para lectores de pantalla — el tipeo de arriba es
                  puramente decorativo (aria-hidden) para no anunciar el texto letra por letra. */}
              <span className={styles.srOnly} aria-live="polite">
                {active.quote}
              </span>
            </div>
            <p className={styles.mobileWho}>
              <span className={styles.name}>{active.name}</span>
              <span className={styles.role}>{active.role}</span>
            </p>
          </div>
          </ScrollReveal>
        </Col>
      </Grid>
    </Section>
  );
}
