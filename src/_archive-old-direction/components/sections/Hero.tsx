"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import styles from "./Hero.module.css";
import { site } from "@/content/site";

const FaultyTerminal = dynamic(() => import("@/components/ui/FaultyTerminal").then((m) => m.FaultyTerminal), {
  ssr: false,
});

const EASE = [0.16, 1, 0.3, 1] as const;
const CAT_DELAY_MS = 2000;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [catVisible, setCatVisible] = useState(false);

  useEffect(() => {
    const delay = prefersReducedMotion ? 0 : CAT_DELAY_MS;
    const t = setTimeout(() => setCatVisible(true), delay);
    return () => clearTimeout(t);
  }, [prefersReducedMotion]);

  const dur = (seconds: number) => (prefersReducedMotion ? 0.01 : seconds);

  const logoVariants: Variants = {
    hidden: { y: "100%" },
    visible: { y: "0%", transition: { duration: dur(1.1), ease: EASE } },
  };

  const taglineVariants: Variants = {
    hidden: { y: "100%" },
    visible: { y: "0%", transition: { duration: dur(0.8), ease: EASE, delay: prefersReducedMotion ? 0 : 0.7 } },
  };

  const catVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: "0%", opacity: 1, transition: { duration: dur(0.8), ease: EASE } },
  };

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <FaultyTerminal
          tint="#FF005C"
          digitSize={1}
          scale={1.3}
          curvature={0.12}
          scanlineIntensity={0.35}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          mouseReact
          mouseStrength={0.25}
          pageLoadAnimation
          brightness={1.15}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.block}>
          <div className={styles.logoMask} role="img" aria-label={`${site.brand.wordmark} — ${site.brand.tagline}`}>
            <motion.img
              src="/logo/wordmark-white.svg"
              alt=""
              aria-hidden="true"
              className={styles.logo}
              initial="hidden"
              animate="visible"
              variants={logoVariants}
            />
          </div>
          <div className={styles.taglineMask}>
            <motion.p className={styles.tagline} initial="hidden" animate="visible" variants={taglineVariants}>
              {site.brand.tagline}
            </motion.p>
          </div>
        </div>
      </div>

      <motion.div
        className={styles.cat}
        initial="hidden"
        animate={catVisible ? "visible" : "hidden"}
        variants={catVariants}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/gato.png" alt="" aria-hidden="true" className={styles.catImg} />
      </motion.div>
    </section>
  );
}
