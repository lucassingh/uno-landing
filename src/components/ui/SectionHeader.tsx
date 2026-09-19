import styles from "./SectionHeader.module.css";
import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  /** título en una sola línea desde tablet en adelante (títulos cortos, ej. precios) */
  nowrap?: boolean;
  /** "sm": jerarquía reducida para un header que vive DENTRO de otro contenedor (ej. una
   * Card), no encabezando la sección entera — ver Faq. "lg": título de impacto, para cuando
   * el título ES el protagonista visual de la sección (ej. Sistema+1) — ver Direccion-de-Marca. */
  size?: "md" | "sm" | "lg";
  /** hook para overrides puntuales de una sección específica (ej. un intro más ancho) — se
   * aplica al <header>, no reemplaza las clases base. */
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  nowrap = false,
  size = "md",
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        styles.header,
        align === "center" && styles.center,
        nowrap && styles.nowrap,
        size === "sm" && styles.sm,
        size === "lg" && styles.lg,
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className={styles.title}>{title}</h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </header>
  );
}
