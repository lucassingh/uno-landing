import styles from "./Footer.module.css";
import { Container, Logo } from "@/components/ui";
import { site } from "@/content/site";

export function Footer() {
  const { footer } = site;
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo variant="white" />
            <p className={styles.tagline}>{footer.tagline}</p>
          </div>
          <nav className={styles.cols} aria-label="Pie">
            {footer.columns.map((col) => (
              <div key={col.title} className={styles.col}>
                <h3 className={styles.colTitle}>{col.title}</h3>
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
        </div>
        <div className={styles.bottom}>
          <span>{footer.legal}</span>
          <a href={"mailto:" + footer.email} className={styles.email}>
            {footer.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
