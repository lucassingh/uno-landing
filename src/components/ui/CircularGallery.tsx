"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type MutableRefObject } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import styles from "./CircularGallery.module.css";
import { Tag } from "./Tag";
import { cn } from "@/lib/utils";
import { cardPatterns } from "@/lib/cardPatterns";

export interface GalleryItem {
  id: string;
  number: string;
  title: string;
  description: string;
  tech: string[];
  href: string;
}

export interface CircularGalleryProps {
  items: GalleryItem[];
  className?: string;
}

const CARD_WIDTH = 450; // debe coincidir con el width fijo de .card en CircularGallery.module.css (base 300 x1.5)
const GAP = 72; // ídem con el gap de .track (calc(var(--space-12) * 1.5))
const STEP = CARD_WIDTH + GAP;
const PIXEL_COLS = 6;
const PIXEL_ROWS = 4;

/** radio (px) del círculo imaginario sobre el que "se apoyan" las cards — más grande, curva más amplia/suave. */
const BEND_RADIUS = 1950;
const MAX_ROTATE = 9; // deg, en el borde del radio — sutil, no un abanico de naipes
const MAX_DROP = 90; // px que caen las cards lejos del centro (base 60 x1.5, escalado con el resto del abanico)
const MIN_SCALE = 0.94;
const SCROLL_SPEED = 2.4; // multiplicador para wheel/trackpad horizontal

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  x: MotionValue<number>;
  viewportWidthRef: MutableRefObject<number>;
  onCardClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const PIXELS = Array.from({ length: PIXEL_COLS * PIXEL_ROWS }, (_, i) => ({
  col: i % PIXEL_COLS,
  row: Math.floor(i / PIXEL_COLS),
}));

/** 3 tramas inspiradas en branding/05-recursos-graficos/01-tramas (grilla técnica, puntos,
 * diagonal), cicladas por índice — CSS puro, sin archivo (ver commit anterior: los .svg como
 * mask-image tenían bugs de render). Definición compartida en lib/cardPatterns (reutilizada
 * también en el bento de Servicios) — la nota sobre por qué la diagonal necesita P×√2 y no P
 * vive ahí ahora.
 *
 * Cada una de las 24 piezas del mosaico calcula el patrón desde su propia caja (75×150px, ver
 * PIXEL_COLS/ROWS) — si el paso de repetición no divide EXACTO ese tamaño, salta en cada
 * unión. Grilla y puntos son fáciles (25px divide 75 y 150 justo); la diagonal usa el
 * DIAGONAL_STEP ya corregido de cardPatterns para que también encaje. */
const PATTERNS = cardPatterns("var(--color-tinta)");

/** tono base y trama (ver PATTERNS) alternan por índice; sin fotos, la variedad entre las 10
 * cards sale de esto + el número grande + nombre/número chico, no de color nuevo (la paleta de
 * marca es corta a propósito). */
type CardStyle = CSSProperties & { "--card-tone"?: string; "--card-pattern"?: string };

