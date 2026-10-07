import styles from "./Pricing.module.css";
import { Section, SectionHeader, Grid, Col, Card, Button, Tag, Eyebrow, ScrollReveal } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Plan {
    id: string;
    name: string;
    nickname: string;
    /** calificador chico arriba del monto, ej. "desde" (opcional: el plan a cotizar no lleva) */
    priceLead?: string;
    priceMain: string;
    note: string;
    highlighted?: boolean;
    cta: { label: string; href: string };
}

// PRICING v3 (ver docs/nuevo_plan_negocio/Plan-Comercial-+uno-v3-FINAL.md §6-7):
// tres planes de web por complejidad de producto, en UNA tabla comparativa (no tres cards
// sueltas) — así las tres columnas comparten exactamente el mismo alto por diseño, en vez de
// perseguirlo con CSS. La asesoría (gancho gratis) y el Sistema +uno (que vive en /system)
// van como bloques de cierre aparte. La card de horas de desarrollo es un bloque diferenciado
// aparte. El destacado ("más elegido") vive en Sitio Pro, la mejor relación valor/precio.
const WEB_PLANS: [Plan, Plan, Plan] = [
    {
        id: "landing",
        name: "Landing a medida",
        nickname: "el empujón",
        priceLead: "desde",
        priceMain: "USD 350",
        note: "1 página · estática",
        cta: { label: "Empezar", href: "#contacto" },
    },
    {
        id: "pro",
        name: "Sitio Pro autoadministrable",
        nickname: "la que se maneja sola",
        priceLead: "desde",
        priceMain: "USD 650",
        note: "dinámico · con panel propio",
        highlighted: true,
        cta: { label: "La quiero", href: "#contacto" },
    },
    {
        id: "webapp",
        name: "Web App a medida",
        nickname: "a tu medida, sin techo",
        priceMain: "a cotizar",
        note: "dashboards + integraciones",
        cta: { label: "Cotizar mi proyecto", href: "#contacto" },
    },
];

/** Fila de la matriz comparativa: un hecho por plan, en el mismo orden que WEB_PLANS. */
type CellValue = { text: string } | { state: "yes" | "no" } | { state: "partial"; note: string };

const FEATURE_ROWS: { label: string; values: [CellValue, CellValue, CellValue] }[] = [
    { label: "Diseño a medida, sin plantillas", values: [{ state: "yes" }, { state: "yes" }, { state: "yes" }] },
    {
        label: "Tiempo de entrega estimado",
        values: [{ text: "1-2 semanas" }, { text: "3-5 semanas" }, { text: "a definir" }],
    },
    {
        label: "Revisiones de diseño incluidas",
        values: [{ text: "1 ronda" }, { text: "hasta 3 rondas" }, { text: "según alcance" }],
    },
    {
        label: "Panel para editar el contenido vos mismo",
        values: [{ state: "no" }, { state: "yes" }, { state: "partial", note: "según el proyecto" }],
    },
    {
        label: "Hosting y dominio: te ayudo a dejarlo andando",
        values: [{ state: "yes" }, { state: "yes" }, { state: "yes" }],
    },
    {
        label: "SEO técnico + performance",
        values: [{ state: "no" }, { state: "yes" }, { state: "partial", note: "si aplica" }],
    },
    { label: "Analítica y seguimiento", values: [{ state: "no" }, { state: "yes" }, { state: "yes" }] },
    {
        label: "Blog o sección de novedades",
        values: [{ state: "no" }, { state: "yes" }, { state: "partial", note: "si aplica" }],
    },
    {
        label: "Multilenguaje",
        values: [{ state: "no" }, { state: "partial", note: "si lo necesitás" }, { state: "yes" }],
    },
    { label: "Integraciones con APIs y servicios", values: [{ state: "no" }, { state: "no" }, { state: "yes" }] },
    { label: "Auth, roles y lógica de negocio propia", values: [{ state: "no" }, { state: "no" }, { state: "yes" }] },
    { label: "Backups automáticos", values: [{ state: "no" }, { state: "yes" }, { state: "yes" }] },
    {
        label: "Iteraciones incluidas",
        values: [{ state: "no" }, { state: "yes" }, { state: "partial", note: "según alcance" }],
    },
];

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function PlanCell({ value }: { value: CellValue }) {
    if ("text" in value) {
        return <span className={styles.cellValue}>{value.text}</span>;
    }
    if (value.state === "yes") {
        return (
            <span className={styles.dotYes} aria-label="Incluido">
                <CheckIcon />
            </span>
        );
    }
    if (value.state === "partial") {
        return (
            <span className={styles.cellPartial}>
                <span className={styles.dotPartial} aria-hidden="true" />
                <span className={styles.partialNote}>{value.note}</span>
            </span>
        );
    }
    return (
        <span className={styles.dotNo} aria-label="No incluido">
            &mdash;
        </span>
    );
}

