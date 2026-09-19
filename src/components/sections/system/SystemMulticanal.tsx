import { Section, SectionHeader, ScrollReveal } from "@/components/ui";
import { SystemMulticanalBento } from "./SystemMulticanalBento";

export function SystemMulticanal() {
  return (
    <Section id="multicanal" bg="default">
      <ScrollReveal>
        <SectionHeader
          eyebrow="todos tus canales, un solo lugar"
          title="no importa por dónde te escriban."
          intro="Separamos dos cosas que no son lo mismo: los canales donde tu asistente conversa, y las fuentes de leads que simplemente te avisan que alguien entró."
        />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <SystemMulticanalBento />
      </ScrollReveal>
    </Section>
  );
}
