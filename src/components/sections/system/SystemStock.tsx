import styles from "./SystemStock.module.css";
import { Section, Eyebrow, MagicBento, ScrollReveal } from "@/components/ui";
import type { BentoItem } from "@/components/ui";

const ITEMS: BentoItem[] = [
  {
    title: "Productos y variantes (SKU)",
    description: "Cada producto puede tener variantes — talle, color, lo que corresponda a tu rubro — y las ves agrupadas por producto o una por una, en tabla.",
  },
  {
    title: "Categorías con subcategorías",
    description: "Un nivel de sub-categoría para ordenar el catálogo sin volverte loco armando un árbol infinito que nadie mantiene.",
  },
  {
    title: "Atributos configurables por rubro",
    description: "Vos definís qué atributos importan: talle y color si vendés indumentaria; marca, modelo y año si vendés repuestos. El sistema se adapta a vos, no al revés.",
  },
  {
    title: "Movimientos con historial",
    description: "Ingresos, ventas, ajustes e importaciones — todo queda registrado, con quién lo hizo y cuándo. Nada de \"¿quién tocó el stock?\".",
  },
  {
    title: "Importaciones masivas",
    description: "Subís tu planilla y el sistema carga o actualiza el catálogo entero, sin cargar producto por producto a mano.",
  },
  {
    title: "Alertas de stock bajo",
    description: "Te avisa antes de que se te agote lo que más se vende — no cuando ya perdiste la venta por no tenerlo.",
  },
];

export function SystemStock() {
  return (
    <Section id="stock" bg="default">
      <ScrollReveal>
        <header className={styles.header}>
          <Eyebrow>para el que también vende algo físico</Eyebrow>
          <h2 className={styles.title}>el stock, ordenado como el resto del sistema.</h2>
          <p className={styles.intro}>
            El stock que ves acá es el mismo que consulta tu asistente — nunca un dato
            desincronizado.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <MagicBento items={ITEMS} />
      </ScrollReveal>
    </Section>
  );
}
