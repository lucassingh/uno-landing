import { Section, SectionHeader, ScrollReveal } from "@/components/ui";
import { SystemMapaBento } from "./SystemMapaBento";

export function SystemMapa() {
  return (
    <Section id="mapa" bg="default">
      <ScrollReveal>
        <SectionHeader
          eyebrow="cómo funciona"
          title="captá. filtrá. ordená. repetí."
          intro="capas que trabajan juntas, leads clasificados por temperatura y la ganancia, bien a la vista."
        />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <SystemMapaBento />
      </ScrollReveal>
    </Section>
  );
}
