"use client";

import { useState, type FormEvent } from "react";
import styles from "./CtaFinal.module.css";
import { Section, Container, Grid, Col, Card, Button, Grainient, Eyebrow, AsteriskIcon, ScrollReveal } from "@/components/ui";

type Status = "idle" | "sending" | "sent";

const EXPECT = [
  "Un repaso tranquilo de cómo trabajamos, sin presión de venta.",
  "Ejemplos reales de proyectos parecidos al tuyo.",
  "Un vistazo rápido a planes, precios y qué incluye cada uno.",
  "Respuestas directas sobre tiempos, alcance y acompañamiento.",
];

function CheckIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={styles.selectChevron}
    >
      <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CtaFinal() {
  const [status, setStatus] = useState<Status>("idle");

  // simulado — todavía no hay backend conectado, ver nota en el submit
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  }

  return (
    <Section id="contacto" contained={false} className={styles.cta}>
      <div className={styles.bg} aria-hidden="true">
        {/* Grainient se reescribió (ver components/ui/Grainient.tsx) con una API más chica:
            ya no existen warpSpeed/blendAngle/noiseScale/saturation/zoom/rotationAmount del
            playground de reactbits original, así que no se puede calcar 1:1 el link que
            pasaste — mapeado a lo que sí tiene equivalente (colores, warpAmplitude,
            blendSoftness, centerX/Y) y timeSpeed/warpFrequency/warpStrength/grainScale
            elegidos a ojo para un movimiento cálido y no muy agresivo. Ajustable. */}
        <Grainient
          color1="#FFD300"
          color2="#FFFAE1"
          color3="#E1C330"
          timeSpeed={0.6}
          warpFrequency={2.5}
          warpAmplitude={80}
          warpStrength={1.6}
          blendSoftness={0.32}
          centerX={-0.06}
          centerY={0.19}
          grainScale={1.4}
        />
      </div>
      <Container className={styles.inner}>
        <Grid className={styles.grid}>
          <Col span={12} md={6}>
            <ScrollReveal direction="left">
            <h2 className={styles.title}>
              <span>hablemos de tu proyecto,</span>
              <span>sin apuro ni vueltas.</span>
            </h2>

            <div className={styles.expect}>
              <Eyebrow>qué esperar de la charla</Eyebrow>
              <ul className={styles.expectList}>
                {EXPECT.map((text) => (
                  <li key={text} className={styles.expectItem}>
                    <AsteriskIcon size={16} className={styles.expectIcon} />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            </ScrollReveal>
          </Col>

          <Col span={12} md={6}>
            <ScrollReveal direction="right">
            <Card raised className={styles.formCard}>
              {status === "sent" ? (
                <div className={styles.success} role="status" aria-live="polite">
                  <span className={styles.successIcon}>
                    <CheckIcon />
                  </span>
                  <p className={styles.successText}>¡Recibido! Te respondemos a la brevedad.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <h3 className={styles.formTitle}>reservá tu charla de 30 minutos</h3>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="cta-nombre">
                        Nombre
                      </label>
                      <input className={styles.input} id="cta-nombre" name="nombre" type="text" required />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="cta-apellido">
                        Apellido
                      </label>
                      <input className={styles.input} id="cta-apellido" name="apellido" type="text" required />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="cta-email">
                      Email
                    </label>
                    <input className={styles.input} id="cta-email" name="email" type="email" required />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="cta-canal">
                      ¿Cómo nos conociste?
                    </label>
                    <div className={styles.selectWrap}>
                      <select className={styles.select} id="cta-canal" name="canal" defaultValue="">
                        <option value="" disabled>
                          Elegí una opción
                        </option>
                        <option value="web">Web</option>
                        <option value="instagram">Instagram</option>
                        <option value="referido">Me invitó un amigo</option>
                      </select>
                      <ChevronIcon />
                    </div>
                  </div>

                  <p className={styles.fineprint}>
                    Usamos estos datos solo para contactarte por tu proyecto.
                    <br />
                    Sin spam, nunca.
                  </p>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className={styles.submit}
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Enviando…" : "Reservar mi charla"}
                  </Button>
                </form>
              )}
            </Card>
            </ScrollReveal>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
}
