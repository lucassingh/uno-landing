import { FaqAccordion } from "@/components/ui";
import type { FaqItem } from "@/components/ui";

const FAQS: FaqItem[] = [
  {
    q: "¿Cuánto tarda una web?",
    a: "Depende del alcance. Una Landing Express puede salir en un par de semanas; una Landing Pro, algunas más. En la etapa de planear te damos un cronograma concreto, no una fecha al voleo.",
  },
  {
    q: "¿La puedo editar yo después?",
    a: "Sí. Te la dejamos autoadministrable y te enseñamos a usarla. La idea es que no dependas de nadie para cambios cotidianos como un precio o una foto.",
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
    q: "¿Qué incluye el acompañamiento?",
    a: "Ajustes, mejoras y soporte después del lanzamiento. Para nosotros ahí arranca la relación, no termina — ver el paso 06 del método.",
  },
  {
    q: "¿Hacen pauta (Meta, Google, TikTok Ads)?",
    a: "No. Nos encargamos de lo que pasa del clic en adelante: convertir, atender y ordenar. Si ya tenés quien te trae tráfico, se lo potenciamos.",
  },
  {
    q: "¿Necesito tener un CRM?",
    a: "No. Te damos un panel simple y a medida (el mini-CRM del Sistema +uno), sin licencias caras ni la complejidad de un sistema corporativo.",
  },
  {
    q: "¿Funciona con mi Tienda Nube / Instagram / TikTok?",
    a: "Sí. Integramos tus canales para que todo — leads y pedidos — caiga ordenado en un solo lugar.",
  },
  {
    q: "¿Y si ya tengo un bot?",
    a: "Seguramente sea de menú (\"marque 1\") y no filtre nada. El nuestro entiende lenguaje natural, separa curiosos de clientes reales y califica solo.",
  },
  {
    q: "¿Me sirve si ya tengo web?",
    a: "Sí. Podés sumar solo la pata de automatización y administración de leads, sin tocar tu web actual.",
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
