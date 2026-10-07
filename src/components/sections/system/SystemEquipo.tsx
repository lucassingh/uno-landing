import styles from "./SystemEquipo.module.css";
import { Section, SectionHeader, ScrollReveal } from "@/components/ui";

type Access = "full" | "view" | "none";

const AREAS = ["Leads", "Stock", "Facturación", "Configuración"];

const ACCESS_LABEL: Record<Access, string> = { full: "acceso completo", view: "solo lectura", none: "sin acceso" };

const ROLES: { name: string; access: Access[] }[] = [
  { name: "Dueño", access: ["full", "full", "full", "full"] },
  { name: "Vendedor", access: ["full", "view", "none", "none"] },
  { name: "Encargado", access: ["full", "full", "view", "none"] },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M15 10h3M15 14h3M5 16.5c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5" />
    </svg>
  );
}

function AccessDot({ level }: { level: Access }) {
  if (level === "full") {
    return (
      <span className={styles.cell}>
        <span className={styles.dotFull}>
          <CheckIcon />
        </span>
      </span>
    );
  }
  if (level === "view") {
    return (
      <span className={styles.cell}>
        <span className={styles.dotView}>
          <EyeIcon />
        </span>
      </span>
    );
  }
  return (
    <span className={styles.cell}>
      <span className={styles.dotNone}>—</span>
    </span>
  );
}

const SUPPORT = [
  {
    title: "Autenticación segura",
    text: "Login, sesiones y datos corren sobre infraestructura profesional, pensada para que nunca tengas un susto de seguridad.",
    Icon: LockIcon,
  },
  {
    title: "Tu cuenta, a la vista",
    text: "Perfil de tu negocio, plan contratado y facturación, todo accesible sin llamar a nadie para pedir un dato.",
    Icon: IdIcon,
  },
];

export function SystemEquipo() {
  return (
    <Section id="equipo" bg="default">
      <ScrollReveal>
        <SectionHeader
          eyebrow="tu equipo, tus datos"
          title="cada negocio ve solo lo suyo."
          intro="Tus datos son tuyos y de nadie más: tus charlas, tu catálogo y tu información nunca se mezclan con los de otro negocio."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className={styles.legend} aria-hidden="true">
          <span className={styles.legendItem}>
            <span className={styles.dotFull} style={{ width: "1.1rem", height: "1.1rem" }}>
              <CheckIcon />
            </span>
            acceso completo
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dotView} style={{ width: "1.1rem", height: "1.1rem" }}>
              <EyeIcon />
            </span>
            solo lectura
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dotNone}>—</span>
            sin acceso
          </span>
        </div>

        <div className={styles.matrixCard}>
          <table className={styles.matrix}>
            <thead>
              <tr>
                <th scope="col" />
                {AREAS.map((area) => (
                  <th key={area} scope="col">
                    {area}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => (
                <tr key={role.name}>
                  <th scope="row">{role.name}</th>
                  {role.access.map((level, i) => (
                    <td key={AREAS[i]}>
                      <AccessDot level={level} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile: la matriz (min-width 32rem) no entra en un celular — se cortaba en
            "FACTUR…" y había que adivinar que scrolleaba de costado. Acá, un bloque por rol con
            sus 4 áreas en grilla 2×2: el mismo dato, leído de arriba a abajo. */}
        <ul className={styles.roleList}>
          {ROLES.map((role) => (
            <li key={role.name} className={styles.role}>
              <h3 className={styles.roleName}>{role.name}</h3>
              <ul className={styles.roleAreas}>
                {role.access.map((level, i) => (
                  <li
                    key={AREAS[i]}
                    className={styles.roleArea}
                    data-access={level}
                  >
                    <AccessDot level={level} />
                    <span>
                      {AREAS[i]}
                      <span className={styles.srOnly}>: {ACCESS_LABEL[level]}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className={styles.support}>
          {SUPPORT.map((s) => (
            <div key={s.title} className={styles.supportItem}>
              <span className={styles.supportIcon}>
                <s.Icon />
              </span>
              <div className={styles.supportBody}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}
