"use client";

import { useEffect, useState } from "react";

/** Breakpoint "mobile" compartido para los componentes que cambian de ESTRUCTURA (no solo de
 * estilo) en pantallas angostas — ej. el showcase del asistente pasa a acordeón. Lo que es solo
 * estilo se resuelve con @media en CSS, no con esto. */
export const MOBILE_QUERY = "(max-width: 860px)";

/** true si el media query matchea. En SSR y en el primer render del cliente devuelve false
 * (desktop) para no romper la hidratación — se corrige en el primer effect. Usalo solo para
 * bloques que no estén en el primer viewport, así ese salto no se ve. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