/**
 * Versión MOBILE de la tabla: una card por plan, apiladas. Una matriz de 4 columnas no entra en
 * un celular (ni con scroll lateral: se perdía la columna de etiquetas y no se podía comparar
 * nada). Cada card lista SOLO lo que el plan trae — las specs con valor propio (entrega,
 * revisiones) arriba, después lo incluido y lo parcial con su nota; lo que no incluye se omite
 * (en una card suelta, una lista de "—" es ruido, no información). Mismos datos que la tabla
 * (FEATURE_ROWS), así nunca se desincronizan.
 */
function MobilePlanCards() {
    return (
        <ul className={styles.mPlans}>
            {WEB_PLANS.map((plan, pi) => {
                const specs = FEATURE_ROWS.flatMap((row) => {
                    const v = row.values[pi]!;
                    return "text" in v ? [{ label: row.label, text: v.text }] : [];
                });
                const features = FEATURE_ROWS.flatMap((row) => {
                    const v = row.values[pi]!;
                    if ("text" in v || v.state === "no") return [];
                    return [{ label: row.label, note: v.state === "partial" ? v.note : undefined }];
                });

                return (
                    <li key={plan.id} className={cn(styles.mPlan, plan.highlighted && styles.mPlanFeatured)}>
                        {plan.highlighted ? <Tag className={styles.badgeFeatured}>más elegido</Tag> : null}

                        <span className={styles.nick}>&ldquo;{plan.nickname}&rdquo;</span>
                        <h3 className={styles.mPlanName}>{plan.name}</h3>

                        <div className={styles.mPrice}>
                            {plan.priceLead ? <span className={styles.priceLead}>{plan.priceLead}</span> : null}
                            <span className={styles.priceMain}>{plan.priceMain}</span>
                            <span className={styles.note}>{plan.note}</span>
                        </div>

                        <dl className={styles.mSpecs}>
                            {specs.map((s) => (
                                <div key={s.label} className={styles.mSpec}>
                                    <dt>{s.label}</dt>
                                    <dd>{s.text}</dd>
                                </div>
                            ))}
                        </dl>

                        <ul className={styles.mFeatures} aria-label={`Qué incluye ${plan.name}`}>
                            {features.map((f) => (
                                <li key={f.label} className={styles.mFeature}>
                                    {f.note ? (
                                        <span className={styles.mPartial} aria-hidden="true" />
                                    ) : (
                                        <span className={styles.mCheck} aria-hidden="true">
                                            <CheckIcon />
                                        </span>
                                    )}
                                    <span>
                                        {f.label}
                                        {f.note ? <span className={styles.mFeatureNote}> · {f.note}</span> : null}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            href={plan.cta.href}
                            variant={plan.highlighted ? "invert" : "primary"}
                            className={cn(styles.cta, styles.mCta)}
                        >
                            {plan.cta.label}
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
}

export function Pricing() {
    return (
        <Section id="precios" bg="alt">
            <ScrollReveal>
                <SectionHeader
                    align="center"
                    nowrap
                    title="precios claros, sin letra chica"
                    intro="Tres formas de tener tu web a medida, según lo que necesites. El alcance real lo definimos juntos en la etapa de escuchar."
                />
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
                <div className={styles.tableWrap}>
                    <div className={styles.tableScroll}>
                        <table className={styles.table}>
                            <colgroup>
                                <col className={styles.labelCol} />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col" className={styles.rowLabel} />
                                    {WEB_PLANS.map((plan) => (
                                        <th
                                            key={plan.id}
                                            scope="col"
                                            className={cn(styles.planHead, plan.highlighted && styles.featuredCol)}
                                        >
                                            {plan.highlighted ? (
                                                <Tag className={styles.badgeFeatured}>más elegido</Tag>
                                            ) : null}

                                            <div className={styles.planHeadInner}>
                                                <span className={styles.nick}>&ldquo;{plan.nickname}&rdquo;</span>
                                                <h3 className={styles.name}>{plan.name}</h3>

                                                <div className={styles.planPrice}>
                                                    {plan.priceLead ? <span className={styles.priceLead}>{plan.priceLead}</span> : null}
                                                    <span className={styles.priceMain}>{plan.priceMain}</span>
                                                    <span className={styles.note}>{plan.note}</span>
                                                </div>

                                                <Button
                                                    href={plan.cta.href}
                                                    variant={plan.highlighted ? "invert" : "primary"}
                                                    className={cn(styles.cta, styles.planCta)}
                                                >
                                                    {plan.cta.label}
                                                </Button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURE_ROWS.map((row) => {
                                    const [landingValue, proValue, webappValue] = row.values;
                                    const [landing, pro, webapp] = WEB_PLANS;
                                    return (
                                        <tr key={row.label}>
                                            <th scope="row" className={styles.rowLabel}>{row.label}</th>
                                            <td className={cn(styles.cell, landing.highlighted && styles.featuredCol)}>
                                                <PlanCell value={landingValue} />
                                            </td>
                                            <td className={cn(styles.cell, pro.highlighted && styles.featuredCol)}>
                                                <PlanCell value={proValue} />
                                            </td>
                                            <td className={cn(styles.cell, webapp.highlighted && styles.featuredCol)}>
                                                <PlanCell value={webappValue} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <MobilePlanCards />
            </ScrollReveal>

            {/* ── Card diferenciada: horas de desarrollo (otro modelo de compra, por horas) ── */}
            <ScrollReveal className={styles.blockGap}>
                <Card className={cn(styles.plan, styles.cardInvert, styles.devCard)}>
                    <div className={styles.devText}>
                        <Eyebrow>horas de desarrollo</Eyebrow>
                        <h3 className={styles.devTitle}>¿tenés algo digital para construir?</h3>
                        <p className={styles.devDesc}>
                            Contratá horas de desarrollo full-stack y usalas para lo que necesites: sumar una feature,
                            matar un bug que no te deja dormir, prototipar una idea o llevar tu producto de cero a algo
                            que funcione. Vos traés el proyecto; yo pongo las horas.
                        </p>
                    </div>
                    <div className={styles.devAside}>
                        <div className={styles.priceRow}>
                            <span className={styles.priceLead}>desde</span>
                            <span className={styles.priceMain}>USD 14</span>
                            <span className={styles.note}>por hora</span>
                        </div>
                        <Button href="#contacto" variant="primary" className={styles.cta}>
                            Reservar horas
                        </Button>
                    </div>
                </Card>
            </ScrollReveal>

            {/* ── Cierre: asesoría gratis (gancho) + Sistema +uno (redirige a /system) ── */}
            <Grid className={styles.blockGap}>
                <Col span={12} md={6}>
                    <ScrollReveal direction="left">
                        <Card className={cn(styles.plan, styles.closeBlock)}>
                            <Eyebrow>sin cargo</Eyebrow>
                            <h3 className={styles.closeTitle}>¿no sabés cuál necesitás?</h3>
                            <p className={styles.closeDesc}>
                                Te hago un diagnóstico de tu web y tu flujo de leads. Aunque no trabajemos juntos,
                                te llevás valor.
                            </p>
                            <Button href="#contacto" variant="outline" className={styles.cta}>
                                Reservá tu charla
                            </Button>
                        </Card>
                    </ScrollReveal>
                </Col>

                <Col span={12} md={6}>
                    <ScrollReveal direction="right">
                        <Card className={cn(styles.plan, styles.cardAccent, styles.closeBlock)}>
                            <Eyebrow>el sistema +uno</Eyebrow>
                            <h3 className={styles.closeTitle}>que no se te escape ni una venta</h3>
                            <p className={styles.closeDesc}>
                                Automatizá la atención con IA y ordená tus leads en un panel simple.
                                Setup + abono, con su propio detalle y planes.
                            </p>
                            <Button href="/system" variant="primary" className={styles.cta}>
                                Ver el sistema
                            </Button>
                        </Card>
                    </ScrollReveal>
                </Col>
            </Grid>

            <p className={styles.addon}>
                ¿No tenés marca todavía? También la armamos.{" "}
                <a className={styles.addonLink} href="#contacto">Consultanos</a>.
            </p>
        </Section>
    );
}
