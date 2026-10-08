"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import styles from "./Loader.module.css";
import { cn } from "@/lib/utils";

const ReadyContext = createContext(true);

/** true una vez que el loader terminó — para que las animaciones de entrada de otros componentes esperen y no se "gasten" tapadas por el loader. */
export function useSiteReady() {
  return useContext(ReadyContext);
}

const CELL = 41.3318;
/** Radio de esquina de las 8 celdas SVG (rx) — la celda +1 (.special en el CSS) es un <div>
 * HTML aparte que no lo heredaba, por eso antes se veía sin redondear. El border-radius de
 * .special está hardcodeado en % (RX/CELL, su tamaño ya es un % del stage) porque son todas
 * constantes: si CELL o RX cambian alguna vez, recalcular ese valor ahí también. */
const RX = 3;
/** Las 8 celdas "plantilla" del isotipo (branding/03-logo/02-isotipo/isotipo.svg), sin rotar. */
const STATIC_CELLS = [
  { x: 0, y: 0 },
  { x: 56.0151, y: 0 },
  { x: 112.031, y: 0 },
  { x: 0, y: 53.8398 },
  { x: 56.0151, y: 53.8398 },
  { x: 0, y: 107.681 },
  { x: 56.0151, y: 107.681 },
  { x: 112.031, y: 107.681 },
];

/** La celda +1 tal cual está en el SVG: esquina sup-izq (x,y), lado CELL, rotada alrededor de esa esquina. */
const SPECIAL_RAW = { x: 105.99, y: 62.6348, rotate: -21.0334 };

/**
 * Centro VISUAL de la celda +1 (el rect rotado alrededor de su esquina). Escalamos desde este
 * centro (transform-origin: center) para que crezca parejo en todas las direcciones y tape la
 * pantalla completa — antes escalaba desde la esquina (origin 0 0) y crecía en diagonal, dejando
 * el fondo navy sin tapar de un lado: eso era lo que se veía "feo".
 *
 * En pixeles la celda es un cuadrado (el viewBox 160×150 con estas medidas da lados iguales), así
 * que la trig se hace en ese espacio cuadrado y después se pasa a % de cada eje del stage.
 */
const RAD = (SPECIAL_RAW.rotate * Math.PI) / 180;
const HALF = CELL / 2;
const CENTER_X = SPECIAL_RAW.x + HALF * Math.cos(RAD) - HALF * Math.sin(RAD);
const CENTER_Y = SPECIAL_RAW.y + HALF * Math.sin(RAD) + HALF * Math.cos(RAD);

/** Posición de la celda por su esquina sup-izq, pero calculada para que con transform-origin:center
 *  y rotate -21 siga cayendo exactamente sobre el slot +1 del logo durante el pulse. */
const SPECIAL = {
  left: ((CENTER_X - HALF) / 160) * 100,
  top: ((CENTER_Y - HALF) / 150) * 100,
  width: (CELL / 160) * 100,
  height: (CELL / 150) * 100,
  rotate: SPECIAL_RAW.rotate,
};

/** Grande a propósito: tiene que cubrir toda la pantalla desde el centro incluso en 4K / ultrawide.
 * Recalculado al achicar .stage (170px → 90px máx, ver Loader.module.css): la celda +1 parte de
 * un tamaño ~1.89x más chico, así que necesita ~1.89x más escala para tapar la misma área que
 * antes (140 × 1.89 ≈ 265). */
const EXPAND_SCALE = 265;
const EXPAND_MS = 1350;
const REVEAL_MS = 1300;

/**
 * Orden del "chase" (porteado de react-bits Lattice Loader, patrón "orbit"): un pulso de luz
 * que recorre las celdas del anillo con delay escalonado, en vez del pulse/scale genérico que
 * había antes. Recorre el anillo en sentido horario arrancando arriba-izq; la celda +1 (el
 * "hole" del anillo, ver STATIC_CELLS) entra en su lugar real en vez de quedar afuera del
 * patrón. El centro (índice 4) queda fijo/encendido todo el tiempo — el eje quieto alrededor
 * del que orbita el resto, no un paso más del chase.
 */
const CHASE_ORDER: (number | "special")[] = [0, 1, 2, "special", 7, 6, 5, 3];
const CHASE_STEP_MS = 120;
const CHASE_CYCLE_MS = CHASE_ORDER.length * CHASE_STEP_MS;
const CHASE_LOOPS = 2;
const CHASE_MS = CHASE_CYCLE_MS * CHASE_LOOPS;

type Phase = "chase" | "expand" | "reveal" | "done";

