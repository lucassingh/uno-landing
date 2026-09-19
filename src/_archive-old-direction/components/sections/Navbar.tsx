"use client";

import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Button, Logo } from "@/components/ui";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={styles.header}>
      <div className={cn(styles.stage, scrolled && styles.stageScrolled)}>
        <div className={styles.bar}>
          <div className={styles.inner}>
            <a href="#top" className={styles.brand} aria-label="más uno — inicio">
              <Logo variant="isotipo-white" style={{ height: "clamp(22px, 2.4vw, 28px)", width: "auto" }} />
            </a>
            <nav className={styles.nav} aria-label="Principal">
              {site.nav.map((item) => (
                <a key={item.href} href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ))}
            </nav>
            <Button href={site.navCta.href} variant="accent" size="sm" className={styles.cta}>
              {site.navCta.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
