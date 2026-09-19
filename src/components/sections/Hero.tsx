"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import styles from "./Hero.module.css";
import { Logo } from "@/components/ui/Logo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Cubes } from "@/components/ui/Cubes";
import { useSiteReady } from "@/components/ui/Loader";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const ready = useSiteReady();

  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        <motion.div
          className={styles.copy}
          variants={shouldReduceMotion ? undefined : container}
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : ready ? "show" : "hidden"}
        >
          <motion.p className={styles.setup} variants={shouldReduceMotion ? undefined : item}>
            las webs se parecen todas.
          </motion.p>
          <motion.p className={styles.punch} variants={shouldReduceMotion ? undefined : item}>
            la tuya, no.
          </motion.p>
          <motion.div className={styles.wordmarkWrap} variants={shouldReduceMotion ? undefined : item}>
            <Logo variant="wordmark" />
          </motion.div>
          <motion.div variants={shouldReduceMotion ? undefined : item}>
            <Eyebrow className={styles.tagline}>Diseño web + automatización, a medida</Eyebrow>
          </motion.div>
        </motion.div>
        <div className={styles.visual}>
          <Cubes ready={ready} />
        </div>
      </div>
    </section>
  );
}
