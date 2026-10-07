"use client";

import { useRef } from "react";
import type { MotionValue } from "motion/react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import styles from "./SystemCaso.module.css";
import { Section, Container, SectionHeader } from "@/components/ui";

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16l-6 8v6l-4 2v-8z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3v6.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.83z" />
      <circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PanelIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2h9l3 3v17l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

type Paso = { title: string; text: string; Icon: () => React.JSX.Element };

const PASOS: Paso[] = [
  {
    title: "llega el mensaje",
    text: "Alguien te escribe por WhatsApp, Instagram o el canal que tengas conectado, preguntando por un producto.",
    Icon: MessageIcon,
  },
  {
    title: "asistente filtra",
    text: "Pregunta lo justo y necesario para entender qué necesita y si es un cliente real, no un curioso.",
    Icon: FilterIcon,
  },
  {
    title: "se califica solo",
    text: "Se carga como lead calificado — con el canal de origen y el interés detectado, sin que nadie lo tipee a mano.",
    Icon: TagIcon,
  },
  {
    title: "cae en el panel",
    text: "El dueño lo ve en el panel, ya ordenado por etapa, con toda la charla y los datos a la vista.",
    Icon: PanelIcon,
  },
  {
    title: "se cierra la venta",
    text: "Al facturar, el stock se actualiza solo — sin planilla aparte, sin contar nada a mano.",
    Icon: ReceiptIcon,
  },
];

function bandOf(index: number, total: number) {
  const thr = index / (total - 1);
  return { lo: Math.max(0, thr - 0.08), hi: Math.min(1, thr + 0.02) };
}

/* Perfil de opacidad de una caption que comparte celda de grid con las demás (crossfade real,
   no solo fade-in): sube en su propia banda [inLo,inHi] y vuelve a bajar apenas arranca el
   paso siguiente. La bajada es MUCHO más angosta que la subida (0.02 contra 0.10) a propósito:
   con las dos simétricas, el texto de dos captions quedaba superpuesto y era ilegible durante
   ese tramo — un crossfade de opacity funciona para fotos, no para texto (Lucas: "queda
   horrible"). Angostando la salida, el paso anterior se apaga casi de golpe en cuanto el
   siguiente empieza a entrar, así se ve como una transición rápida y limpia, no doble
   exposición. Para el último paso no hay "siguiente": el tramo de salida se manda bien lejos
   de [0,1] (donde vive scrollYProgress) para que nunca se dispare y quede en opacity:1 hasta
   el final — así todas las instancias llaman a useTransform con la misma forma, sin un branch
   por índice. */
function useCaptionMotion(index: number, total: number, progress: MotionValue<number>) {
  const { lo: inLo, hi: inHi } = bandOf(index, total);
  const isLast = index === total - 1;
  const next = bandOf(Math.min(index + 1, total - 1), total);
  const outLo = isLast ? 1.5 : next.lo;
  const outHi = isLast ? 1.6 : outLo + 0.02;
  const opacity = useTransform(progress, [inLo, inHi, outLo, outHi], [0, 1, 1, 0]);
  const y = useTransform(progress, [inLo, inHi], [22, 0]);
  return { opacity, y };
}

function ProgressFill({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  if (reduce) {
    return <div className={styles.progressFill} style={{ transform: "scale(1, 1)" }} />;
  }
  return <motion.div className={styles.progressFill} style={{ scaleX: progress, scaleY: progress }} />;
}

function Dot({
  index,
  total,
  progress,
  reduce,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const { lo, hi } = bandOf(index, total);
  // sin blur (no existe en el resto del sitio): el punto activo cambia de color en seco —
  // fondo y número invierten juntos, más el mismo pop de escala que el resto de las micro-
  // interacciones de la marca. Número, no ícono: el ícono del paso ya está en la card grande
  // de abajo, repetirlo acá era redundante (feedback de Lucas).
  const background = useTransform(progress, [lo, hi], ["#EFECFD", "#3A10E5"]);
  const color = useTransform(progress, [lo, hi], ["#031844", "#FFFFFF"]);
  const scale = useTransform(progress, [lo, hi], [0.88, 1]);
  const number = String(index + 1).padStart(2, "0");
  // el primer paso ya está "dado" en cuanto el pin engancha, no necesita esperar su propio
  // cambio de color — evita un parpadeo de un frame en el estado "sin llegar" apenas arranca
  // el scroll dentro del carril.
  if (reduce || index === 0) {
    return (
      <span className={styles.dot} style={{ background: "#3A10E5", color: "#FFFFFF" }}>
        <span className={styles.dotNumber}>{number}</span>
      </span>
    );
  }
  return (
    <motion.span className={styles.dot} style={{ background, color, scale }}>
      <span className={styles.dotNumber}>{number}</span>
    </motion.span>
  );
}

function StageCaption({
  index,
  total,
  progress,
  reduce,
  title,
  text,
  Icon,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
  title: string;
  text: string;
  Icon: () => React.JSX.Element;
}) {
  const { opacity, y } = useCaptionMotion(index, total, progress);

  return (
    <motion.div className={styles.caption} style={{ opacity, y: reduce ? 0 : y }}>
      <span className={styles.stageIcon} aria-hidden="true">
        <Icon />
      </span>
      <div className={styles.stageBody}>
        <h3 className={styles.stageTitle}>{title}</h3>
        <p className={styles.stageText}>{text}</p>
      </div>
    </motion.div>
  );
}

export function SystemCaso() {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.5 });

  return (
    <Section id="caso" bg="default" contained={false}>
      <Container>
        <SectionHeader
          eyebrow="cómo lo hace el sistema"
          title="así se ve un pedido, de punta a punta."
          intro="Desde que llega el primer mensaje hasta que la venta queda registrada — así recorre el sistema cada consulta, sin que nadie toque una planilla."
        />

        {/* mobile: el carril pineado de 300vh (scroll congelado para ver pasar 5 captions) no
            funciona en un celular — acá los 5 pasos van como una línea de tiempo vertical
            dentro de una card, todo a la vista. Toggle puro CSS; en desktop sigue el pin. */}
        <ol className={styles.mobileSteps}>
          {PASOS.map((p, i) => (
            <li key={p.title} className={styles.mobileStep}>
              <span className={styles.mobileDot} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.mobileBody}>
                <h3 className={styles.mobileTitle}>
                  <span className={styles.mobileIcon} aria-hidden="true">
                    <p.Icon />
                  </span>
                  {p.title}
                </h3>
                <p className={styles.mobileText}>{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <div className={styles.track} ref={trackRef}>
        <div className={styles.pin}>
          <div className={styles.stage}>
            <div className={styles.stepper}>
              <div className={styles.progressLine} aria-hidden="true">
                <ProgressFill progress={progress} reduce={reduce} />
              </div>
              <div className={styles.dots} aria-hidden="true">
                {PASOS.map((p, i) => (
                  <Dot key={p.title} index={i} total={PASOS.length} progress={progress} reduce={reduce} />
                ))}
              </div>
            </div>

            <div className={styles.captionCard}>
              {/* marco persistente: se pinta una sola vez y no cruza con nada — antes vivía
                  adentro de cada una de las 5 captions y con la rifa de opacidades del
                  crossfade se veía parpadear (Lucas). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/isotipo-color.svg" alt="" className={styles.captionWatermark} />
              <div className={styles.captionWrap}>
                {PASOS.map((p, i) => (
                  <StageCaption
                    key={p.title}
                    index={i}
                    total={PASOS.length}
                    progress={progress}
                    reduce={reduce}
                    title={p.title}
                    text={p.text}
                    Icon={p.Icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
