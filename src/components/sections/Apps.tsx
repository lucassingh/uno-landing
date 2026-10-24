"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import styles from "./Apps.module.css";
import { Section, SectionHeader, Button, ScrollReveal } from "@/components/ui";
import { cn } from "@/lib/utils";

type ColKey = "A" | "B" | "C" | "D" | "E";

interface Modulo {
  id: string;
  n: string;
  name: string;
  /** la columna de la planilla que este módulo reemplaza */
  col: ColKey;
  colName: string;
  resuelve: string;
  entregable: string;
}

// cada módulo del plano "se come" una columna de la planilla de hoy: es el puente entre la idea
// del antes/después (planilla → app) y el plano por módulos, que además es como se cotiza
// (operaciones/04-presupuesto-a-medida: módulos / etapas / entregables).
const MODULOS: Modulo[] = [
  {
    id: "turnos",
    n: "01",
    name: "Turnos y agenda",
    col: "B",
    colName: "Turno",
    resuelve: "Tus clientes reservan solos y vos ves el día entero en una pantalla. Chau al «¿era el martes o el jueves?».",
    entregable: "Agenda online + panel del día",
  },
  {
    id: "cobros",
    n: "02",
    name: "Cobros",
    col: "C",
    colName: "¿Pagó?",
    resuelve: "Señas y pagos con Mercado Pago que se registran solos. Sabés quién pagó sin revisar transferencias una por una.",
    entregable: "Checkout + estado de cada pago",
  },
  {
    id: "stock",
    n: "03",
    name: "Stock y pedidos",
    col: "D",
    colName: "Stock",
    resuelve: "Cada venta descuenta del stock y te avisa antes de que te quedes sin nada. Nada de «quedan 3??».",
    entregable: "Inventario con alertas",
  },
  {
    id: "reportes",
    n: "04",
    name: "Reportes",
    col: "E",
    colName: "Total",
    resuelve: "Cuánto vendiste, qué se mueve y quién vuelve, sin armar una fórmula ni romper otra.",
    entregable: "Tablero con tus números",
  },
];

/** capas de base del plano: no son módulos elegibles, son lo que está debajo de todos */
const CAPAS = [
  { id: "base", label: "base", text: "usuarios, roles y permisos — cada uno ve lo suyo" },
  { id: "integraciones", label: "integraciones", text: "Mercado Pago · Google · Tienda Nube · ARCA" },
  { id: "infra", label: "infra", text: "hosting, base de datos y backups — incluidos" },
];

const COLS: { key: ColKey; label: string }[] = [
  { key: "A", label: "Cliente" },
  { key: "B", label: "Turno" },
  { key: "C", label: "¿Pagó?" },
  { key: "D", label: "Stock" },
  { key: "E", label: "Total" },
];

/** la planilla "de hoy", desordenada a propósito: duplicados, signos de pregunta, una fórmula
 * rota, celdas pintadas a mano (lila: el amarillo queda reservado para la columna activa). */
type Cell = { v: string; mark?: boolean; strike?: boolean; err?: boolean };
const FILAS: Cell[][] = [
  [{ v: "Marta G." }, { v: "mar 14hs?" }, { v: "sí (transf)" }, { v: "quedan 3??" }, { v: "$45.000" }],
  [{ v: "Juan (local)" }, { v: "jue" }, { v: "SEÑA", mark: true }, { v: "" }, { v: "#¡REF!", err: true }],
  [{ v: "Marta G", mark: true }, { v: "vie 10", strike: true }, { v: "no" }, { v: "PEDIR!!" }, { v: "$12.500" }],
  [{ v: "Carla" }, { v: "ver msj" }, { v: "?" }, { v: "-2" }, { v: "=SUMA(E2:E", err: true }],
  [{ v: "NO BORRAR", mark: true }, { v: "" }, { v: "" }, { v: "" }, { v: "" }],
];

/** cuánto queda cada módulo activo en el autoplay (lo dura la barrita del módulo). */
const STEP_MS = 4200;

