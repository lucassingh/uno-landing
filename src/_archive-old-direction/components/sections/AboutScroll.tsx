"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutScroll.module.css";
import { Noise } from "@/components/ui";
import { site } from "@/content/site";
import { theme } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

const PixelTrail = dynamic(() => import("@/components/ui/PixelTrail").then((m) => m.PixelTrail), { ssr: false });

const PALETTE = [theme.colors.rosa, theme.colors.cyan, theme.colors.amarillo, theme.colors.verde, theme.colors.naranja];
const PALETTE_STEP_MS = 2200;

export function AboutScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<HTMLSpanElement[][]>([]);
  const descRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const highlightRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { beats } = site.aboutScroll;

  const [trailColor, setTrailColor] = useState(PALETTE[0]!);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % PALETTE.length;
      setTrailColor(PALETTE[i]!);
    }, PALETTE_STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      const allChars = charRefs.current.flat();
      const allDescs = descRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
      const allHighlights = highlightRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
      if (!allChars.length || allDescs.length !== beats.length || allHighlights.length !== beats.length) return;

      gsap.set(allChars, { opacity: 0, rotateX: -92 });
      gsap.set(allDescs, { opacity: 0, y: 24 });
      gsap.set(allHighlights, { backgroundColor: "rgba(0,0,0,0)" });
      gsap.set(line, { scaleY: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${beats.length * 170}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      });

      beats.forEach((beat, i) => {
        const chars = charRefs.current[i] ?? [];
        const desc = descRefs.current[i]!;
        const highlight = highlightRefs.current[i]!;

        tl.to(highlight, { backgroundColor: theme.colors[beat.accent], duration: 0.5 });
        tl.to(
          chars,
          {
            opacity: 1,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.06,
            ease: "expo.out",
          },
          "<"
        );
        tl.to(desc, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35");
        tl.to({}, { duration: 0.5 });

        if (i < beats.length - 1) {
          tl.to([...chars, desc], { opacity: 0, y: -40, duration: 0.5, ease: "power1.in" });
          tl.to(highlight, { backgroundColor: "rgba(0,0,0,0)", duration: 0.5 }, "<");
        }
      });

      // la línea crece de forma continua a lo largo de todo el pin (y se retrae si scrolleás para arriba)
      tl.to(line, { scaleY: 1, ease: "none", duration: tl.duration() }, 0);
    }, root);

    return () => ctx.revert();
  }, [beats]);

  return (
    <section id={site.aboutScroll.id} ref={rootRef} className={styles.section}>
      <div className={styles.stage}>
        <PixelTrail
          className={styles.pixelTrail}
          gridSize={44}
          trailSize={0.12}
          maxAge={400}
          interpolate={6}
          color={trailColor}
        />

        <div ref={lineRef} className={styles.line} aria-hidden="true" />

        {beats.map((beat, i) => {
          const chars: HTMLSpanElement[] = [];
          charRefs.current[i] = chars;
          return (
            <div key={beat.index} className={styles.panel}>
              <div className={styles.textMask}>
                <div
                  className={styles.highlightBox}
                  ref={(el) => {
                    highlightRefs.current[i] = el;
                  }}
                >
                  <h2 className={styles.title}>
                    <span className={styles.srOnly}>{beat.title}</span>
                    <span className={styles.chars} aria-hidden="true">
                      {Array.from(beat.title).map((char, ci) => (
                        <span className={styles.charSegment} key={ci}>
                          <span
                            className={styles.charPiece}
                            ref={(el) => {
                              if (el) chars[ci] = el;
                            }}
                          >
                            {char === " " ? " " : char}
                          </span>
                        </span>
                      ))}
                    </span>
                  </h2>
                </div>
                <p
                  className={styles.description}
                  ref={(el) => {
                    descRefs.current[i] = el;
                  }}
                >
                  {beat.description}
                </p>
              </div>
            </div>
          );
        })}

        <Noise className={styles.noise} patternAlpha={12} />
      </div>
    </section>
  );
}
