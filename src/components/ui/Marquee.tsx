import styles from "./Marquee.module.css";

/** Cinta de texto que corre. Duplica el contenido para loop continuo. */
export function Marquee({ items, separator = "✳" }: { items: string[]; separator?: string }) {
  const track = [...items, ...items];
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.track}>
        {track.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.sep}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
