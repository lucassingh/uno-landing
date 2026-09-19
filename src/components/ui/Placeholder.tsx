import type { CSSProperties } from "react";
import styles from "./Placeholder.module.css";
import { cn } from "@/lib/utils";

type Ratio = "square" | "portrait" | "landscape" | "wide";

const ratioMap: Record<Ratio, string> = {
  square: "1 / 1",
  portrait: "3 / 4",
  landscape: "4 / 3",
  wide: "16 / 9",
};

interface PlaceholderProps {
  label?: string;
  ratio?: Ratio;
  className?: string;
}

/** Caja de imagen provisional (se reemplaza por foto tratada en halftone). */
export function Placeholder({ label = "imagen", ratio = "landscape", className }: PlaceholderProps) {
  const style: CSSProperties = { aspectRatio: ratioMap[ratio] };
  return (
    <div className={cn(styles.box, className)} style={style} role="img" aria-label={label}>
      <span className={styles.label}>{label}</span>
      <span className={styles.mark}>+uno</span>
    </div>
  );
}
