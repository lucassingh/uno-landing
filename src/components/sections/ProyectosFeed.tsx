"use client";

import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import styles from "./Proyectos.module.css";
import { Tag } from "@/components/ui";
import { cn } from "@/lib/utils";
import { cardPatterns } from "@/lib/cardPatterns";
import { useMediaQuery } from "@/lib/useMediaQuery";

export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  tech: string[];
  href: string;
}

/** mismas 3 tramas que el bento de Servicios, bien suaves: acá hacen de "foto" de cada tile
 * (no hay capturas de los proyectos) y se desvanecen hacia el texto (mask en el CSS). Una
 * versión navy para los tiles blancos y una blanca para los navy. */
const PATTERNS = cardPatterns("color-mix(in srgb, var(--color-tinta) 18%, transparent)");
const PATTERNS_INVERT = cardPatterns("color-mix(in srgb, var(--color-blanco) 22%, transparent)");

type TileStyle = CSSProperties & { "--tile-pattern"?: string };

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

// la página que se va desaparece de una (rápido, todas juntas) y la nueva entra en cascada con
// spring — así el cambio se lee como "otra tanda", no como un carrusel que se desliza.
const gridVariants: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.06 } },
  exit: {},
};
const tileVariants: Variants = {
  enter: { opacity: 0, y: 24, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: EASE } },
};

/** tiles por página según el ancho — tiene que coincidir con las columnas de .grid en el CSS
 * (3 / 2 / 1): siempre dos filas completas en desktop y tablet, y en mobile 3 tiles nomás para
 * que la sección no vuelva a ser un scroll eterno. Arranca en 6 (SSR) y se corrige al montar:
 * la sección está lejos del primer viewport, el salto no se ve. */
function usePageSize() {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 1023px)");
  return isMobile ? 3 : isTablet ? 4 : 6;
}

function ArrowIcon({ direction }: { direction: "left" | "right" | "out" }) {
  const d =
    direction === "out" ? "M7 17 17 7M8 7h9v9" : direction === "left" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6";
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function ProjectTile({ project, index }: { project: Project; index: number }) {
  // el tono y la trama salen del índice GLOBAL (no del de la página): cada proyecto conserva su
  // look aunque cambie el tamaño de página al rotar el celular o achicar la ventana. Blanco /
  // navy alternados (antes era blanco / crema y el crema se perdía contra el fondo de la
  // sección) — con 3 columnas queda un damero.
  const invert = index % 2 === 1;
  const tileVars: TileStyle = {
    "--tile-pattern": (invert ? PATTERNS_INVERT : PATTERNS)[index % PATTERNS.length]!,
  };

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles.tile, invert && styles.tileInvert)}
      style={tileVars}
    >
      <span className={styles.tileTop}>
        <span className={styles.tileNumber} aria-hidden="true">{project.number}</span>
        <span className={styles.tileArrow}>
          <ArrowIcon direction="out" />
        </span>
      </span>
      <h3 className={styles.tileTitle}>{project.title}</h3>
      <p className={styles.tileDescription}>{project.description}</p>
      <ul className={styles.tileTech} aria-label="Tecnologías">
        {project.tech.map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>
      <span className={styles.srOnly}>(se abre en una pestaña nueva)</span>
    </a>
  );
}

/** Grilla de proyectos tipo feed, paginada: cada página reemplaza a la anterior (no se apilan),
 * así la sección tiene siempre el mismo alto aproximado. Reemplaza a la galería pineada con
 * drag (CircularGallery) + la lista mobile aparte — había usuarios que no entendían cómo se
 * movía el slider. Una sola versión para todos los anchos. */
export function ProyectosFeed({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const pageSize = usePageSize();
  const [page, setPage] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const pages = Math.max(1, Math.ceil(projects.length / pageSize));
  // si el tamaño de página cambia (resize) y la página actual deja de existir, cae en la última
  const current = Math.min(page, pages - 1);
  const start = current * pageSize;
  const visible = projects.slice(start, start + pageSize);
  const end = start + visible.length;

  function goTo(next: number) {
    if (next < 0 || next >= pages || next === current) return;
    setPage(next);
    // el paginado queda abajo de la grilla: si el usuario ya scrolleó más allá del comienzo
    // (pasa siempre en mobile, una columna), lo devolvemos al primer tile de la página nueva.
    const feed = feedRef.current;
    if (feed && feed.getBoundingClientRect().top < 0) {
      feed.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  const tiles = visible.map((project, i) => (
    <motion.li key={project.id} className={styles.item} variants={reduce ? undefined : tileVariants}>
      <ProjectTile project={project} index={start + i} />
    </motion.li>
  ));

  return (
    <div ref={feedRef} className={styles.feed}>
      {reduce ? (
        <ul className={styles.grid}>{tiles}</ul>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={`${pageSize}-${current}`}
            className={styles.grid}
            variants={gridVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {tiles}
          </motion.ul>
        </AnimatePresence>
      )}

      {pages > 1 ? (
        <div className={styles.pagerRow}>
          <p className={styles.pagerStatus} aria-live="polite">
            {String(start + 1).padStart(2, "0")}–{String(end).padStart(2, "0")}
            <span className={styles.pagerTotal}> / {String(projects.length).padStart(2, "0")} proyectos</span>
          </p>

          <nav className={styles.pager} aria-label="Páginas de proyectos">
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="Página anterior"
            >
              <ArrowIcon direction="left" />
            </button>
            <ol className={styles.pagerList}>
              {Array.from({ length: pages }, (_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className={cn(styles.pagerBtn, i === current && styles.pagerBtnActive)}
                    onClick={() => goTo(i)}
                    aria-label={`Página ${i + 1}`}
                    aria-current={i === current ? "page" : undefined}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => goTo(current + 1)}
              disabled={current === pages - 1}
              aria-label="Página siguiente"
            >
              <ArrowIcon direction="right" />
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
