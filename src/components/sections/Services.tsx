import styles from "./Services.module.css";
import { Section, SectionHeader, MagicBento, ScrollReveal } from "@/components/ui";
import type { BentoItem } from "@/components/ui";

// 2026-10-24: sin las cards del bot ("el asistente que filtra" / "el panel que ordena") — el
// Sistema +uno se pospuso. Las dos patas ahora son web + apps a medida, con la infra incluida
// en el acompañamiento (ver operaciones/01-infraestructura-por-cliente).
const ITEMS: BentoItem[] = [
    {
        title: "La web que vende",
        description: "Landing o sitio a medida, sin plantillas ni relleno: cada página tiene un objetivo y lo cumple. Autoadministrable, para que no dependas de nadie para tocar un texto o un precio.",
        featured: true,
    },
    {
        title: "Apps a medida",
        description: "Cuando la planilla ya no alcanza: paneles de gestión, turnos, portales de clientes, integraciones con lo que ya usás. Software pensado para cómo trabaja tu negocio, no al revés.",
    },
    {
        title: "La infra, resuelta",
        description: "Hosting, servidor, base de datos, backups y monitoreo corren por nuestra cuenta. Vos te ocupás de tu negocio; del servidor nos ocupamos nosotros.",
    },
    {
        title: "Identidad + acompañamiento",
        description: "Si hace falta marca, la armamos con diseñadoras aliadas — logo, identidad y web, con el mismo criterio de punta a punta. Y el lanzamiento no es el final: ahí seguimos, iterando con vos.",
        invert: true,
    },
];

export function Services() {
    return (
        <Section id="servicios" bg="default" className={styles.services}>
            <ScrollReveal>
                <SectionHeader
                    title={"web + apps, un solo criterio"}
                    intro="Se contratan juntas o por separado, pero nacen del mismo trabajo: diseño y desarrollo a medida, con alguien que se queda después del lanzamiento."
                />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <MagicBento items={ITEMS} />
            </ScrollReveal>
        </Section>
    );
}
