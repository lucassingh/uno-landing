import styles from "./SystemAsistente.module.css";
import { Section, Eyebrow, ScrollReveal } from "@/components/ui";
import { SystemAsistenteShowcase } from "./SystemAsistenteShowcase";

export function SystemAsistente() {
  return (
    <Section id="asistente" bg="default">
      <ScrollReveal>
        <header className={styles.header}>
          <Eyebrow>el asistente que filtra y atiende</Eyebrow>
          <h2 className={styles.title}>entiende lenguaje natural, no botones de menú.</h2>
          <p className={styles.intro}>
            Nada de &ldquo;marque 1 para ventas&rdquo;. Tu asistente lee el mensaje, entiende qué te
            están pidiendo y responde como alguien que sabe del negocio — porque lo configurás vos.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SystemAsistenteShowcase />
      </ScrollReveal>
    </Section>
  );
}
