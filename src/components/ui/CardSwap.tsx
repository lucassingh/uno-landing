"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";
import styles from "./CardSwap.module.css";
import { cn } from "@/lib/utils";

export interface CardSwapCardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

/** Una carta del mazo — el nombre no es `Card` a propósito, ya existe `ui/Card.tsx` (la card
 * brutalista genérica del sitio) y colisionaría en el barrel de `ui/index.ts`. */
export const CardSwapCard = forwardRef<HTMLDivElement, CardSwapCardProps>(({ customClass, className, ...rest }, ref) => (
  <div ref={ref} {...rest} className={cn(styles.card, customClass, className)} />
));
CardSwapCard.displayName = "CardSwapCard";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  /** se llama con el índice (dentro de los `children` originales) de la carta que pasa a estar
   * al frente — para sincronizar contenido externo (ej. un texto al costado) con el mazo. */
  onActiveChange?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  /** cuánto "cae" (eje Y, px) la carta de adelante al pasar para atrás. El original usa 500 fijo
   * pensando en un mazo suelto sobre la página; en una sección con alto acotado eso se pasa del
   * borde inferior del stage y la caída queda cortada contra la sección de abajo — bajalo si tu
   * contenedor es más chico. */
  dropDistance?: number;
  className?: string;
  children: ReactNode;
}

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

/** Porteado de reactbits (ts-default/Components/CardSwap) — mazo de cartas en 3D (GSAP) que se
 * van "cayendo" una a la vez y las de atrás avanzan a ocupar su lugar. Sin cambios de mecánica;
 * se suma `onActiveChange` (el original no avisa cuál carta quedó al frente) y el corte por
 * `prefers-reduced-motion`: el ciclo automático se apaga, pero clickear la carta de adelante
 * sigue avanzando el mazo a mano — así el contenido de las 3 cartas sigue siendo alcanzable sin
 * depender de una animación perpetua. */
export function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveChange,
  skewAmount = 6,
  easing = "elastic",
  dropDistance = 500,
  className,
  children,
}: CardSwapProps) {
  const shouldReduceMotion = useReducedMotion();

  const config =
    easing === "elastic"
      ? { ease: "elastic.out(0.6,0.9)", durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardSwapCardProps>[], [children]);
  // a propósito solo depende de la CANTIDAD de children, no del array entero: los refs deben
  // sobrevivir re-renders que no cambian cuántas cartas hay (si dependiera de `childArr`, un
  // nuevo array en cada render recrearía los refs y GSAP perdería el nodo que estaba animando).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = useMemo<CardRef[]>(() => childArr.map(() => { const r: CardRef = { current: null }; return r; }), [childArr.length]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
    onActiveChange?.(order.current[0]!);

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current as [number, ...number[]];
      onActiveChange?.(rest[0]!);
      const elFront = refs[front]!.current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, { y: `+=${dropDistance}`, duration: config.durDrop, ease: config.ease });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]!.current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return");
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, "return");

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const node = container.current;

    if (shouldReduceMotion) {
      return () => clearInterval(intervalRef.current);
    }

    let hovering = false;
    let visible = false;
    let startedOnce = false;

    const startCycle = () => {
      if (!visible || (pauseOnHover && hovering)) return;
      if (intervalRef.current) return; // ya corriendo
      if (!startedOnce) {
        startedOnce = true;
        swap();
      } else {
        tlRef.current?.play();
      }
      intervalRef.current = window.setInterval(swap, delay);
    };
    const stopCycle = () => {
      tlRef.current?.pause();
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
    };

    // gate de visibilidad: el mazo solo cicla cuando esta en pantalla. Antes GSAP animaba desde
    // el mount aunque estuviera fuera de vista, gravando frames de otras secciones (ej. el reveal
    // del About, mas arriba).
    let io: IntersectionObserver | null = null;
    if (node && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => {
          visible = !!e?.isIntersecting;
          if (visible) startCycle();
          else stopCycle();
        },
        { threshold: 0.1 }
      );
      io.observe(node);
    } else {
      visible = true;
      startCycle();
    }

    const onEnter = () => { hovering = true; if (pauseOnHover) stopCycle(); };
    const onLeave = () => { hovering = false; if (pauseOnHover) startCycle(); };
    if (pauseOnHover && node) {
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);
    }

    return () => {
      io?.disconnect();
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      if (pauseOnHover && node) {
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, dropDistance, shouldReduceMotion]);

  const handleCardClick = (i: number) => {
    onCardClick?.(i);
    // con reduced-motion el ciclo automático está apagado — clickear la de adelante la avanza
    // igual, a mano, para que las otras 2 cartas sigan siendo alcanzables.
    if (shouldReduceMotion && order.current[0] === i) {
      const [front, ...rest] = order.current as [number, ...number[]];
      onActiveChange?.(rest[0]!);
      const total = refs.length;
      rest.forEach((idx, pos) => placeNow(refs[idx]!.current!, makeSlot(pos, cardDistance, verticalDistance, total), skewAmount));
      placeNow(refs[front]!.current!, makeSlot(total - 1, cardDistance, verticalDistance, total), skewAmount);
      order.current = [...rest, front];
    }
  };

  const rendered = childArr.map((child, i) =>
    isValidElement<CardSwapCardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            handleCardClick(i);
          },
        } as Partial<CardSwapCardProps> & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div ref={container} className={cn(styles.container, className)} style={{ width, height }}>
      {rendered}
    </div>
  );
}

export default CardSwap;
