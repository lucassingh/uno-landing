"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import styles from "./SystemMulticanal.module.css";
import { ChannelsVisual, LeadsFeedVisual } from "./SystemMulticanalVisuals";

export function SystemMulticanalBento() {
  // Los visuales de acá corren timers propios (LoopReplay) todo el tiempo que estén montados —
  // sin este gate siguen tickeando aunque la sección esté lejos de pantalla, exactamente el bug
  // que trabó animaciones en OTRAS secciones cuando pasó en Asistente (ver comentario en
  // SystemAsistenteShowcase.tsx). margin:200px los monta un poco antes de entrar en pantalla.
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "200px" });

  return (
    <div ref={containerRef}>
      <div className={styles.bentoGrid}>
        <div className={styles.bentoCard}>
          <div className={styles.bentoVisual} aria-hidden="true">
            {inView ? <ChannelsVisual /> : null}
          </div>
          <div className={styles.bentoBody}>
            <h3>canales conversacionales</h3>
            <p>WhatsApp, Instagram Direct y Messenger — todo en la misma bandeja, con el mismo criterio de respuesta.</p>
          </div>
        </div>

        <div className={styles.bentoCard}>
          <div className={styles.bentoVisual} aria-hidden="true">
            {inView ? <LeadsFeedVisual /> : null}
          </div>
          <div className={styles.bentoBody}>
            <h3>fuentes de leads</h3>
            <p>Formularios, Meta Ads, TikTok, Tienda Nube — cualquier lugar donde aparezca un lead nuevo cae ordenado en el panel.</p>
          </div>
        </div>
      </div>

      <div className={styles.banner}>
        <p>Vos elegís qué conectar. El panel no le pregunta a tu lead por dónde llegó — ya lo sabe.</p>
      </div>
    </div>
  );
}
