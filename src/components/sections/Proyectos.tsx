import styles from "./Proyectos.module.css";
import { Section, Container, SectionHeader, CircularGallery, Tag } from "@/components/ui";
import type { GalleryItem } from "@/components/ui";

// campIA y Actus van primero: son productos propios de +uno (no trabajos para clientes) y el
// texto lo dice, para que quien revise la marca (por ejemplo Meta, con el nombre de WhatsApp
// de cada uno) vea la relación entre masuno.io y el sitio de cada producto.
const PROJECTS: GalleryItem[] = [
    {
        id: "campia",
        number: "01",
        title: "campIA",
        description: "Producto propio de +uno: asistente de IA por WhatsApp para el campo. Registra siembra, hacienda, gastos y facturas desde el chat y muestra el margen por lote en un dashboard.",
        tech: ["Next.js", "Claude", "WhatsApp API"],
        href: "https://campia.app/",
    },
    {
        id: "actus",
        number: "02",
        title: "Actus",
        description: "Producto propio de +uno: asistente de mantenimiento industrial por WhatsApp. Captura lo que saben los técnicos de planta y lo devuelve con los manuales y los casos anteriores.",
        tech: ["Next.js", "Claude", "pgvector"],
        href: "https://actusagent.io/",
    },
    {
        id: "jornadas-misioneras",
        number: "03",
        title: "Jornadas Misioneras",
        description: "Plataforma de gestión de eventos misioneros a nivel nacional: alta de jornadas por país, provincia y localidad, con roles y permisos por usuario.",
        tech: ["Next.js", "Prisma", "Clerk"],
        href: "https://www.jornadasmisioneras.org/",
    },
    {
        id: "bgenai",
        number: "04",
        title: "BGenAI",
        description: "Plataforma de agentes de IA para empresas: automatizan procesos y se conectan a tus sistemas sin escribir código. Builder visual de flujos y chat en tiempo real.",
        tech: ["React", "LiveKit", "React Flow"],
        href: "https://bgenai.bizitglobal.com/",
    },
    {
        id: "red-misiones-mundiales",
        number: "05",
        title: "Red Misiones Mundiales",
        description: "Landing + backoffice para una red nacional de cooperación misionera: noticias, directorio de entidades y foros, con panel de administración separado por roles.",
        tech: ["Next.js", "Drizzle", "Clerk"],
        href: "https://www.redmisionesmundiales.org/",
    },
    {
        id: "bizideas",
        number: "06",
        title: "bizIDeas",
        description: "Landing institucional para una empresa de soluciones tecnológicas — IT, desarrollo a medida e IA. Motion cuidado de punta a punta.",
        tech: ["Next.js", "GSAP", "Tailwind"],
        href: "https://bizideasplus.com/",
    },
    {
        id: "sembrando-valores",
        number: "07",
        title: "Sembrando Valores",
        description: "Landing bilingüe (ES/EN) para una asociación civil: cuenta su obra social y canaliza donaciones y voluntariado, con scroll narrativo cuidado.",
        tech: ["Next.js", "GSAP", "i18next"],
        href: "https://www.sembrandovalores.org/",
    },
    {
        id: "bizit-global",
        number: "08",
        title: "Bizit Global",
        description: "Landing institucional de la software factory detrás de BGenAI y otros productos propios.",
        tech: ["React", "Vite", "MUI"],
        href: "https://www.bizitglobal.com/",
    },
    {
        id: "odis",
        number: "09",
        title: "Odis",
        description: "Gestión y resolución de conflictos con Inteligencia Artificial: SPA a medida para un servicio de mediación asistida.",
        tech: ["React", "Vite"],
        href: "https://odis.com.ar/",
    },
    {
        id: "lucas-singh",
        number: "10",
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
