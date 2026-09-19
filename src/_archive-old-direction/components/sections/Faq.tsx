import styles from "./Faq.module.css";
import { Section, SectionHeader } from "@/components/ui";
import { site } from "@/content/site";

export function Faq() {
  const { faq } = site;
  return (
    <Section id={faq.meta.id}>
      <SectionHeader eyebrow={faq.meta.eyebrow} title={faq.meta.title} />
      <div className={styles.list}>
        {faq.items.map((item) => (
          <details key={item.q} className={styles.item}>
            <summary className={styles.q}>
              <span>{item.q}</span>
              <span className={styles.icon} aria-hidden="true">+</span>
            </summary>
            <p className={styles.a}>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
