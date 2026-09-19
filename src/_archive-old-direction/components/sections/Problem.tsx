import styles from "./Problem.module.css";
import { Section, Container, Eyebrow, Grid, Col } from "@/components/ui";
import { site } from "@/content/site";
import { colorVar } from "@/lib/theme";

export function Problem() {
  const { problem } = site;

  return (
    <Section id="problema" bg="invert">
      <Container>
        <header className={styles.header}>
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className={styles.title}>
            {problem.titleLines.map((line, i) => (
              <span key={i} className={styles.titleLine}>
                {line}
              </span>
            ))}
          </h2>
        </header>
        <Grid className={styles.grid}>
          {problem.points.map((point) => (
            <Col key={point.title} span={12} md={6} className={styles.col}>
              <article className={styles.card}>
                <span className={styles.dot} style={{ background: colorVar[point.accent] }} />
                <h3 className={styles.cardTitle}>{point.title}</h3>
                <p className={styles.cardText}>{point.text}</p>
              </article>
            </Col>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
