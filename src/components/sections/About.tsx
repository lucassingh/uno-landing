import styles from "./About.module.css";
import { TextReveal } from "@/components/ui";

// texto CORTO a propósito: tiene que leerse entero mientras el bloque está pineado en el viewport
// (como nexstudio: menos texto, fuente más grande).
const PROSE =
  "Somos un equipo, no una agencia. Código y diseño, sin capas de por medio. " +
  "Nada de plantillas: cada proyecto, desde cero. " +
  "No hacemos pauta, pero no perdemos un lead. " +
  "El lanzamiento no es el final: ahí arrancamos.";

// frases-ancla que se encienden en amarillo (match exacto con su puntuación)
const ACCENT = ["equipo,", "agencia.", "plantillas:", "cero.", "final:", "arrancamos."];

export function About() {
  return (
    <section id="nosotros" className={styles.sec}>
      <TextReveal text={PROSE} className={styles.prose} accentWords={ACCENT} />
    </section>
  );
}