/**
 * Loader de entrada del sitio: overlay navy con el isotipo en blanco (la celda +1 en crema).
 * Un pulso de luz recorre el anillo de celdas dos vueltas (fase "chase", ver CHASE_ORDER);
 * después la celda +1 se escala desde su centro hasta tapar toda la pantalla de crema (fase
 * "expand"); y por último el overlay entero se difumina (fase "reveal") dejando ver el Hero,
 * que tiene el mismo fondo crema — la transición se siente como que el contenido aparece con
 * delicadeza, sin corte seco.
 */
export function LoaderProvider({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  // Rutas "peladas" tipo link-in-bio (/links): sin animacion de entrada -> carga instantanea en mobile.
  const pathname = usePathname();
  const bareRoute = pathname === "/links";
  const [phase, setPhase] = useState<Phase>(bareRoute ? "done" : "chase");
  const [percent, setPercent] = useState(0);

  // "Cargando NN%": cuenta de 0 a 100 en sincro con la fase "chase" (llega a 100 justo cuando
  // arranca el expand). Se corta sola cuando la fase cambia — el cleanup del efecto cancela el
  // rAF en vuelo, no hace falta chequear la fase adentro del loop.
  useEffect(() => {
    if (shouldReduceMotion || phase !== "chase") return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const pct = Math.min(100, Math.round(((performance.now() - start) / CHASE_MS) * 100));
      setPercent(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, shouldReduceMotion]);

  useEffect(() => {
    if (bareRoute) return;
    if (shouldReduceMotion) {
      const t = setTimeout(() => setPhase("done"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("expand"), CHASE_MS);
    return () => clearTimeout(t);
  }, [shouldReduceMotion, bareRoute]);

  useEffect(() => {
    if (bareRoute) return;
    if (phase === "expand") {
      const t = setTimeout(() => setPhase("reveal"), EXPAND_MS);
      return () => clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = setTimeout(() => setPhase("done"), REVEAL_MS);
      return () => clearTimeout(t);
    }
  }, [phase, bareRoute]);

  // El Hero puede empezar a entrar apenas arranca el fade (reveal), así aparece mientras el crema
  // se difumina, no después de un corte.
  const ready = phase === "reveal" || phase === "done";
  const expanded = phase === "expand" || phase === "reveal";

  return (
    <ReadyContext.Provider value={ready}>
      {phase !== "done" && (
        <motion.div
          className={styles.overlay}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "reveal" ? 0 : 1 }}
          transition={{ duration: REVEAL_MS / 1000, ease: "easeInOut" }}
          style={{ pointerEvents: phase === "reveal" ? "none" : "auto" }}
        >
          <div className={styles.row}>
            <div className={styles.stage}>
              <svg className={styles.icon} viewBox="0 0 160 150">
                {STATIC_CELLS.map((c, i) => {
                  const order = CHASE_ORDER.indexOf(i);
                  const chasing = phase === "chase" && !shouldReduceMotion && order !== -1;
                  return (
                    <rect
                      key={i}
                      x={c.x}
                      y={c.y}
                      width={CELL}
                      height={CELL}
                      rx={RX}
                      fill="var(--color-blanco)"
                      className={chasing ? styles.cellChase : styles.cell}
                      style={chasing ? { animationDelay: `${order * CHASE_STEP_MS}ms`, animationDuration: `${CHASE_CYCLE_MS}ms` } : undefined}
                    />
                  );
                })}
              </svg>
              <motion.div
                className={cn(styles.special, phase === "chase" && !shouldReduceMotion && styles.specialChase)}
                style={{
                  left: `${SPECIAL.left}%`,
                  top: `${SPECIAL.top}%`,
                  width: `${SPECIAL.width}%`,
                  height: `${SPECIAL.height}%`,
                  transformOrigin: "center",
                  animationDelay: `${CHASE_ORDER.indexOf("special") * CHASE_STEP_MS}ms`,
                  animationDuration: `${CHASE_CYCLE_MS}ms`,
                }}
                initial={{ rotate: SPECIAL.rotate, scale: 1 }}
                animate={{ rotate: SPECIAL.rotate, scale: expanded ? EXPAND_SCALE : 1 }}
                transition={{ duration: EXPAND_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className={cn(styles.label, phase !== "chase" && styles.labelHidden)}>
              <span className={styles.labelWord}>Cargando</span>
              <span className={styles.labelPercent}>{percent}%</span>
            </div>
          </div>
        </motion.div>
      )}
      {children}
    </ReadyContext.Provider>
  );
}
