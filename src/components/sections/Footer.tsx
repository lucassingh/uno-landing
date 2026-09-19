"use client";

import { useState, type FormEvent } from "react";
import styles from "./Footer.module.css";
import { Container, Button, AsteriskIcon, StrokeMark } from "@/components/ui";

interface FooterColumn {
    title: string;
    links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
    {
        title: "Navegación",
        links: [
            { label: "Servicios", href: "#servicios" },
            { label: "Sistema +uno", href: "#sistema" },
            { label: "Método", href: "#metodo" },
            { label: "Proyectos", href: "#proyectos" },
            { label: "Precios", href: "#precios" },
        ],
    },
    {
        title: "Más",
        links: [
            { label: "Testimonios", href: "#testimonios" },
            { label: "FAQ", href: "#faq" },
            { label: "Contacto", href: "#contacto" },
        ],
    },
];

function InstagramIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8.5 19.5L3 21Z" />
            <path d="M8.5 9.7c0 3 2.5 5.5 5.5 5.5" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

const SOCIALS = [
    { label: "Instagram", href: "#", Icon: InstagramIcon },
    { label: "WhatsApp", href: "#", Icon: WhatsAppIcon },
    { label: "Email", href: "mailto:hola@masuno.com", Icon: MailIcon },
];

export function Footer() {
    const [subscribed, setSubscribed] = useState(false);

    function handleSubscribe(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubscribed(true);
    }

    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.top}>
                    <nav className={styles.cols} aria-label="Pie de página">
                        {COLUMNS.map((col) => (
                            <div key={col.title} className={styles.col}>
                                <span className={styles.colTitle}>{col.title}</span>
                                <ul className={styles.links}>
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className={styles.link}>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <div className={styles.side}>
                        {/* card "de siempre" (fondo blanco, texto navy) — pero sobre fondo navy el
                            border/shadow default (pensados para page bg clara) desaparecerían, así
                            que van en blanco, mismo criterio que .textCard en StickyScroll y
                            .cardInvert en Pricing (ver Footer.module.css). */}
                        <div className={styles.newsletter}>
                            {/* sin foto de stock (mismo criterio que Proyectos/Testimonios): el "+"
                                grande sobre una trama de puntos hace de imagen, con nuestro radius,
                                no el pill redondeado del original. */}
                            <div className={styles.newsletterImage} aria-hidden="true">
                                <AsteriskIcon size={44} className={styles.newsletterMark} />
                            </div>
                            <h3 className={styles.newsletterTitle}>sumate a la lista</h3>
                            <p className={styles.newsletterText}>
                                Ideas, casos y algún consejo directo sobre diseño y desarrollo web. Sin spam, cada tanto nomás.
                            </p>
                            {subscribed ? (
                                <p className={styles.subscribed} role="status">
                                    ¡Listo! Ya estás en la lista.
                                </p>
                            ) : (
                                <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                                    <label className={styles.srOnly} htmlFor="footer-email">
                                        Email
                                    </label>
                                    <input
                                        className={styles.newsletterInput}
                                        id="footer-email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                    <Button type="submit" variant="primary" size="md" className={styles.newsletterBtn}>
                                        Suscribirme
                                    </Button>
                                </form>
                            )}
                        </div>

                        <div className={styles.follow}>
                            <span className={styles.followTitle}>Seguinos</span>
                            <div className={styles.followIcons}>
                                {SOCIALS.map(({ label, href, Icon }) => (
                                    <a key={label} href={href} className={styles.followIcon} aria-label={label}>
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* logo gigante + barra legal: A PROPÓSITO fuera del Container (a diferencia del resto
                del footer) — no queda atado al max-width de 1240px, con su propio inset fijo
                de 30px (no 0: "100% de lado a lado" era demasiado literal). */}
            <div className={styles.legalBleed}>
                <StrokeMark className={styles.bigLogo} />
                <div className={styles.divider} aria-hidden="true" />
                <div className={styles.bottom}>
                    <span>© 2026 más uno · diseño web + automatización, a medida.</span>
                    <a href="mailto:hola@masuno.com" className={styles.email}>
                        hola@masuno.com
                    </a>
                </div>
            </div>
        </footer>
    );
}
