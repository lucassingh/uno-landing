import type { ReactNode } from "react";
import styles from "./Card.module.css";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** sombra dura brutalista */
  raised?: boolean;
}

export function Card({ children, className, raised = false }: CardProps) {
  return <div className={cn(styles.card, raised && styles.raised, className)}>{children}</div>;
}
