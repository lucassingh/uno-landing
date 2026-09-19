import type { ReactNode } from "react";
import styles from "./Container.module.css";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** usa --container-max-wide (1600px) en vez del ancho estándar (1240px) — para bloques que
   * necesitan más aire que el resto de la página, ver Hero.module.css que fija el mismo valor. */
  wide?: boolean;
}

export function Container({ children, className, wide }: ContainerProps) {
  return <div className={cn(styles.container, wide && styles.wide, className)}>{children}</div>;
}
