"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { MOBILE_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./SystemAsistente.module.css";
import { LoopReplay } from "./LoopReplay";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const POP = { type: "spring" as const, stiffness: 340, damping: 22 };

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
    </svg>
  );
}

/** Marco de iPhone (asset recortado en public/system/functions/iphone-frame.svg) con el chrome
 * de WhatsApp real (header/wallpaper/footer) — la única marca +1 acá es el isotipo del avatar,
 * el resto son los colores/proporciones reales de WhatsApp a propósito ("darle más realismo").
 * Como vive en un solo componente, retocarlo acá alcanza para las 3 visuales que usan chat. */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.phoneFrame} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/system/functions/iphone-frame.svg" alt="" className={styles.phoneFrameImg} />
      <div className={styles.phoneScreen}>
        <div className={styles.waHeader}>
          <div className={styles.waAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/isotipo-white.svg" alt="" className={styles.waAvatarMark} />
          </div>
          <div className={styles.waHeaderText}>
            <span className={styles.waName}>+uno</span>
            <span className={styles.waStatus}>en línea</span>
          </div>
        </div>
        <div className={styles.waBody}>{children}</div>
        <div className={styles.waFooter}>
          <span className={styles.waFooterInput} aria-hidden="true" />
          <MicIcon className={styles.waFooterMic} />
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      className={styles.typingBubble}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <span className={styles.typingDot} />
      <span className={styles.typingDot} />
      <span className={styles.typingDot} />
    </motion.div>
  );
}

type Turn = { from: "lead" | "bot"; text: string };

/** Simula una charla real con varios cruces: cada turno del bot pasa primero por los puntitos
 * de "escribiendo…" antes de aparecer, el lead entra directo (es quien ya escribió y envió).
 * `tags`/`extra` se muestran recién cuando terminó de revelarse toda la conversación. */
