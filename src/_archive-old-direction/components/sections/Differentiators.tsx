import styles from "./Differentiators.module.css";
import { Section, SectionHeader } from "@/components/ui";
import { site } from "@/content/site";

export function Differentiators() {
  const { differentiators } = site;
  return (
    <Section id={differentiators.meta.id}>
      <SectionHeader eyebrow={differentiators.meta.eyebrow} title={differentiators.meta.title} />
      <ul className={styles.list}>
        {differentiators.items.map((item, i) => (
          <li key={item.title} className={styles.row}>
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
