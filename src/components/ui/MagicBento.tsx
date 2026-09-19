"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { motion, useInView, useReducedMotion } from "motion/react";
import styles from "./MagicBento.module.css";
import { Topography } from "./Topography";
import { cn } from "@/lib/utils";
import { cardPatterns } from "@/lib/cardPatterns";

const MOBILE_BREAKPOINT = 768;
/** rgb de --color-tinta (#031844) — único acento disponible en la paleta. */
const ACCENT_RGB = "3, 24, 68";
/** mismas 3 tramas que Proyectos (CircularGallery), pero bien suaves — acá son fondo detrás
 * de texto, no el protagonista de la card. 10% dejaba la trama de puntos (índice 1, la que le
 * toca a "Software a medida") prácticamente invisible: un puntito de 3px suelto cada 25px
 * tiene mucha menos "tinta" por área que la diagonal, así que necesita más opacidad para leerse
 * al mismo nivel — subido a 20% para las dos. */
const PATTERNS = cardPatterns("color-mix(in srgb, var(--color-tinta) 20%, transparent)");

export interface BentoItem {
  title: string;
  description: string;
  /** ocupa 2×2 celdas en desktop */
  featured?: boolean;
  /** variante oscura, ancho completo (tarjeta de cierre) */
  invert?: boolean;
}

export interface MagicBentoProps {
  items: BentoItem[];
  className?: string;
}

/** Deshabilita los efectos JS de hover en mobile y cuando el usuario prefiere menos movimiento. */
function useDisableAnimations(): boolean {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setDisabled(mobileQuery.matches || motionQuery.matches);
    update();

    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return disabled;
}

type CardStyle = CSSProperties & { "--glow-rgb"?: string };

interface BentoCardProps extends BentoItem {
  index: number;
  disableAnimations: boolean;
}

function BentoCard({ title, description, featured, invert, index, disableAnimations }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rgb = ACCENT_RGB;

  const inView = useInView(cardRef, { amount: 0.3, once: true });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    if (!card || disableAnimations) return;

    const handleEnter = () => {
      gsap.to(card, { x: -2, y: -2, duration: 0.25, ease: "power2.out" });
    };

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      card.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
      card.style.setProperty("--glow-intensity", "1");

      gsap.to(card, {
        x: -2 + (x - centerX) * 0.04,
        y: -2 + (y - centerY) * 0.04,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      card.style.setProperty("--glow-intensity", "0");
      gsap.to(card, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.className = styles.ripple!;
      ripple.style.width = ripple.style.height = `${maxDistance * 2}px`;
      ripple.style.left = `${x - maxDistance}px`;
      ripple.style.top = `${y - maxDistance}px`;
      ripple.style.background = `radial-gradient(circle, rgba(${rgb}, 0.45) 0%, rgba(${rgb}, 0.15) 35%, transparent 70%)`;
      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => ripple.remove() }
      );
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    card.addEventListener("click", handleClick);

    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
      card.removeEventListener("click", handleClick);
    };
  }, [disableAnimations, rgb]);

  const style: CardStyle = { "--glow-rgb": rgb };
  const plain = !featured && !invert;

  return (
    <motion.div
      ref={cardRef}
      className={cn(styles.card, featured && styles.featured, invert && styles.invert)}
      style={style}
      initial={shouldReduceMotion ? undefined : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {featured ? (
        <Topography
          className={styles.topography}
          lowColor="#031844"
          midColor="#5582e1"
          highColor="#acc6f2"
          morphAmount={1}
          scale={2.2}
          opacity={0.6}
          grain={false}
          mouseInteraction={false}
        />
      ) : null}
      {plain ? (
        <div
          className={styles.patternBg}
          aria-hidden="true"
          style={{ backgroundImage: PATTERNS[index % PATTERNS.length] }}
        />
      ) : null}
      {featured || plain ? <div className={styles.textShield} aria-hidden="true" /> : null}
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{description}</p>
      </div>
      {invert ? (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      ) : null}
    </motion.div>
  );
}

/** Grid bento interactivo (glow de borde, magnetismo por tarjeta), adaptado del patrón MagicBento de reactbits al sistema neo-brutalista de +1. */
export function MagicBento({ items, className }: MagicBentoProps) {
  const disableAnimations = useDisableAnimations();

  return (
    <div className={cn(styles.grid, className)}>
      {items.map((item, i) => (
        <BentoCard key={item.title} {...item} index={i} disableAnimations={disableAnimations} />
      ))}
    </div>
  );
}

export default MagicBento;
