"use client";

import { motion } from "motion/react";
import styles from "./SystemMulticanal.module.css";
import { LoopReplay } from "./LoopReplay";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const POP = { type: "spring" as const, stiffness: 340, damping: 22 };

/* ---- íconos de línea, simples y genéricos a propósito (no los logos reales con derechos de
   marca) — mismo criterio que MicIcon/ToneIcon en SystemAsistenteShowcase. ---- */

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20l1.4-4.2A8 8 0 1 1 9 18.6L4 20Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3C6.5 3 2 7 2 12c0 2.7 1.2 5.1 3.2 6.8V22l3-1.6c1.2.4 2.5.6 3.8.6 5.5 0 10-4 10-9S17.5 3 12 3Z" />
      <path d="m8 13 3-3 2 2 3-3" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3h6v3H9z" />
      <path d="M8 11h8M8 15h5" />
    </svg>
  );
}

function MetaAdsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 15c-2 0-3.5-1.5-3.5-3.5S6 8 8 8c1.6 0 2.6 1 4 3 1.4 2 2.4 3 4 3 2 0 3.5-1.5 3.5-3.5S17.6 8 16 8c-1.6 0-2.6 1-4 3-1.4 2-2.4 3-4 3Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4v10.5a3.5 3.5 0 1 1-2-3.16" />
      <path d="M14 4c.5 2 2 3.3 4 3.6" />
    </svg>
  );
}

function TiendaNubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ---- visual 1 (card "canales conversacionales"): bandeja unificada — 3 canales distintos,
   la MISMA card, cada uno con su color real (mismo criterio que WhatsApp en SystemAsistente:
   "colores reales, a propósito, es lo que hace que se lea como de verdad") y su propia
   respuesta, para que se note que acá el asistente conversa de los dos lados. ---- */
const CHANNEL_ROWS = [
  { id: "wa", name: "WhatsApp", message: "¿Tienen envío a Córdoba?", color: "#1dab61", Icon: WhatsAppIcon },
  { id: "ig", name: "Instagram", message: "Vi tu story, ¿el pack sigue?", color: "#d6249f", Icon: InstagramIcon },
  { id: "ms", name: "Messenger", message: "Quiero cambiar mi pedido", color: "#0084ff", Icon: MessengerIcon },
];

function ChannelRow({ row, index }: { row: (typeof CHANNEL_ROWS)[number]; index: number }) {
  return (
    <motion.div
      className={styles.channelRow}
      variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <span className={styles.channelIcon} style={{ color: row.color }}>
        <row.Icon />
      </span>
      <span className={styles.channelBody}>
        <span className={styles.channelName}>{row.name}</span>
        <span className={styles.channelMessage}>{row.message}</span>
      </span>
      <motion.span
        className={styles.channelReplied}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...POP, delay: 0.5 + index * 0.15 }}
      >
        <CheckIcon />
        <span className={styles.channelRepliedLabel}>respondido</span>
      </motion.span>
    </motion.div>
  );
}

function ChannelsSequence() {
  return (
    <motion.div
      className={styles.channelList}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } } }}
    >
      {CHANNEL_ROWS.map((row, i) => (
        <ChannelRow key={row.id} row={row} index={i} />
      ))}
    </motion.div>
  );
}

export function ChannelsVisual() {
  return (
    <div className={styles.channelsWrap}>
      <LoopReplay intervalMs={7200}>
        <ChannelsSequence />
      </LoopReplay>
    </div>
  );
}

/* ---- visual 2 (card "fuentes de leads"): feed de avisos — mismo idioma de timeline que
   .flowList en SystemAsistente, pero con ícono por fuente en vez de un punto liso, y SIN
   ninguna respuesta: son avisos de una sola dirección, no conversación. Todas las fuentes en
   violeta (a diferencia de los canales) a propósito: acá no importa la identidad de cada una,
   son solo datos entrando. ---- */
const FEED_ROWS = [
  { id: "form", source: "formulario web", Icon: FormIcon },
  { id: "meta", source: "Meta Ads", Icon: MetaAdsIcon },
  { id: "tiktok", source: "TikTok", Icon: TikTokIcon },
  { id: "nube", source: "Tienda Nube", Icon: TiendaNubeIcon },
];

function FeedRow({ row }: { row: (typeof FEED_ROWS)[number] }) {
  return (
    <motion.div
      className={styles.feedItem}
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <motion.span
        className={styles.feedIcon}
        variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
        transition={POP}
      >
        <row.Icon />
      </motion.span>
      <span className={styles.feedBody}>
        <span className={styles.feedLabel}>nuevo lead</span>
        <span className={styles.feedSource}>{row.source}</span>
      </span>
      <span className={styles.feedArrow}>
        <ArrowIcon />
      </span>
    </motion.div>
  );
}

function FeedSequence() {
  return (
    <motion.div
      className={styles.feedList}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } } }}
    >
      {FEED_ROWS.map((row) => (
        <FeedRow key={row.id} row={row} />
      ))}
    </motion.div>
  );
}

export function LeadsFeedVisual() {
  return (
    <div className={styles.panelCard}>
      <LoopReplay intervalMs={6400}>
        <FeedSequence />
      </LoopReplay>
    </div>
  );
}
