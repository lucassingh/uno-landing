"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import styles from "./Casos.module.css";
import { Section, SectionHeader, ScrollReveal } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Cambio {
  antes: string;
  despues: string;
  /** fila de impacto: el "después" va grande y en amarillo */
  big?: boolean;
}

interface Caso {
  id: string;
  n: string;
  /** escala de la solución — es lo que se lee en la pestaña */
  tipo: string;
  cliente: string;
  rubro: string;
  /** en la voz del cliente. TODO: validar cada cita con el cliente antes de publicar. */
  cita: string;
  /** nombre y cargo de quien habla — se completan cuando Lucas los tenga */
  autor?: string;
  pasaba: string[];
  hicimos: string[];
  /** título de la columna de la solución (default "lo que hicimos") */
  hicimosLabel?: string;
  /** el panel azul de antes → después: el visual de cada caso (sin capturas de los sitios) */
  cambiosLabel: string;
  cambios: Cambio[];
  resultadoLabel: string;
  resultado: string[];
  href?: string;
}

// orden "al revés" a propósito (pedido de Lucas): lo primero que se ve es la solución más grande.
// VX3: diagnóstico y solución están hechos; la app se termina ~nov 2026. El texto describe el
// problema y la solución diseñada — sin resultados medidos todavía (se suman cuando esté online).
// Fuente: VX3-workspace/"VX3 · Diagnóstico y solución.html". Sin nombres del equipo ni del ERP.
const CASOS: Caso[] = [
  {
    id: "vx3",
    n: "01",
    tipo: "app a medida",
    cliente: "VX3",
    rubro: "venta mayorista de lencería y blanco",
    cita: "Vendíamos, pero el negocio estaba repartido en catorce herramientas que no se hablaban. Lo primero que hicieron fue entender cómo trabajamos de verdad, antes de proponer nada.",
    pasaba: [
      "14 herramientas para el día a día, y ninguna conectada con otra.",
      "Facturar un pedido llevaba 13 pasos a mano.",
      "A los clientes que llegaban desde un anuncio, el WhatsApp les mandaba el catálogo general.",
      "Envíos mal cotizados que terminaban en ventas devueltas.",
    ],
    hicimosLabel: "la solución",
    hicimos: [
      "Arrancamos por un diagnóstico a fondo: procesos, 1.052 productos y 6 integraciones.",
      "Una sola app para todo el negocio: catálogo, pedidos, envíos, cobros, reclamos y pauta.",
      "Conectada a su sistema de gestión, Meta, WhatsApp, el Correo y Tienda Nube.",
      "Un asistente de ventas que responde con el producto exacto del anuncio, con foto, precio y stock real.",
    ],
    // comportamientos de la app diseñada, no métricas medidas
    cambiosLabel: "antes → con la app",
    cambios: [
      { antes: "14 herramientas", despues: "1 sola app", big: true },
      { antes: "13 pasos para facturar", despues: "1 clic", big: true },
      { antes: "el catálogo general por WhatsApp", despues: "el producto exacto del anuncio" },
      { antes: "cobros conciliados a ojo", despues: "la app propone cada cruce" },
    ],
    resultadoLabel: "módulos",
    resultado: ["catálogo + vidriera", "pedidos y facturación", "envíos y cobros", "tablero de pauta"],
  },
  {
    id: "jornadas",
    n: "02",
    tipo: "web autoadministrable",
    cliente: "Jornadas Misioneras",
    rubro: "red nacional de jornadas misioneras",
    cita: "Teníamos todo en formularios de Google y planillas sueltas. Hoy cargamos las jornadas de todo el país desde un panel simple, y por fin tenemos una marca que la gente reconoce.",
    pasaba: [
      "Sin marca: cada pieza se veía distinta.",
      "Los datos de cada jornada vivían en formularios de Google y planillas.",
      "Cualquier cambio en la web dependía de alguien técnico.",
    ],
    hicimos: [
      "Identidad de marca y una web nueva, de punta a punta.",
      "Un panel para editar todo el contenido del sitio, sin ayuda.",
      "La gestión de las jornadas de todo el país, por provincia y localidad, desde una interfaz amigable.",
    ],
    cambiosLabel: "antes → con la web",
    cambios: [
      { antes: "formularios y planillas", despues: "1 panel", big: true },
      { antes: "sin marca", despues: "identidad propia", big: true },
      { antes: "cambios que dependían de alguien técnico", despues: "editan el sitio ellos mismos" },
      { antes: "datos de cada jornada, dispersos", despues: "todo el país, por provincia y localidad" },
    ],
    resultadoLabel: "resultado",
    resultado: ["una marca que fideliza", "más difusión en Instagram", "chau planillas"],
    // TODO: pasar a https://www.jornadasmisioneras.org/ cuando se reapunte el dominio (semana del 2026-10-26)
    href: "https://jornadas-misioneras-web.vercel.app/",
  },
  {
    id: "sembrando",
    n: "03",
    tipo: "landing",
    cliente: "Sembrando Valores",
    rubro: "asociación civil",
    cita: "No teníamos nada: ni web ni identidad. Hoy mostramos lo que hacemos sin tener que explicarlo tanto, y eso se notó también en Instagram.",
    pasaba: [
      "Sin web ni identidad: su obra no se veía fuera de su comunidad.",
      "Explicar qué hacían llevaba una charla entera.",
      "No había dónde canalizar donaciones ni voluntariado.",
    ],
    hicimos: [
      "Una identidad institucional, desde cero.",
      "Una landing bilingüe (ES/EN) que cuenta su obra con un scroll narrativo.",
      "Un camino claro para donar o sumarse como voluntario.",
    ],
    cambiosLabel: "antes → con la web",
    cambios: [
      { antes: "sin web", despues: "landing bilingüe", big: true },
      { antes: "sin identidad", despues: "marca institucional", big: true },
      { antes: "explicar qué hacen en cada charla", despues: "la web lo cuenta sola" },
      { antes: "sin dónde donar ni sumarse", despues: "un camino claro para ayudar" },
    ],
    resultadoLabel: "resultado",
    resultado: ["identidad como institución", "su obra, visible", "mejor difusión en Instagram"],
    href: "https://www.sembrandovalores.org/",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Panel azul de antes → después: mismo lenguaje de plano que la sección Apps. */
function CambiosBoard({ caso }: { caso: Caso }) {
  const resumen = caso.cambios.map((c) => `${c.antes} → ${c.despues}`).join("; ");
  return (
    <div className={styles.board} role="img" aria-label={`${caso.cliente}, ${caso.cambiosLabel}: ${resumen}.`}>
      <div className={styles.boardBar} aria-hidden="true">
        <span>{caso.cliente}</span>
        <span>{caso.cambiosLabel}</span>
      </div>
      <ul className={styles.boardRows} aria-hidden="true">
        {caso.cambios.map((c) => (
          <li key={c.antes} className={cn(styles.boardRow, c.big && styles.boardRowBig)}>
            <span className={styles.boardAntes}>{c.antes}</span>
            <span className={styles.boardArrow}>→</span>
            <span className={styles.boardDespues}>{c.despues}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CasoPanel({ caso, active }: { caso: Caso; active: boolean }) {
  return (
    <article
      id={`caso-panel-${caso.id}`}
      role="tabpanel"
      aria-labelledby={`caso-tab-${caso.id}`}
      className={cn(styles.panel, active ? styles.panelActive : styles.panelInactive)}
    >
      <header className={styles.head}>
        <div className={styles.headText}>
          <p className={styles.meta}>
            {caso.n} · {caso.tipo}
          </p>
          <h3 className={styles.cliente}>
            {caso.cliente}
            <span className={styles.rubro}> — {caso.rubro}</span>
          </h3>
        </div>

        {caso.href ? (
          <a href={caso.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
            ver el sitio <span aria-hidden="true">↗</span>
            <span className={styles.srOnly}> (se abre en una pestaña nueva)</span>
          </a>
        ) : null}
      </header>

      <div className={styles.text}>
        <figure className={styles.quote}>
          <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
          <blockquote className={styles.quoteText}>
            <p>{caso.cita}</p>
          </blockquote>
          <figcaption className={styles.quoteAutor}>— {caso.autor ?? caso.cliente}</figcaption>
        </figure>

        <div className={styles.compare}>
          <div>
            <p className={styles.label}>lo que pasaba</p>
            <ul className={styles.list}>
              {caso.pasaba.map((t) => (
                <li key={t} className={styles.item}>
                  <span className={styles.markPain} aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={styles.label}>{caso.hicimosLabel ?? "lo que hicimos"}</p>
            <ul className={styles.list}>
              {caso.hicimos.map((t) => (
                <li key={t} className={styles.item}>
                  <span className={styles.markFix} aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* columna izquierda en desktop: el antes → después, y debajo el resultado */}
      <div className={styles.visual}>
        <CambiosBoard caso={caso} />

        <div className={styles.result}>
          <p className={styles.label}>{caso.resultadoLabel}</p>
          <ul className={styles.chips}>
            {caso.resultado.map((r) => (
              <li key={r} className={styles.chip}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/**
 * Casos de éxito — "expedientes": tres casos, uno a la vez, elegidos por pestañas que de por sí
 * cuentan la escala (app a medida → web autoadministrable → landing). Cada caso: el antes →
 * después en un panel de plano (con el resultado y el link debajo), y al lado la cita en la voz
 * del cliente y lo que pasaba vs. lo que hicimos. Separado de Testimonios a propósito: acá pesa
 * el problema y la solución, no el elogio.
 * Mobile: sin pestañas — los tres casos apilados. Los tres paneles viven siempre en el DOM; en
 * desktop los inactivos se ocultan por CSS (mismo criterio que el resto del sitio).
 */
export function Casos() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabsKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = CASOS.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (active + 1) % CASOS.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (active - 1 + CASOS.length) % CASOS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Section id="casos" bg="default" className={styles.casos}>
      <ScrollReveal>
        <SectionHeader
          eyebrow="casos de éxito"
          title="casos de punta a punta"
          intro="Una app completa, una web autoadministrable y una landing. Qué les pasaba, qué hicimos y cómo lo cuentan ellos."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div role="tablist" aria-label="Casos de éxito" className={styles.tabs} onKeyDown={onTabsKeyDown}>
          {CASOS.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`caso-tab-${c.id}`}
                aria-selected={isActive}
                aria-controls={`caso-panel-${c.id}`}
                tabIndex={isActive ? 0 : -1}
                className={cn(styles.tab, isActive && styles.tabActive)}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabMeta}>
                  {c.n} · {c.tipo}
                </span>
                <span className={styles.tabCliente}>{c.cliente}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.panels}>
          {CASOS.map((c, i) => (
            <CasoPanel key={c.id} caso={c} active={i === active} />
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}
