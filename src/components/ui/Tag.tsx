import type { ReactNode } from "react";
import styles from "./Tag.module.css";
import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(styles.tag, className)}>{children}</span>;
}
