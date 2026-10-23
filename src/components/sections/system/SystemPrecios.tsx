import styles from "./SystemPrecios.module.css";
import { Section, SectionHeader, Grid, Col, Card, Button, AsteriskIcon, ScrollReveal } from "@/components/ui";
import { cn } from "@/lib/utils";

// Un solo plan: el Sistema +uno. Antes convivían "Sistema +uno" e "Integral" (sistema + web);
// ahora el precio es SOLO del sistema — la web se cotiza aparte en la landing principal. El
// "desde" deja la puerta abierta a negociar el setup según la operación de cada negocio; el
// soporte mensual es fijo. El CTA lleva a contacto, no a /#precios.
const PLAN = {
  name: "Sistema +uno",
  nickname: "que no se escape una venta",
  priceLead: "setup desde",
  priceMain: "USD 3.000",
  note: "+ soporte USD 250/mes",
  description:
    "El asistente con IA que atiende y califica en tus canales, el mini-CRM que ordena cada lead y el módulo de stock que ordena tu inventario. Todo el sistema, un solo criterio.",
  negotiation: "El número final del setup se arma con vos, según tus canales, tu catálogo y tu equipo.",
  cta: { label: "Armar mi sistema", href: "#contacto" },
};

// Todas las características del sistema, agrupadas por capa (mismo orden que la página).
const FEATURE_GROUPS: { index: string; label: string; features: string[] }[] = [
  {
    index: "01",
    label: "asistente",
    features: [
      "Asistente IA en WhatsApp, Instagram Direct y Messenger",
      "Entiende lenguaje natural y responde con tu catálogo y tus precios",
      "Filtro y calificación automática: frío, tibio o caliente",
      "Reglas de calificación configuradas para tu rubro",
    ],
  },
  {
    index: "02",
    label: "panel · crm",
    features: [
      "Mini-CRM visual: tablero con etapas a tu medida",
      "La charla completa de cada lead, en su ficha",
      "Métricas y actividad del día, de un vistazo",
      "Leads de formularios, Meta Ads, TikTok y Tienda Nube",
    ],
  },
  {
    index: "03",
    label: "stock",
    features: [
      "Productos y variantes (SKU), con categorías y subcategorías",
      "Atributos configurables por rubro",
      "Movimientos con historial e importaciones masivas",
      "Alertas de stock bajo",
    ],
  },
  {
    index: "04",
    label: "equipo y soporte",
    features: [
      "Roles por persona: dueño, encargado, vendedor",
      "Datos separados por negocio y login seguro",
      "Panel web, sin instalar nada — compu o celular",
      "Acompañamiento continuo y mejoras",
    ],
  },
];

export function SystemPrecios() {
  return (
    <Section id="precios" bg="alt">
      <ScrollReveal>
        <SectionHeader
          eyebrow="cómo se cobra"
          title="un setup a tu medida. un soporte fijo. sin sorpresas."
          intro="El setup arma tu motor: conecta tus canales, carga tu catálogo y deja todo funcionando. El soporte cubre el hosting, el uso de IA y que el sistema siga andando y mejorando. El primer mes de soporte va por nuestra cuenta."
          className={styles.header}
        />
      </ScrollReveal>
      <Grid>
        <Col span={12}>
          <ScrollReveal>
            <Card className={cn(styles.plan, styles.cardInvert)}>
              <div className={styles.summary}>
                <div className={styles.head}>
                  <h3 className={styles.name}>{PLAN.name}</h3>
                  <span className={styles.nick}>&ldquo;{PLAN.nickname}&rdquo;</span>
                </div>

                <div className={styles.priceRow}>
                  <span className={styles.priceLead}>{PLAN.priceLead}</span>
                  <span className={styles.priceMain}>{PLAN.priceMain}</span>
                  <span className={styles.note}>{PLAN.note}</span>
                </div>

                <p className={styles.desc}>{PLAN.description}</p>
                <p className={styles.negotiation}>{PLAN.negotiation}</p>

                <Button href={PLAN.cta.href} variant="primary" className={styles.cta}>
                  {PLAN.cta.label}
                </Button>
              </div>

              <div className={styles.groups}>
                {FEATURE_GROUPS.map((group) => (
                  <div key={group.index} className={styles.group}>
                    <h4 className={styles.groupLabel}>
                      <span className={styles.groupIndex}>{group.index}</span>
                      {group.label}
                    </h4>
                    <ul className={styles.features}>
                      {group.features.map((feature) => (
                        <li key={feature} className={styles.feature}>
                          <AsteriskIcon size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        </Col>
      </Grid>
    </Section>
  );
}
