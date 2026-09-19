import styles from "./CtaFinal.module.css";
import { Section, Button } from "@/components/ui";
import { site } from "@/content/site";

export function CtaFinal() {
  const { cta } = site;
  return (
    <Section id="contacto" bg="accent" className={styles.cta}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{cta.title}</h2>
        <p className={styles.intro}>{cta.intro}</p>
        <div className={styles.actions}>
          <Button href={cta.primary.href} variant="primary" size="lg">
            {cta.primary.label}
          </Button>
          <Button href={cta.secondary.href} variant="outline" size="lg">
            {cta.secondary.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
