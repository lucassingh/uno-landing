import { FaqAccordion } from "@/components/ui";
import type { FaqItem } from "@/components/ui";

const FAQS: FaqItem[] = [
  {
    q: "¿Necesito instalar algo?",
    a: "No. Es un panel web al que entrás desde cualquier navegador, en la compu o el celular.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Sí. Cada negocio tiene su espacio separado (multi-tenant) y el login corre sobre infraestructura de autenticación de nivel empresarial.",
  },
  {
    q: "¿Qué pasa si cambio de rubro o sumo productos nuevos?",
    a: "Los atributos y categorías los configurás vos, cuando quieras — no hace falta un desarrollo nuevo cada vez que cambia tu catálogo.",
  },
  {
    q: "¿Puedo exportar mis datos?",
    a: "Tus leads y tu catálogo son tuyos, siempre. La exportación en un clic está en el roadmap del panel de autogestión.",
  },
  {
    q: "¿Y si ya tengo un CRM o un bot que no me sirve?",
    a: "Migramos lo que haga falta y reemplazamos lo que no funciona — sin perder lo que ya tenías andando, como tu Tienda Nube.",
  },
  {
    q: "¿Cuánto tarda en estar funcionando?",
    a: "El core ya existe: lo que se configura es tu capa — prompt, catálogo, canales y reglas. Bastante más rápido que un desarrollo desde cero.",
  },
];

export function SystemFaq() {
  return (
    <FaqAccordion
      eyebrow="preguntas de quien ya lo va a usar"
      title="las dudas técnicas, resueltas"
      intro="Lo que casi todos preguntan antes de meterse de lleno."
      items={FAQS}
    />
  );
}
