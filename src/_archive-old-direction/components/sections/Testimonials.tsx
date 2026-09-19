import styles from "./Testimonials.module.css";
import { Section, SectionHeader, Grid, Col, Card } from "@/components/ui";
import { site } from "@/content/site";

export function Testimonials() {
  const { testimonials } = site;
  return (
    <Section id={testimonials.meta.id}>
      <SectionHeader eyebrow={testimonials.meta.eyebrow} title={testimonials.meta.title} />
      <Grid>
        {testimonials.items.map((item, i) => (
          <Col key={i} span={12} md={4}>
            <Card raised className={styles.card}>
              <blockquote className={styles.quote}>{item.quote}</blockquote>
              <footer className={styles.who}>
                <span className={styles.author}>{item.author}</span>
                <span className={styles.role}>{item.role}</span>
              </footer>
            </Card>
          </Col>
        ))}
      </Grid>
    </Section>
  );
}