function GalleryCard({ item, index, x, viewportWidthRef, onCardClick }: GalleryCardProps) {
  const cardVars: CardStyle = {
    "--card-tone": index % 2 === 0 ? "var(--color-blanco)" : "var(--color-crema)",
    "--card-pattern": PATTERNS[index % PATTERNS.length]!,
  };
  // distancia (px) de esta card al centro del viewport, recalculada en cada frame de drag.
  const distance = useTransform(x, (latest) => latest + index * STEP + CARD_WIDTH / 2 - viewportWidthRef.current / 2);
  // t: -1..1, cuánto se acerca esta card al borde del radio de curvatura.
  const t = useTransform(distance, (d) => clamp(d / BEND_RADIUS, -1, 1));
  // el ángulo sale de la propia pendiente de la curva de "y" en ese punto (derivada de la sagita),
  // no de un valor elegido aparte: así el borde inferior de cada card queda tangente a la curva
  // real y encaja con el de sus vecinas, en vez de que cada una gire "a su manera" y el semicírculo
  // se vea como un polígono. Con signo: las cards de la izquierda giran hacia la izquierda y las
  // de la derecha hacia la derecha (la punta de arriba se abre "hacia afuera"), pivoteando desde
  // abajo (ver transform-origin en .card). Clamp final porque la pendiente de una sagita se dispara
  // cerca del borde del radio — MAX_ROTATE sigue siendo el tope, como antes.
  const rotate = useTransform(t, (v) => {
    const cos = Math.sqrt(Math.max(1 - v * v, 0.0001));
    const slopeDeg = Math.atan((MAX_DROP / BEND_RADIUS) * (v / cos)) * (180 / Math.PI);
    return clamp(slopeDeg, -MAX_ROTATE, MAX_ROTATE);
  });
  // sagita del arco circular: 0 en el centro, crece (no lineal) hacia los bordes.
  const y = useTransform(t, (v) => MAX_DROP * (1 - Math.sqrt(1 - v * v)));
  const scale = useTransform(t, (v) => 1 - (1 - MIN_SCALE) * v * v);

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      draggable={false}
      onClickCapture={onCardClick}
      style={{ ...cardVars, rotate, y, scale }}
    >
      <div className={styles.overlay}>
        <span className={styles.index} aria-hidden="true">
          {item.number}
        </span>
        <h3 className={styles.overlayTitle}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
        <ul className={styles.tech}>
          {item.tech.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      </div>
      {/* tapa el overlay de contenido por default; al hover cada pieza encoge con un delay
          escalonado (ver transitionDelay) y revela la descripción/tech debajo — adaptado del
          "Pixel Transition" de reactbits a CSS puro. Antes cada pieza recortaba una foto; ahora
          es el tono de la card + la trama (ver PATTERNS), no hay imagen que cargar. */}
      <div className={styles.pixelGrid} aria-hidden="true">
        {PIXELS.map(({ col, row }, i) => (
          <span key={i} className={styles.pixel} style={{ transitionDelay: `${(col + row) * 22}ms` }} />
        ))}
      </div>
      {/* número grande, flecha, nombre: la "cara" de reposo — se ocultan todos juntos al hover
          (ver .card:hover en el css) para que solo quede el contenido real del overlay (título +
          ficha técnica) visible. Por eso .title acá es decorativo/aria-hidden: el h3 con
          semántica real es overlayTitle, adentro del overlay. Sin badge chico de número: es
          redundante con el número grande. */}
      <span className={styles.bigNumber} aria-hidden="true">
        {item.number}
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
      <span className={styles.title} aria-hidden="true">
        {item.title}
      </span>
    </motion.a>
  );
}

/**
 * Fila de cards arrastrable en abanico: la card más cerca del centro del viewport queda derecha y
 * a tamaño completo; las de los costados se inclinan, caen y achican siguiendo un arco circular
 * (BEND_RADIUS). Adaptado del patrón "circular gallery" de reactbits (ahí es un canvas WebGL con
 * imágenes curvadas) al sistema neo-brutalista de +1: acá son cards reales con drag nativo de
 * Motion + soporte de wheel/trackpad horizontal.
 */
export function CircularGallery({ items, className }: CircularGalleryProps) {
  const viewportElRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const viewportWidthRef = useRef(0);
  const draggedRef = useRef(false);
  const [maxDrag, setMaxDrag] = useState(0);
  // el fan (rotate/y/scale) sigue 1 a 1 el drag del usuario, no es una animación autónoma —
  // se deja siempre activo. Lo único que se apaga con reduced-motion es el "coasteo" inercial
  // al soltar (dragTransition), que sí es movimiento que el usuario no controla directamente.
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const viewportEl = viewportElRef.current;
      const trackEl = trackRef.current;
      if (!viewportEl || !trackEl) return;

      viewportWidthRef.current = viewportEl.clientWidth;
      const next = Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);
      setMaxDrag(next);
      x.set(clamp(x.get(), -next, 0));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length, x]);

  return (
    <div ref={viewportElRef} className={cn(styles.viewport, className)}>
      <motion.div
        ref={trackRef}
        className={styles.track}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -maxDrag, right: 0 }}
        dragElastic={0.08}
        dragMomentum={!shouldReduceMotion}
        dragTransition={{ power: 0.25, timeConstant: 240 }}
        onDragStart={() => {
          draggedRef.current = false;
        }}
        onDrag={(_e, info) => {
          if (Math.abs(info.offset.x) > 6) draggedRef.current = true;
        }}
        onWheel={(e) => {
          // solo intercepta gestos claramente horizontales (trackpad, shift+wheel): un wheel
          // vertical normal tiene que seguir scrolleando la página, no quedar atrapado acá.
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          e.preventDefault();
          x.set(clamp(x.get() - e.deltaX * SCROLL_SPEED, -maxDrag, 0));
        }}
      >
        {items.map((item, i) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={i}
            x={x}
            viewportWidthRef={viewportWidthRef}
            onCardClick={(e) => {
              if (draggedRef.current) e.preventDefault();
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default CircularGallery;
