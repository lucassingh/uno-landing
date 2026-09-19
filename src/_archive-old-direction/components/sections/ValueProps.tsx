import styles from "./ValueProps.module.css";
import { Section, SectionHeader, ScrollStack, ScrollStackItem } from "@/components/ui";
import { site } from "@/content/site";
import { colorVar } from "@/lib/theme";

export function ValueProps() {
  const { valueProps } = site;
  return (
    <Section id={valueProps.meta.id} bg="default" className={styles.section}>
      <div className={styles.content}>
        <SectionHeader eyebrow={valueProps.meta.eyebrow} title={valueProps.meta.title} intro={valueProps.meta.intro} />
        <ScrollStack
          itemDistance={60}
          itemScale={0.025}
          itemStackDistance={18}
          stackPosition="18%"
          scaleEndPosition="8%"
          baseScale={0.92}
        >
          {valueProps.items.map((item) => (
            <ScrollStackItem key={item.id} itemClassName={styles.card}>
              <span className={styles.dot} style={{ background: colorVar[item.accent] }} />
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </Section>
  );
}
