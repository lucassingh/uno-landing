import type { Metadata } from "next";
import styles from "./links.module.css";

export const metadata: Metadata = {
  title: "+uno — links",
  description:
    "MÁS UNO · webs a medida que venden y automatización de leads. Agendá tu reunión gratis o conocé la web.",
  openGraph: {
    title: "+uno — links",
    description:
      "Webs a medida que venden y automatización de leads. Agendá tu reunión gratis.",
    type: "website",
  },
};

interface LinkItem {
  idx: string;
  title: string;
  desc: string;
  href: string;
  primary?: boolean;
}

const LINKS: LinkItem[] = [
  {
    idx: "01",
    title: "agendá tu reunión gratis",
    desc: "miramos tu web para ver qué falta sin costo",
    href: "https://calendly.com/lucas-singh10/mas-uno-auditoria-gratis-de-tu-web?utm_source=instagram&utm_medium=bio&utm_content=reunion",
    primary: true,
  },
  {
    idx: "02",
    title: "nuestra web",
    desc: "masuno.io — qué hacemos y cómo trabajamos",
    href: "https://masuno.io/?utm_source=instagram&utm_medium=bio&utm_campaign=linkhub",
  },
];

export default function LinksPage() {
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.topline}>
          <span className={styles.mark} aria-label="más uno">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect
                className={styles.markCell}
                x="14"
                y="14"
                width="36"
                height="36"
                rx="4"
                transform="rotate(-21 32 32)"
              />
            </svg>
          </span>
          <span className={styles.toplineLabel}>más uno · ®</span>
        </div>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>web + automatización</p>
          <h1 className={styles.h1}>
            no sos uno más.
            <br />
            <span className={styles.soft}>tu web tampoco.</span>
          </h1>
          <p className={styles.sub}>
            webs a medida que venden y automatización de leads. elegí por dónde seguir.
          </p>
        </header>

        <nav className={styles.links}>
          {LINKS.map((l) => (
            <a
              key={l.idx}
              className={l.primary ? `${styles.lk} ${styles.lkPrimary}` : styles.lk}
              href={l.href}
            >
              <span className={styles.idx}>{l.idx}</span>
              <span className={styles.lkBody}>
                <span className={styles.lkTitle}>{l.title}</span>
                <span className={styles.lkDesc}>{l.desc}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </a>
          ))}
          {/* OPCIONAL · WhatsApp: descomentá y reemplazá 549XXXXXXXXXX por tu número
          <a className={styles.lk} href="https://wa.me/549XXXXXXXXXX?text=Hola%20%2Buno">
            <span className={styles.idx}>03</span>
            <span className={styles.lkBody}>
              <span className={styles.lkTitle}>escribinos por whatsapp</span>
              <span className={styles.lkDesc}>respondemos de una</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>
          */}
        </nav>

        <footer className={styles.foot}>
          <span>@masuno.io</span>
          <span>sin plantillas. con criterio</span>
        </footer>
      </div>
    </main>
  );
}
