import type { CSSProperties } from "react";
import styles from "./Logo.module.css";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "isotipo" | "isotipo-white" | "wordmark" | "wordmark-white" | "abreviado-white";

const SOURCES: Record<LogoVariant, string> = {
  color: "/logo/lockup-horizontal-color.svg",
  white: "/logo/lockup-horizontal-white.svg",
  isotipo: "/logo/isotipo-color.svg",
  "isotipo-white": "/logo/isotipo-white.svg",
  wordmark: "/logo/wordmark-color.svg",
  "wordmark-white": "/logo/wordmark-white.svg",
  "abreviado-white": "/logo/abreviado-white.svg",
};

export function Logo({
  variant = "color",
  className,
  style,
}: {
  variant?: LogoVariant;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SOURCES[variant]}
      alt="más uno — diseño web + automatización, a medida"
      className={cn(styles.logo, className)}
      style={style}
    />
  );
}
