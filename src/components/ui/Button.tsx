import type { ReactNode } from "react";
import styles from "./Button.module.css";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "invert";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
}

/** Renderiza <a> si hay href, si no <button>. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  onClick,
  type,
  disabled,
}: BaseProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const cls = cn(styles.btn, styles[variant], styles[size], className);
  if (href) {
    return (
      <a className={cls} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick} type={type ?? "button"} disabled={disabled}>
      {children}
    </button>
  );
}
