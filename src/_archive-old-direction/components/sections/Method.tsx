import styles from "./Method.module.css";
import { Section, SectionHeader, Grid, Col } from "@/components/ui";
import { site } from "@/content/site";

export function Method() {
  const { method } = site;
  return (
    <Section id={method.meta.id} bg="alt">
      <SectionHeader eyebrow={method.meta.eyebrow} title={method.meta.title} intro={method.meta.intro} />
      <Grid>
        {method.steps.map((step) => (
          <Col key={step.n} span={12} md={4}>
            <article className={styles.step}>
              <span className={styles.num}>{step.n}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </article>
          </Col>
        ))}
      </Grid>
    </Section>
  );
}