function ChatSequence({ turns, tags, extra }: { turns: Turn[]; tags?: string[]; extra?: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(shouldReduceMotion ? turns.length : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 500;
    turns.forEach((turn, i) => {
      if (turn.from === "bot") {
        timers.push(setTimeout(() => setTyping(true), t));
        t += 1100;
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setRevealed(i + 1);
          }, t)
        );
        t += 900;
      } else {
        timers.push(setTimeout(() => setRevealed(i + 1), t));
        t += 800;
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [shouldReduceMotion, turns]);

  const done = revealed >= turns.length;

  return (
    <div className={styles.chatMock}>
      {turns.slice(0, revealed).map((turn, i) => (
        <motion.div
          key={i}
          className={turn.from === "lead" ? styles.bubbleLead : styles.bubbleBot}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: turn.from === "bot" ? 0.96 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={turn.from === "bot" ? POP : { duration: 0.35, ease: EASE }}
        >
          {turn.text}
        </motion.div>
      ))}
      <AnimatePresence>{typing ? <TypingBubble /> : null}</AnimatePresence>
      {done && tags?.length ? (
        <motion.div
          className={styles.bubbleMeta}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        >
          {tags.map((t) => (
            <motion.span
              key={t}
              className={styles.bubbleMetaTag}
              variants={{ hidden: { opacity: 0, y: 6, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
              transition={POP}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      ) : null}
      {done && extra ? (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE, delay: 0.3 }}
        >
          {extra}
        </motion.div>
      ) : null}
    </div>
  );
}

/* ---- visual 1: prompt guiado o modo avanzado ---- */
const PROMPT_FIELDS = [
  { label: "tono", value: "cercano y directo", Icon: ToneIcon },
  { label: "puede prometer", value: "descuento por volumen", Icon: PromiseIcon },
  { label: "deriva si", value: "pregunta por instalación", Icon: RouteIcon },
];

function ToneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="9" x2="4" y2="15" />
      <line x1="9" y1="5" x2="9" y2="19" />
      <line x1="14" y1="8" x2="14" y2="16" />
      <line x1="19" y1="11" x2="19" y2="13" />
    </svg>
  );
}

function PromiseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="2" />
      <circle cx="16.5" cy="16.5" r="2" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4v9a3 3 0 0 0 3 3h9" />
      <path d="M14 12l4 4-4 4" />
    </svg>
  );
}

const PROMPT_CODE_LINES = [
  "sos el asistente de +uno.",
  "tono: cercano, directo, sin relleno.",
  "si preguntan por mayorista → pedí CUIT.",
  "si no sabés algo → derivá, no inventes.",
  "siempre cerrá pidiendo el próximo paso.",
];

/** El snippet se "tipea" línea por línea (con cursor parpadeando al final) en vez de aparecer
 * entero de una — es lo que hace que se lea como reglas que se están escribiendo solas. La barra
 * de arriba (puntitos + nombre de archivo) es puro adorno "editor de código", para que se lea
 * como reglas de verdad y no un cartel de texto suelto. */
function CodeReveal() {
  const shouldReduceMotion = useReducedMotion();
  const [shown, setShown] = useState(shouldReduceMotion ? PROMPT_CODE_LINES.length : 0);

  useEffect(() => {
    if (shouldReduceMotion || shown >= PROMPT_CODE_LINES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [shouldReduceMotion, shown]);

  return (
    <div className={styles.promptCode}>
      <div className={styles.promptCodeBar}>
        <div className={styles.promptCodeDots}>
          <span />
          <span />
          <span />
        </div>
        <span className={styles.promptCodeFile}>reglas.txt</span>
      </div>
      <div className={styles.promptCodeBody}>
        {PROMPT_CODE_LINES.slice(0, shown).map((line, i) => (
          <motion.span key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {line}
          </motion.span>
        ))}
        {shown < PROMPT_CODE_LINES.length ? <span className={styles.codeCursor} /> : null}
      </div>
    </div>
  );
}

function PromptSequence() {
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"guiado" | "avanzado">("guiado");

  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setTimeout(() => setMode("avanzado"), 4200);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  return (
    <div className={styles.promptMock}>
      <div className={styles.promptTabs}>
        {(["guiado", "avanzado"] as const).map((m) => (
          <span key={m} className={styles.promptTab}>
            {mode === m ? (
              <motion.span
                layoutId="promptTabPill"
                className={styles.promptTabPill}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className={styles.promptTabLabel} data-active={mode === m}>
              {m}
            </span>
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {mode === "guiado" ? (
          <motion.div
            key="guiado"
            className={styles.promptFields}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } } }}
          >
            {PROMPT_FIELDS.map((f) => (
              <motion.div
                key={f.label}
                className={styles.promptField}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <span className={styles.promptFieldIcon}>
                  <f.Icon />
                </span>
                <motion.div
                  className={styles.promptFieldText}
                  initial={{ backgroundColor: "rgba(58,16,229,0.16)" }}
                  animate={{ backgroundColor: "rgba(58,16,229,0)" }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                >
                  <span className={styles.promptFieldLabel}>{f.label}</span>
                  <span className={styles.promptFieldValue}>{f.value}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="avanzado"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <CodeReveal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PromptVisual() {
  return (
    <div className={styles.panelCard}>
      <LoopReplay intervalMs={10800}>
        <PromptSequence />
      </LoopReplay>
    </div>
  );
}

/* ---- visual 2: base de conocimiento propia ---- */
function KnowledgeVisual() {
  return (
    <PhoneFrame>
      <LoopReplay intervalMs={11800}>
        <ChatSequence
          turns={[
            { from: "lead", text: "Hola! ¿Tienen sábanas y acolchados para reventa? Tengo un local de blanquería." },
            { from: "bot", text: "¡Hola! Sí, trabajamos con locales de blanquería 🙂 ¿Qué medidas te interesan — 1 plaza, 2 plazas o king?" },
            { from: "lead", text: "2 plazas y king, para arrancar unas 50 unidades." },
            { from: "bot", text: "Perfecto, para ese volumen te paso precio de lista mayorista. ¿Tenés CUIT para la cotización?" },
            { from: "bot", text: "Te armo la lista completa con precios y te la paso por acá mismo." },
          ]}
          tags={["fuente: catálogo propio", "precio: lista mayorista"]}
        />
      </LoopReplay>
    </PhoneFrame>
  );
}

/* ---- visual 3: reglas de calificación a medida ---- */
function ReglasVisual() {
  return (
    <PhoneFrame>
      <LoopReplay intervalMs={11800}>
        <ChatSequence
          turns={[
            { from: "lead", text: "Necesito 200 unidades para mi local, ¿tienen para entrega inmediata?" },
            { from: "bot", text: "¡Buenísimo! Para ese volumen te conviene precio mayorista. ¿Tenés local físico o vendés online?" },
            { from: "lead", text: "Tengo local en Flores y también vendo por Instagram." },
            { from: "bot", text: "Perfecto, te paso con nuestro equipo mayorista para coordinar entrega y cotización. ¿Me confirmás tu CUIT?" },
            { from: "bot", text: "Genial, en un rato te mando la cotización con todo el detalle." },
          ]}
          tags={["temperatura: caliente", "perfil: mayorista", "origen: TikTok"]}
        />
      </LoopReplay>
    </PhoneFrame>
  );
}

/* ---- visual 4: salida estructurada, no charla suelta ---- */
const OUTPUT_ROWS = [
  { label: "temperatura", value: "caliente", badge: true },
  { label: "interés", value: "compra por mayor" },
  { label: "presupuesto", value: "~$450.000" },
  { label: "próximo paso", value: "coordinar entrega" },
];

function OutputSequence() {
  return (
    <motion.div
      className={styles.flowList}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25, delayChildren: 0.15 } } }}
    >
      {OUTPUT_ROWS.map((r) => (
        <motion.div
          key={r.label}
          className={styles.flowItem}
          variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <motion.span
            className={styles.flowDot}
            variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
            transition={POP}
          />
          <div className={styles.flowBody}>
            <span className={styles.outputLabel}>{r.label}</span>
            {r.badge ? (
              <motion.span
                className={styles.outputBadge}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...POP, delay: 0.4 }}
              >
                {r.value}
              </motion.span>
            ) : (
              <span className={styles.outputValue}>{r.value}</span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function OutputVisual() {
  return (
    <div className={styles.panelCard}>
      <LoopReplay intervalMs={6600}>
        <OutputSequence />
      </LoopReplay>
    </div>
  );
}

/* ---- visual 5: deriva a un humano con criterio ---- */
function DerivaVisual() {
  return (
    <PhoneFrame>
      <LoopReplay intervalMs={12500}>
        <ChatSequence
          turns={[
            { from: "lead", text: "Esto ya lo hablé con alguien la semana pasada, ¿pueden revisar el estado de mi pedido especial?" },
            { from: "bot", text: "Contame tu nombre o número de pedido así reviso el historial." },
            { from: "lead", text: "Soy Marina Ibarra, pedido #4521." },
            { from: "bot", text: "Ahí lo veo — es por el ajuste que habías pedido, ¿no?" },
            { from: "lead", text: "Sí, ese mismo." },
            { from: "bot", text: "Dejame derivarte con Vendedor 1, que ya tiene tu caso — le paso toda la charla para que no tengas que repetir nada." },
          ]}
          extra={<div className={styles.handoffNote}>→ derivado a Vendedor 1 · con contexto completo</div>}
        />
      </LoopReplay>
    </PhoneFrame>
  );
}

/* ---- visual 6: uso de IA transparente ---- */
const USAGE_TARGET = 1284;
const USAGE_BARS = [40, 55, 48, 70, 60, 100];

function UsageSequence() {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? String(USAGE_TARGET) : "0");
  const mv = useMotionValue(0);

  useMotionValueEvent(mv, "change", (latest) => setDisplay(Math.round(latest).toLocaleString("es-AR")));

  useEffect(() => {
    if (shouldReduceMotion) return;
    const controls = animate(mv, USAGE_TARGET, { duration: 1.5, delay: 0.3, ease: EASE });
    return () => controls.stop();
  }, [shouldReduceMotion, mv]);

  return (
    <div className={styles.usageMock}>
      <div className={styles.usageTop}>
        <span className={styles.usageLabel}>mensajes este mes</span>
        <span className={styles.usageValue}>{display}</span>
      </div>
      <div className={styles.usageMeter} aria-hidden="true">
        <motion.div
          className={styles.usageMeterFill}
          initial={{ width: shouldReduceMotion ? "64%" : "0%" }}
          animate={{ width: "64%" }}
          transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
        />
      </div>
      <div className={styles.usageFoot}>
        <span>64% del plan</span>
        <span>costo estimado: $18.400</span>
      </div>
      <div className={styles.usageHistory}>
        <span className={styles.usageHistoryLabel}>últimos 6 meses</span>
        <div className={styles.usageBars} aria-hidden="true">
          {USAGE_BARS.map((h, i) => (
            <motion.span
              key={i}
              className={i === USAGE_BARS.length - 1 ? `${styles.usageBar} ${styles.usageBarLast}` : styles.usageBar}
              initial={{ height: shouldReduceMotion ? `${h}%` : "6%" }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.6 + i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UsageVisual() {
  return (
    <div className={styles.panelCard}>
      <LoopReplay intervalMs={6600}>
        <UsageSequence />
      </LoopReplay>
    </div>
  );
}

const ITEMS: { id: string; title: string; text: string; Visual: () => ReactNode }[] = [
  {
    id: "prompt",
    title: "Prompt guiado o modo avanzado",
    text: "Configurás cómo habla tu asistente con un formulario simple — tono, qué puede prometer, cuándo deriva a una persona. Si te copa escribir vos el prompt, el modo avanzado te deja hacerlo.",
    Visual: PromptVisual,
  },
  {
    id: "conocimiento",
    title: "Base de conocimiento propia",
    text: "Subís tu catálogo, tu lista de precios y tus preguntas frecuentes. El asistente responde con TU información, no con lo que la IA se imagina que vendés.",
    Visual: KnowledgeVisual,
  },
  {
    id: "reglas",
    title: "Reglas de calificación a medida",
    text: "Definís qué hace que un lead sea \"caliente\" para vos: ¿tiene CUIT? ¿pregunta por mayor? ¿mencionó presupuesto? El asistente extrae esos datos solo, en cada charla.",
    Visual: ReglasVisual,
  },
  {
    id: "salida",
    title: "Salida estructurada, no charla suelta",
    text: "Cada conversación termina en datos: temperatura (frío/tibio/caliente), interés, presupuesto estimado y próximo paso — listos para tu panel, no para que los busques vos.",
    Visual: OutputVisual,
  },
  {
    id: "deriva",
    title: "Deriva a un humano con criterio",
    text: "Si la IA no puede resolver algo, no improvisa: avisa y te pasa la posta, con todo el contexto de la charla para que no tengas que preguntar de nuevo.",
    Visual: DerivaVisual,
  },
  {
    id: "uso",
    title: "Uso de IA transparente",
    text: "Vas a ver, mes a mes, cuántos mensajes procesó tu asistente y qué costó — sin sorpresas en la factura ni letra chica.",
    Visual: UsageVisual,
  },
];

export function SystemAsistenteShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = ITEMS[active]!;
  const Current = current.Visual;

  // el visual activo tiene timers de hasta 650ms (CodeReveal) corriendo todo el tiempo que está
  // montado — sin esto seguían tickeando aunque el usuario estuviera mirando otra sección de la
  // página, y esos re-renders tan seguidos alcanzaban para trabar animaciones CSS en OTRAS
  // secciones (se notó como freezes sincronizados en el orbit/marquee de Multicanal). Desmontar
  // el visual mientras el showcase no está en pantalla corta esos timers de raíz.
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "200px" });

  // MOBILE = acordeón: apilado, la lista de 6 (con sus 6 descripciones largas) quedaba ARRIBA
  // y el stage abajo de todo — tocar una función cambiaba una demo que estaba a una pantalla y
  // media de distancia. Acá cada ítem muestra solo su título; el activo se abre con su texto y
  // su demo justo debajo. En desktop, igual que siempre (lista | stage).
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const userPicked = useRef(false);

  // al abrir un ítem, el que estaba abierto ARRIBA se cierra y todo sube: sin esto el ítem
  // tocado quedaba fuera de pantalla. Solo tras un toque del usuario (nunca en la carga).
  useEffect(() => {
    if (!isMobile || !userPicked.current) return;
    itemRefs.current[active]?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
  }, [active, isMobile, shouldReduceMotion]);

  const stage = (
    <div className={styles.showcaseStage}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          className={styles.showcaseStagePanel}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion || isMobile ? undefined : { opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {inView ? <Current /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className={styles.showcase} ref={containerRef}>
      <div className={styles.showcaseList} role="group" aria-label="Funciones del asistente">
        {ITEMS.map((item, i) => {
          const isActive = i === active;
          return (
            <Fragment key={item.id}>
              <button
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                aria-pressed={isActive}
                aria-expanded={isMobile ? isActive : undefined}
                className={cn(styles.showcaseItem, isActive && styles.showcaseItemActive)}
                onClick={() => {
                  userPicked.current = true;
                  setActive(i);
                }}
              >
                <span className={styles.showcaseItemIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.showcaseItemBody}>
                  <span className={styles.showcaseItemTitle}>{item.title}</span>
                  <span className={styles.showcaseItemText}>{item.text}</span>
                </span>
                <span className={styles.showcaseItemToggle} aria-hidden="true">
                  +
                </span>
              </button>
              {isMobile && isActive ? stage : null}
            </Fragment>
          );
        })}
      </div>

      {isMobile ? null : stage}
    </div>
  );
}
