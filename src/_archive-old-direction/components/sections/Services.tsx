import styles from "./Services.module.css";
import { Section, SectionHeader, Grid, Col, Card, Tag } from "@/components/ui";
import { site } from "@/content/site";

export function Services() {
  const { services } = site;
  return (
    <Section id={services.meta.id}>
      <SectionHeader eyebrow={services.meta.eyebrow} title={services.meta.title} intro={services.meta.intro} />
      <Grid>
        {services.items.map((service) => (
          <Col key={service.id} span={12} md={6}>
            <Card raised className={styles.card}>
              <div className={styles.head}>
                <Tag>{service.code}</Tag>
                <h3 className={styles.name}>{service.name}</h3>
                <p className={styles.tagline}>{service.tagline}</p>
              </div>
              <p className={styles.desc}>{service.description}</p>
              <ul className={styles.features}>
                {service.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <span className={styles.arrow}>→</span> {feature}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Grid>
    </Section>
  );
}
