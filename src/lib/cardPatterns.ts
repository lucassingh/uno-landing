// A 45° el patrón no avanza en línea recta: moverse Npx en horizontal/vertical hace avanzar
// el patrón N/√2 a lo largo de su propio eje, así que el paso real de repetición en cada eje
// es P×√2, no P (ver CircularGallery, que originó esta cuenta con más detalle). Acá P=25.
const DIAGONAL_STEP = 25 / Math.sqrt(2); // ≈17.68px

/** 3 tramas CSS-only (grilla técnica, puntos, diagonal) — usadas primero en las cards de
 * Proyectos (CircularGallery) y reutilizadas donde haga falta variedad sin fotos de stock.
 * `lineColor` es cualquier color CSS válido — pasá un color-mix con transparencia para una
 * versión más sutil (ej. cards del bento de Servicios). */
export function cardPatterns(lineColor: string): string[] {
  return [
    `repeating-linear-gradient(${lineColor} 0 1.5px, transparent 1.5px 25px), repeating-linear-gradient(90deg, ${lineColor} 0 1.5px, transparent 1.5px 25px)`,
    `radial-gradient(circle, ${lineColor} 3px, transparent 3.2px)`,
    `repeating-linear-gradient(45deg, ${lineColor} 0 2px, transparent 2px ${DIAGONAL_STEP}px)`,
  ];
}
