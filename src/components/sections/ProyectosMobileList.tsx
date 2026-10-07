"use client";

import { useState } from "react";
import styles from "./Proyectos.module.css";
import { Button, Tag } from "@/components/ui";
import type { GalleryItem } from "@/components/ui";

/** cuántos proyectos se ven de entrada en mobile — el resto queda detrás de "ver todos". */
const INITIAL = 4;

/** Lista vertical de proyectos para mobile (la galería pineada + drag de desktop no aplica en
 * touch). Con 10 proyectos eran ~3000px de cards seguidas: arranca con los primeros 4 y un
 * botón despliega el resto, sin perder ninguno. */
export function ProyectosMobileList({ projects }: { projects: GalleryItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? projects : projects.slice(0, INITIAL);
  const hidden = projects.length - INITIAL;

  return (
    <>
      <ul className={styles.mobileList} id="proyectos-lista">
        {visible.map((p) => (
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
      {!expanded && hidden > 0 ? (
        <div className={styles.mobileMore}>
          <Button variant="outline" onClick={() => setExpanded(true)} className={styles.mobileMoreBtn}>
            ver los {projects.length} proyectos
          </Button>
        </div>
      ) : null}
    </>
  );
}
