import { FaqAccordion } from "@/components/ui";
import type { FaqItem } from "@/components/ui";

const FAQS: FaqItem[] = [
  {
    q: "¿Cuánto tarda una web?",
    a: "Depende del alcance. Una landing a medida sale en 1 a 2 semanas; un sitio pro, en 3 a 5. En la etapa de planear te damos un cronograma concreto, no una fecha al voleo.",
  },
  {
    q: "¿La puedo editar yo después?",
    a: "Sí. Te la dejamos autoadministrable y te enseñamos a usarla. La idea es que no dependas de nadie para cambios cotidianos como un precio o una foto.",
  },
  {
    q: "¿Hacen apps o sistemas a medida?",
    a: "Sí. Paneles de gestión, turnos, portales de clientes, integraciones con Mercado Pago o con lo que ya usás. Se cotiza según el alcance y, si el proyecto es grande, lo dividimos en etapas con un entregable cada una.",
  },
  {
    q: "¿Qué incluye el acompañamiento?",
    a: "Todo lo que necesita tu web para seguir andando: hosting, servidor, base de datos, backups, monitoreo, corrección de errores, actualizaciones de seguridad, soporte por WhatsApp y email, y horas mensuales para mejoras. USD 250 por mes, sin costos de infraestructura aparte.",
  },
  {
    q: "¿De quién es el dominio? ¿Y si me quiero ir?",
    a: "El dominio es tuyo desde el día uno, a tu nombre. La infraestructura la manejamos nosotros para que no tengas que crear ni pagar cuentas técnicas. Y el día que quieras irte, te llevás todo: código, datos y usuarios, sin costo.",
  },
  {
    q: "¿Y si no tengo logo ni marca?",
    a: "Lo resolvemos con el Pack Marca + Web: coordinamos con una diseñadora, armamos la identidad, y la llevamos a la web. Todo coherente desde el día uno.",
  },
  {
    q: "¿Usan plantillas o IA?",
    a: "No como atajo. Usamos herramientas modernas, pero cada web se piensa y se construye a medida de tu negocio. Nada de clickear opciones en un template.",
  },
  {
    q: "¿Hacen pauta (Meta, Google, TikTok Ads)?",
    a: "No. Nos encargamos de lo que pasa del clic en adelante: una web que convierte y el software que tu negocio necesita para funcionar. Si ya tenés quien te trae tráfico, se lo potenciamos.",
  },
];

export function Faq() {
  return (
    <FaqAccordion
      title="ya te lo respondemos"
      intro="Lo que casi todos preguntan antes de escribirnos."
      items={FAQS}
    />
  );
}
