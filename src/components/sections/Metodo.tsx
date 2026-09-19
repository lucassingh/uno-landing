"use client";

import styles from "./Metodo.module.css";
import { Section, Container, StickyScroll, Grainient } from "@/components/ui";
import type { StickyScrollItem } from "@/components/ui";

const STEPS: StickyScrollItem[] = [
    {
        index: "01",
        title: "Escuchar",
        description:
            "Reunión 1-a-1. Entiendo qué hacés, qué vendés, a quién, y tu rubro. Ahí detecto si hace falta branding y cuál. Alguien que entiende tu negocio antes de vender nada.",
        principle: "No empezamos por el diseño. Empezamos por entender tu negocio.",
        illustration: "/metodo/escuchar.svg",
    },
    {
        index: "02",
        title: "Planear",
        description:
            "Propuesta con estrategia: cómo va a ser la web después de escucharte, alcance, pack, precio y tiempos. Un plan claro, no un presupuesto suelto.",
        principle: "Precio sin plan es apostar a ciegas.",
        illustration: "/metodo/planear.svg",
    },
    {
        index: "03",
        title: "Diseñar",
        description:
            "Mockups. Si hace falta marca, coordino con la diseñadora y también itero eso. Ves la web antes de que exista. Sin sorpresas.",
        principle: "Lo que no se ve antes, se sufre después.",
        illustration: "/metodo/disenar.svg",
    },
    {
        index: "04",
        title: "Iterar",
        description:
            "Rondas acotadas de ajuste sobre los mockups (y el branding, si aplica). Una web a medida, no una plantilla.",
        principle: "A medida no es un adjetivo. Es un proceso.",
        illustration: "/metodo/iterar.svg",
    },
    {
        index: "05",
        title: "Desarrollar y lanzar",
        description:
            "Desarrollo en Next.js, publico, mido, te capacito. Web online, rápida, autoadministrable — y sabés usarla.",
        principle: "Una web que no sabés usar, no es tuya.",
        illustration: "/metodo/desarrollar.svg",
    },
    {
        index: "06",
        title: "Acompañar",
        description:
            "Mantenimiento y mejoras continuas. El lanzamiento no es el final: acá arranca un socio, no un proveedor que desaparece.",
        principle: "Un proveedor entrega y se va. Un socio se queda.",
        illustration: "/metodo/acompanar.svg",
    },
];

export function Metodo() {
    return (
        <Section id="metodo" bg="invert" contained={false} className={styles.metodo}>
            <div className={styles.glow} aria-hidden="true">
                <Grainient
                    color1="#3A10E5"
                    color2="#031844"
                    color3="#031844"
                    // más lento (timeSpeed), patrón más chico y menos brusco (warpFrequency
                    // arriba achica las manchas, warpAmplitude abajo las mueve más suave,
                    // blendSoftness arriba ablanda el borde entre colores) — pedido puntual
                    // de Lucas: "se note pero no tan brusco como ahora".
                    timeSpeed={0.2}
                    warpFrequency={5}
                    warpAmplitude={14}
                    warpStrength={1.6}
                    blendSoftness={0.26}
                    centerX={0.23}
                    centerY={-0.01}
                    grainScale={1.2}
                />
            </div>
            <Container>
                <div className={styles.scroll}>
                    <StickyScroll items={STEPS} />
                </div>
            </Container>
        </Section>
    );
}
