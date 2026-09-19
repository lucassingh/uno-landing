import styles from "./Problema.module.css";
import { Section, Container, SectionHeader, SlideCarousel, ScrollReveal } from "@/components/ui";

const DOLORES = [
  { id: "chats", text: "Chats colgados y respuestas que llegan tarde." },
  { id: "canal", text: "No sabés de qué campaña o canal vino cada lead." },
  { id: "mezcla", text: "Curiosos y clientes reales, todos mezclados." },
  { id: "seguimiento", text: "Perdés el seguimiento. Se te escapa la venta." },
];

export function Problema() {
  return (
    <Section id="problema" bg="default" contained={false} className={styles.problema}>
      <Container>
        <ScrollReveal>
          <SectionHeader
            eyebrow="una dificultad común"
            title="invertís en tráfico y se te pierde en el camino."
            intro="Entra gente por tus campañas, tu Instagram, tu web… y todo termina en un WhatsApp desordenado que se contesta tarde. No sabés de dónde vino cada consulta ni cuáles valen la pena."
          />
        </ScrollReveal>
      </Container>
      <Container wide className={styles.carouselWrap}>
        <ScrollReveal delay={0.1}>
          <SlideCarousel items={DOLORES} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
