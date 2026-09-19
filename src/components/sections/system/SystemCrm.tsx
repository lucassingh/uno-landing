import styles from "./SystemCrm.module.css";
import { Section, Container, SectionHeader, ScrollReveal } from "@/components/ui";
import { BrowserShowcase } from "./BrowserShowcase";

const CRM_SHOTS = [{ id: "kanban", src: "/system/hero/dashboard-kanban.png" }];

export function SystemCrm() {
  return (
    <Section id="crm" bg="default" contained={false}>
      <Container>
        <ScrollReveal>
          <SectionHeader
            eyebrow="el panel que ordena"
            title="un tablero, no una planilla de excusas."
            intro="Etapas a tu medida, la charla completa de cada lead, métricas que se leen en 10 segundos y la actividad de hoy — todo en el mismo panel."
          />
        </ScrollReveal>
      </Container>

      <Container wide className={styles.showcaseWrap}>
        <ScrollReveal delay={0.1}>
          <BrowserShowcase shots={CRM_SHOTS} ariaLabel="Vista del panel de leads del Sistema +uno, organizado en columnas por etapa" />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
