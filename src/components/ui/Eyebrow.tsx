import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(styles.eyebrow, className)}>{children}</span>;
}
