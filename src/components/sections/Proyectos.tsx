import styles from "./Proyectos.module.css";
import { Section, Container, SectionHeader, CircularGallery, Tag } from "@/components/ui";
import type { GalleryItem } from "@/components/ui";

const PROJECTS: GalleryItem[] = [
    {
        id: "jornadas-misioneras",
        number: "01",
        title: "Jornadas Misioneras",
        description: "Plataforma de gestión de eventos misioneros a nivel nacional: alta de jornadas por país, provincia y localidad, con roles y permisos por usuario.",
        tech: ["Next.js", "Prisma", "Clerk"],
        href: "https://www.jornadasmisioneras.org/",
    },
    {
        id: "bgenai",
        number: "02",
        title: "BGenAI",
        description: "Plataforma de agentes de IA para empresas: automatizan procesos y se conectan a tus sistemas sin escribir código. Builder visual de flujos y chat en tiempo real.",
        tech: ["React", "LiveKit", "React Flow"],
        href: "https://bgenai.bizitglobal.com/",
    },
    {
        id: "red-misiones-mundiales",
        number: "03",
        title: "Red Misiones Mundiales",
        description: "Landing + backoffice para una red nacional de cooperación misionera: noticias, directorio de entidades y foros, con panel de administración separado por roles.",
        tech: ["Next.js", "Drizzle", "Clerk"],
        href: "https://www.redmisionesmundiales.org/",
    },
    {
        id: "bizideas",
        number: "04",
        title: "bizIDeas",
        description: "Landing institucional para una empresa de soluciones tecnológicas — IT, desarrollo a medida e IA. Motion cuidado de punta a punta.",
        tech: ["Next.js", "GSAP", "Tailwind"],
        href: "https://bizideasplus.com/",
    },
    {
        id: "sembrando-valores",
        number: "05",
        title: "Sembrando Valores",
        description: "Landing bilingüe (ES/EN) para una asociación civil: cuenta su obra social y canaliza donaciones y voluntariado, con scroll narrativo cuidado.",
        tech: ["Next.js", "GSAP", "i18next"],
        href: "https://www.sembrandovalores.org/",
    },
    {
        id: "bizit-global",
        number: "06",
        title: "Bizit Global",
        description: "Landing institucional de la software factory detrás de BGenAI y otros productos propios.",
        tech: ["React", "Vite", "MUI"],
        href: "https://www.bizitglobal.com/",
    },
    {
        id: "odis",
        number: "07",
        title: "Odis",
        description: "Gestión y resolución de conflictos con Inteligencia Artificial: SPA a medida para un servicio de mediación asistida.",
        tech: ["React", "Vite"],
        href: "https://odis.com.ar/",
    },
    {
        id: "lucas-singh",
        number: "08",
        title: "Lucas Singh — Portfolio",
        description: "Portfolio personal del dev detrás de +uno, en Next.js.",
        tech: ["Next.js", "TypeScript"],
        href: "https://lucassingh.com/",
    },
];

export function Proyectos() {
    return (
        <Section id="proyectos" bg="default" contained={false} className={styles.proyectos}>
            <div className={styles.pinned}>
            <div className={styles.stickyHeader}>
                <Container>
                    <SectionHeader
                        title="trabajos reales"
                        intro="Cada proyecto, con su propia lógica y su propia tecnología."
                        align="center"
                    />
                    <svg
                        className={styles.swipeHint}
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M2 7v10" />
                        <path d="M6 5v14" />
                        <rect width="12" height="18" x="10" y="3" rx="2" />
                    </svg>
                </Container>
            </div>

            {/* desktop: galería pineada con drag — "asombro y espectáculo" (Lucas). En touch,
                mezclar scroll-lock de la sección con drag horizontal es un gesto confuso, así que
                mobile usa una lista vertical simple en su lugar (mismo contenido, cero JS de
                drag/pin) — toggle puramente CSS, las dos existen en el DOM siempre. */}
            <div className={styles.desktopGallery}>
                <CircularGallery items={PROJECTS} />
            </div>

            <Container className={styles.mobileListWrap}>
                <ul className={styles.mobileList}>
                    {PROJECTS.map((p) => (
                        <li key={p.id}>
                            <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.mobileCard}>
                                <span className={styles.mobileNumber} aria-hidden="true">{p.number}</span>
                                <h3 className={styles.mobileTitle}>{p.title}</h3>
                                <p className={styles.mobileDescription}>{p.description}</p>
                                <ul className={styles.mobileTech}>
                                    {p.tech.map((tech) => (
                                        <li key={tech}>
                                            <Tag>{tech}</Tag>
                                        </li>
                                    ))}
                                </ul>
                            </a>
                        </li>
                    ))}
                </ul>
            </Container>
            </div>
        </Section>
    );
}