function Planilla({ activeCol }: { activeCol: ColKey | null }) {
  return (
    <div
      className={styles.sheet}
      role="img"
      aria-label="Ejemplo de una planilla de ventas desordenada: clientes duplicados, turnos con signos de pregunta, pagos y stock anotados a mano y una fórmula rota."
    >
      <div className={styles.sheetTab} aria-hidden="true">
        <span className={styles.sheetDot} />
        ventas_FINAL_v3_ahora_si.xlsx
      </div>
      <div className={styles.sheetScroll} aria-hidden="true">
        <table className={styles.sheetTable}>
          <thead>
            <tr>
              <th className={styles.corner} />
              {COLS.map((c) => (
                <th key={c.key} className={cn(styles.colLetter, c.key === activeCol && styles.colLetterActive)}>
                  {c.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={styles.labelRow}>
              <th className={styles.rowNum}>1</th>
              {COLS.map((c) => (
                <td key={c.key} className={cn(c.key === activeCol && styles.colActive)}>
                  {c.label}
                </td>
              ))}
            </tr>
            {FILAS.map((fila, r) => (
              <tr key={r}>
                <th className={styles.rowNum}>{r + 2}</th>
                {fila.map((cell, c) => (
                  <td
                    key={c}
                    className={cn(
                      cell.mark && styles.cellMark,
                      cell.strike && styles.cellStrike,
                      cell.err && styles.cellErr,
                      COLS[c]!.key === activeCol && styles.colActive
                    )}
                  >
                    {cell.v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Apps a medida — "el plano": un plano técnico (navy, grilla, cruces) donde la app se arma por
 * módulos, y a la izquierda la planilla de hoy que esos módulos reemplazan. Elegir un módulo
 * (o dejar que el autoplay los recorra) resalta en amarillo la columna que se "come" y abre su
 * ficha abajo. Mobile: sin pestañas ni resaltado — la planilla arriba y los módulos en lista,
 * cada uno con su ficha a la vista (mismo criterio que el resto de las secciones interactivas).
 */
export function Apps() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // dispara el "dibujo" del conector una sola vez; mismo margen que ScrollReveal (amount:0)
  const boardInView = useInView(boardRef, { once: true, amount: 0, margin: "0px 0px -20% 0px" });
  // el autoplay solo corre con las pestañas en pantalla (en mobile están ocultas: nunca corre)
  const tabsInView = useInView(tablistRef, { amount: 0.5 });
  const playing = autoplay && !reduce;
  const current = MODULOS[active]!;

  function select(i: number) {
    setAutoplay(false);
    setActive(i);
  }

  function onTabsKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = MODULOS.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (active + 1) % MODULOS.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (active - 1 + MODULOS.length) % MODULOS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Section id="apps" bg="alt" className={styles.apps}>
      <ScrollReveal>
        <SectionHeader
          eyebrow="apps a medida"
          title="cuando la planilla ya no alcanza"
          intro="Software hecho para cómo trabaja tu negocio, no al revés. Lo pensamos por módulos, lo cotizamos por etapas y cada etapa te deja algo andando."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div ref={boardRef} className={cn(styles.board, boardInView && styles.boardInView)}>
          {/* cruces de registro en las 4 esquinas, como en un plano impreso */}
          <span className={cn(styles.cross, styles.crossTL)} aria-hidden="true">+</span>
          <span className={cn(styles.cross, styles.crossTR)} aria-hidden="true">+</span>
          <span className={cn(styles.cross, styles.crossBL)} aria-hidden="true">+</span>
          <span className={cn(styles.cross, styles.crossBR)} aria-hidden="true">+</span>

          <div className={styles.boardBar} aria-hidden="true">
            <span>plano n.º 01 — tu app, a medida</span>
            <span className={styles.boardBarMeta}>rev. a · esc. 1:1</span>
          </div>

          <div className={styles.boardBody}>
            <div className={styles.sheetCol}>
              <p className={styles.zoneLabel}>00 · tu planilla de hoy</p>
              <Planilla activeCol={current.col} />
            </div>

            <div className={styles.connector} aria-hidden="true">
              <span className={styles.connectorLabel}>se convierte en</span>
              <span className={styles.connectorLine} />
            </div>

            <div className={styles.planCol}>
              <p className={styles.zoneLabel}>01–04 · tu app, por módulos</p>

              {/* desktop/tablet: pestañas (cada módulo resalta su columna en la planilla) */}
              <div
                ref={tablistRef}
                role="tablist"
                aria-label="Módulos de la app"
                className={styles.modules}
                onKeyDown={onTabsKeyDown}
              >
                {MODULOS.map((m, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={m.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`apps-tab-${m.id}`}
                      aria-selected={isActive}
                      aria-controls="apps-ficha"
                      tabIndex={isActive ? 0 : -1}
                      className={cn(styles.module, isActive && styles.moduleActive)}
                      onClick={() => select(i)}
                      onMouseEnter={() => select(i)}
                    >
                      <span className={styles.moduleN}>{m.n}</span>
                      <span className={styles.moduleName}>{m.name}</span>
                      <span className={styles.moduleCol}>col. {m.col}</span>
                      {isActive && playing ? (
                        <span
                          key={active}
                          className={cn(styles.moduleFill, !tabsInView && styles.moduleFillPaused)}
                          style={{ animationDuration: `${STEP_MS}ms` }}
                          onAnimationEnd={() => setActive((active + 1) % MODULOS.length)}
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* mobile: lista simple, cada módulo con su ficha abierta */}
              <ol className={styles.mobileModules}>
                {MODULOS.map((m) => (
                  <li key={m.id} className={styles.mobileModule}>
                    <p className={styles.mobileModuleHead}>
                      <span className={styles.moduleN}>{m.n}</span>
                      <span className={styles.moduleName}>{m.name}</span>
                    </p>
                    <p className={styles.fichaText}>{m.resuelve}</p>
                    <p className={styles.mobileMeta}>
                      reemplaza: col. {m.col} «{m.colName}» · entregable: {m.entregable}
                    </p>
                  </li>
                ))}
              </ol>

              <ul className={styles.layers}>
                {CAPAS.map((c) => (
                  <li key={c.id} className={styles.layer}>
                    <span className={styles.layerLabel}>{c.label}</span>
                    <span className={styles.layerText}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* la ficha vive ADENTRO del grid del plano (subgrid): "qué resuelve" cae bajo la
                planilla y "reemplaza / entregable" bajo la columna de la app, alineados con los
                módulos de arriba. */}
            <div
              id="apps-ficha"
              role="tabpanel"
              aria-labelledby={`apps-tab-${current.id}`}
              className={styles.ficha}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  className={styles.fichaGrid}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <div className={styles.fichaMain}>
                    <p className={styles.fichaLabel}>ficha {current.n} · qué resuelve</p>
                    <p className={styles.fichaTitle}>{current.name}</p>
                    <p className={styles.fichaText}>{current.resuelve}</p>
                  </div>
                  <div className={styles.fichaSpecs}>
                    <div className={styles.fichaSpec}>
                      <p className={styles.fichaLabel}>reemplaza</p>
                      <p className={styles.fichaText}>
                        columna {current.col} · «{current.colName}»
                      </p>
                    </div>
                    <div className={styles.fichaSpec}>
                      <p className={styles.fichaLabel}>entregable</p>
                      <p className={styles.fichaText}>{current.entregable}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className={styles.ctaRow}>
        <p className={styles.ctaText}>
          <strong>¿Tu negocio corre en una planilla así?</strong> Contanos cómo trabajás y te decimos qué
          módulos le harían falta.
        </p>
        <Button href="#contacto" variant="primary" className={styles.ctaBtn}>
          Contanos tu idea
        </Button>
      </ScrollReveal>
    </Section>
  );
}
