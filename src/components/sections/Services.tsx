import styles from "./Services.module.css";
import { Section, SectionHeader, MagicBento, ScrollReveal } from "@/components/ui";
import type { BentoItem } from "@/components/ui";

const ITEMS: BentoItem[] = [
    {
        title: "La web que capta",
        description: "Landing o sitio a medida, sin plantillas ni relleno: cada página tiene un objetivo y lo cumple. Autoadministrable, para que no dependas de nadie para tocar un texto — es la puerta de entrada de todo el sistema.",
        featured: true,
    },
    {
        title: "El asistente que filtra",
        description: "IA entrenada con tu forma de vender, atendiendo en WhatsApp las 24 horas. Entiende lenguaje natural, responde como una persona y separa en segundos quién solo mira de quien ya quiere comprar.",
    },
    {
        title: "El panel que ordena",
        description: "Mini-CRM visual pensado para decidir rápido: cada lead calificado cae solo, con su origen, su temperatura y el historial de la charla a mano. Sin licencias caras ni configuraciones eternas.",
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
                    title={"web + automatización, un solo criterio"}
                    intro="Se venden juntas o por separado, pero nacen del mismo trabajo: diseño y desarrollo web + administración de leads."
                />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <MagicBento items={ITEMS} />
            </ScrollReveal>
        </Section>
    );
}
