"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./StrokeMark.module.css";
import { cn } from "@/lib/utils";

// mismos 4 trazos que public/logo/abreviado-white.svg (branding/03-logo/04-logo-abreviado) —
// hardcodeados acá porque el trazo necesita acceso directo a los <path> (getTotalLength),
// algo que un <img src=".svg"> no permite. Versión pasada por Illustrator y unida a mano por
// Lucas: "u" y "n" quedaron como un solo trazo continuo (sin el salto que antes había que
// parchear con curvas calculadas a mano) y el "+" salió como un polígono de 12 vértices — el
// contorno único de la cruz, sin los dos rectángulos superpuestos que cruzaban entre sí.
const PATHS = [
  "M479.47,79.7c-15.64,0-28.67-1.28-39.1-3.84-10.33-2.56-18.1-6.64-23.31-12.25-5.12-5.61-7.67-12.98-7.67-22.13s2.56-16.52,7.67-22.13c5.21-5.7,12.98-9.84,23.31-12.39,10.43-2.66,23.46-3.98,39.1-3.98s28.43,1.33,38.66,3.98c10.33,2.56,18.05,6.69,23.16,12.39,5.11,5.61,7.67,12.98,7.67,22.13s-2.56,16.53-7.67,22.13c-5.11,5.61-12.84,9.69-23.16,12.25-10.23,2.56-23.12,3.84-38.66,3.84ZM479.47,58.31c7.28,0,13.38-.59,18.3-1.77,4.92-1.28,8.66-3.15,11.21-5.61,2.56-2.56,3.84-5.71,3.84-9.44s-1.28-6.89-3.84-9.44c-2.46-2.56-6.15-4.48-11.07-5.75s-11.07-1.92-18.44-1.92-13.48.64-18.59,1.92c-5.02,1.28-8.85,3.2-11.51,5.75-2.56,2.46-3.84,5.61-3.84,9.44s1.28,6.89,3.84,9.44c2.56,2.46,6.34,4.33,11.36,5.61,5.11,1.18,11.36,1.77,18.74,1.77Z",
  "M393.74,22.19c-2.56-5.11-6-9.15-10.33-12.1-4.23-2.95-9.05-5.02-14.46-6.2-5.41-1.28-11.02-1.92-16.82-1.92-9.25,0-17.26,1.13-24.05,3.39-6.69,2.26-12.25,5.02-16.67,8.26-4.43,3.25-7.82,6.49-10.18,9.74-.88,1.23-1.62,2.34-2.21,3.36V4.19h-35.41v72.3h35.41v-41.08c2.08-1.26,4.68-2.51,7.82-3.77,3.93-1.67,8.36-3.1,13.28-4.28,5.02-1.18,10.18-1.77,15.49-1.77,10.03,0,16.97,1.57,20.8,4.72,3.84,3.05,5.76,8.26,5.76,15.64v30.54h35.41v-34.97c0-7.77-1.28-14.21-3.84-19.33Z",
  "M214.91,3.2v36.45c-1.92,1.81-4.37,3.67-7.38,5.6-3.74,2.46-8.11,4.57-13.13,6.34-4.92,1.67-10.28,2.51-16.08,2.51-6.2,0-11.26-.54-15.2-1.62-3.93-1.18-6.84-3.25-8.71-6.2-1.77-2.95-2.66-7.13-2.66-12.54V3.2h-35.41v34.23c0,7.77,1.28,14.26,3.84,19.48,2.56,5.11,6.1,9.2,10.62,12.25,4.52,3.05,9.69,5.21,15.49,6.49,5.8,1.38,11.95,2.07,18.44,2.07s12.39-.79,17.71-2.36,10.03-3.59,14.16-6.05c4.13-2.56,7.62-5.31,10.48-8.26,2.85-2.95,5.07-5.8,6.64-8.56.44-.73.83-1.43,1.18-2.11v25.13h35.41V3.2h-35.41Z",
  "M102.29,25.59L66.14,25.59L66.14,5.67L38.11,5.67L38.11,25.59L1.96,25.59L1.96,47.72L38.11,47.72L38.11,67.64L66.14,67.64L66.14,47.72L102.29,47.72Z",
];

export interface StrokeMarkProps {
  className?: string;
  color?: string;
  duration?: number;
}

/** Isotipo "+uno" en loop infinito, SOLO contorno (sin relleno — ver Footer, quedaba
 * demasiado invasivo un bloque blanco sólido ahí) — adaptado del StrokeText de reactbits, que
 * anima <text>/tspan con GSAP. Acá no hay texto real (el wordmark siempre es vectorial, ver
 * [[masuno-wordmark-asset]]), así que el mismo truco (stroke-dasharray/dashoffset = largo
 * real del trazo, medido con getTotalLength) se aplica directo a los <path> del isotipo, en
 * CSS puro @keyframes en vez de un timeline de GSAP. */
export function StrokeMark({ className, color = "#FFFFFF", duration = 3.6 }: StrokeMarkProps) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [lengths, setLengths] = useState<number[] | null>(null);

  useEffect(() => {
    setLengths(pathRefs.current.map((p) => p?.getTotalLength() ?? 0));
  }, []);

  return (
    <svg viewBox="0 0 550.83 80.87" className={cn(styles.mark, className)} role="img" aria-label="más uno">
      {PATHS.map((d, i) => {
        const len = lengths?.[i] ?? 0;
        return (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={0.5}
            strokeLinejoin="round"
            strokeLinecap="butt"
            className={styles.stroke}
            style={
              lengths
                ? ({
                    "--len": len,
                    animationDuration: `${duration}s`,
                    animationDelay: `${i * 0.16}s`,
                  } as CSSProperties)
                : { visibility: "hidden" }
            }
          />
        );
      })}
    </svg>
  );
}

export default StrokeMark;
