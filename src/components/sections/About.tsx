import styles from "./About.module.css";
import { TextReveal } from "@/components/ui";

// texto CORTO a propósito: tiene que leerse entero mientras el bloque está pineado en el viewport
// (como nexstudio: menos texto, fuente más grande).
// 2026-10-24: reescrito sin la pata de leads/bot (Sistema +uno pospuesto) — ahora web + apps
// a medida, con la infra a nuestro cargo.
const PROSE =
  "Somos un equipo, no una agencia. " +
  "Diseñamos y programamos webs y apps a medida, sin capas de por medio. " +
  "Nada de plantillas: cada proyecto, desde cero. " +
  "La infra corre por nuestra cuenta. " +
  "El lanzamiento no es el final: ahí arrancamos.";

// frases-ancla que se encienden en amarillo (match exacto con su puntuación)
const ACCENT = ["equipo,", "agencia.", "medida,", "plantillas:", "cero.", "final:", "arrancamos."];

export function About() {
  return (
    <section id="nosotros" className={styles.sec}>
      <TextReveal text={PROSE} className={styles.prose} accentWords={ACCENT} />
    </section>
  );
}
