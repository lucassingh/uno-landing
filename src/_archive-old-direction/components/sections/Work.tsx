import styles from "./Work.module.css";
import { Section, SectionHeader, Grid, Col, Placeholder, Tag } from "@/components/ui";
import { site } from "@/content/site";

const spanByRatio = { square: 4, portrait: 4, landscape: 8, wide: 8 } as const;

export function Work() {
  const { work } = site;
  return (
    <Section id={work.meta.id} bg="alt">
      <SectionHeader eyebrow={work.meta.eyebrow} title={work.meta.title} intro={work.meta.intro} />
      <Grid>
        {work.items.map((item) => (
          <Col key={item.id} span={12} md={spanByRatio[item.ratio]}>
            <figure className={styles.item}>
              <Placeholder ratio={item.ratio} label={item.title} />
              <figcaption className={styles.cap}>
                <Tag>{item.category}</Tag>
                <span className={styles.title}>{item.title}</span>
              </figcaption>
            </figure>
          </Col>
        ))}
      </Grid>
    </Section>
  );
}
