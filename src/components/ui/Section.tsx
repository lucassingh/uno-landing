import type { ReactNode } from "react";
import styles from "./Section.module.css";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Bg = "default" | "alt" | "invert" | "accent";

interface SectionProps {
  id?: string;
  bg?: Bg;
  className?: string;
  children: ReactNode;
  /** si es false, no envuelve en Container (para full-bleed) */
  contained?: boolean;
}

export function Section({ id, bg = "default", className, children, contained = true }: SectionProps) {
  return (
    <section id={id} className={cn(styles.section, styles[bg], className)}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
