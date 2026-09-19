import type { CSSProperties, ReactNode } from "react";
import styles from "./Grid.module.css";
import { cn } from "@/lib/utils";

/** Grid de 12 columnas responsive. */
export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(styles.grid, className)}>{children}</div>;
}

interface ColProps {
  children: ReactNode;
  /** span en mobile (default 12) */
  span?: number;
  /** span desde tablet/desktop (min-width 768px) */
  md?: number;
  className?: string;
}

type ColStyle = CSSProperties & { "--col-span"?: number; "--col-md"?: number };

export function Col({ children, span = 12, md, className }: ColProps) {
  const style: ColStyle = { "--col-span": span, "--col-md": md ?? span };
  return (
    <div className={cn(styles.col, className)} style={style}>
      {children}
    </div>
  );
}
