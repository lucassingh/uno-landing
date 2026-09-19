import styles from "./SystemPrecios.module.css";
import { Section, SectionHeader, Grid, Col, Card, Button, Tag, AsteriskIcon, ScrollReveal } from "@/components/ui";
import { cn } from "@/lib/utils";

type Tone = "accent" | "invert";

interface Plan {
  id: string;
  name: string;
  nickname: string;
  priceLead?: string;
  priceMain: string;
  note: string;
  description: string;
  features: string[];
  tone: Tone;
  highlighted?: boolean;
  cta: { label: string; href: string };
}

// Planes del Sistema +uno (Pilar 2). Viven acá, en /system: el pricing de la landing
// principal ya no lista planes de sistema (solo web + horas), así que el CTA del pie
// lleva a contacto, no a /#precios.
const PLANS: Plan[] = [
  {
    id: "sistema",
    name: "Sistema +uno",
    nickname: "que no se escape una venta",
    priceLead: "setup",
    priceMain: "USD 600–1.200",
    note: "+ abono USD 250/mes",
    description: "El asistente con IA en WhatsApp que filtra y califica, más el mini-CRM que ordena cada lead solo.",
    features: [
      "Asistente IA en WhatsApp",
      "Filtro y calificación automática",
      "Mini-CRM visual (tablero)",
      "Integración multicanal",
    ],
    tone: "invert",
    cta: { label: "Quiero automatizar", href: "#contacto" },
  },
  {
    id: "integral",
    name: "Sistema Integral",
    nickname: "el combo completo",
    priceLead: "desde",
    priceMain: "USD 1.500–3.000",
    note: "+ abono USD 350/mes",
    description: "La web que capta + el asistente que filtra + el panel que ordena. Todo el sistema, un solo criterio.",
    features: [
      "Landing o sitio a medida",
      "Asistente IA en WhatsApp",
      "Mini-CRM visual + módulo de stock",
      "Acompañamiento continuo",
    ],
    tone: "accent",
    highlighted: true,
    cta: { label: "Armar mi sistema", href: "#contacto" },
  },
];

const TONE_CLASS: Record<Tone, string | undefined> = {
  accent: styles.cardAccent,
  invert: styles.cardInvert,
};

export function SystemPrecios() {
  return (
    <Section id="precios" bg="alt">
      <ScrollReveal>
        <SectionHeader
          eyebrow="cómo se cobra"
          title="un setup, y después un abono. sin sorpresas."
          intro="El setup arma tu motor: conecta tus canales, carga tu catálogo y deja todo funcionando. El abono cubre el hosting, el uso de IA y que el sistema siga andando y mejorando. El primer mes de abono va por nuestra cuenta."
          className={styles.header}
        />
      </ScrollReveal>
      <Grid>
        {PLANS.map((plan, i) => (
          <Col key={plan.id} span={12} md={6}>
            <ScrollReveal direction={i === 0 ? "left" : "right"}>
            <Card className={cn(styles.plan, TONE_CLASS[plan.tone])}>
              {plan.highlighted ? <Tag className={styles.badge}>más elegido</Tag> : null}

              <div className={styles.head}>
                <h3 className={styles.name}>{plan.name}</h3>
                <span className={styles.nick}>&ldquo;{plan.nickname}&rdquo;</span>
              </div>

              <div className={styles.priceRow}>
                {plan.priceLead ? <span className={styles.priceLead}>{plan.priceLead}</span> : null}
                <span className={styles.priceMain}>{plan.priceMain}</span>
                <span className={styles.note}>{plan.note}</span>
              </div>

              <p className={styles.desc}>{plan.description}</p>

              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <AsteriskIcon size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button href={plan.cta.href} variant="primary" className={styles.cta}>
                {plan.cta.label}
              </Button>
            </Card>
            </ScrollReveal>
          </Col>
        ))}
      </Grid>
    </Section>
  );
}
