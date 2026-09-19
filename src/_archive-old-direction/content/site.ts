import type { SiteContent } from "@/types/content";

/* =============================================================
   CONTENIDO DE LA LANDING — fuente única (DRY).
   Calidad media a propósito: sirve para validar estructura + copy.
   La voz sigue el Tono de +1: seco, cómplice, anti-plantilla.
   ============================================================= */

export const site: SiteContent = {
  brand: {
    name: "+1",
    wordmark: "más uno",
    tagline: "agencia web creativa",
  },

  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Método", href: "#metodo" },
    { label: "Trabajos", href: "#trabajos" },
    { label: "Planes", href: "#planes" },
    { label: "FAQ", href: "#faq" },
  ],
  navCta: { label: "Hablemos!", href: "#contacto" },

  hero: {
    eyebrow: "// agencia web creativa · a medida",
    titleLines: ["tu web no tiene que", "ser linda.", "tiene que"],
    highlight: "laburar.",
    intro:
      "Hacemos presencia digital a medida para personas, pymes y marcas. Sin plantillas, sin humo, sin IA sin criterio. Y no te entregamos y chau: te acompañamos.",
    primaryCta: { label: "Auditá tu web gratis", href: "#contacto" },
    secondaryCta: { label: "Ver cómo trabajamos", href: "#metodo" },
    stats: [
      { value: "100%", label: "a medida, cero plantillas" },
      { value: "+1", label: "seguimiento post-lanzamiento" },
      { value: "Next.js", label: "rápida y autoadministrable" },
    ],
  },

  marquee: ["sin plantillas", "sin humo", "webs que laburan", "hecho a medida", "con criterio"],

  aboutScroll: {
    id: "nosotros",
    beats: [
      {
        index: "01",
        title: "ESCUCHAR",
        description:
          "la mayoría arranca por figma. nosotros arrancamos por vos: qué hacés, a quién le vendés, por qué te elegirían a vos y no al de al lado.",
        accent: "cyan",
      },
      {
        index: "02",
        title: "PRODUCIR",
        description:
          "sin plantilla. sin ia que adivina por vos. con criterio, a medida, para lo que realmente necesitás vender.",
        accent: "naranja",
      },
    ],
  },

  problem: {
    eyebrow: "// el problema",
    titleLines: ["hay un mundo mejor.", "y es sin plantillas."],
    points: [
      {
        title: "La plantilla que usan otros 4.000",
        text: "Elegís un template premium y listo: la misma cara que tu competencia. Nada te diferencia.",
        accent: "rosa",
      },
      {
        title: "La IA sin criterio",
        text: "Te arma una web en 3 segundos. Genérica, sin foco, sin entender qué vendés ni a quién.",
        accent: "cyan",
      },
      {
        title: "Linda pero muda",
        text: "Se ve bien, pero en los primeros 5 segundos nadie entiende qué hacés. Y sin claridad, no hay venta.",
        accent: "amarillo",
      },
      {
        title: "Te entregan y desaparecen",
        text: "Recibís los archivos y quedás solo. Cualquier cambio es un dolor de cabeza.",
        accent: "verde",
      },
    ],
  },

  valueProps: {
    meta: {
      id: "propuesta",
      eyebrow: "// por qué +1",
      title: "sumamos lo que antes no estaba",
      intro: "No vendemos páginas. Vendemos criterio y resultado.",
    },
    items: [
      { id: "medida", title: "A medida, de verdad", text: "Diseñamos y desarrollamos desde cero según lo que hacés, tu rubro y tu público. Nada de talles únicos.", accent: "verde" },
      { id: "criterio", title: "Con criterio humano", text: "Te asesoramos en cómo mostrar y vender lo tuyo. La tecnología es la herramienta, no el objetivo.", accent: "rosa" },
      { id: "seguimiento", title: "Con seguimiento", text: "El lanzamiento no es el final: es donde empezamos a acompañarte. Ajustes, mejoras y soporte.", accent: "cyan" },
      { id: "rapida", title: "Rápida y propia", text: "Stack moderno (Next.js), performance y SEO cuidados, y un panel para que la administres vos.", accent: "amarillo" },
    ],
  },

  services: {
    meta: {
      id: "servicios",
      eyebrow: "// servicios",
      title: "dos líneas, un mismo criterio",
      intro: "Desde una landing que convierte hasta software a medida.",
    },
    items: [
      {
        id: "presencia",
        code: "L1",
        name: "Presencia digital",
        tagline: "landings y webs que venden",
        description: "Tu cara pública, pensada para comunicar claro y convertir. Autoadministrable y lista para escalar.",
        features: ["Landing / web a medida", "Copy y estructura estratégica", "Autoadministrable (CMS)", "SEO técnico y performance", "Responsive y accesible"],
      },
      {
        id: "software",
        code: "L2",
        name: "Software a medida",
        tagline: "web apps y productos digitales",
        description: "Cuando necesitás más que una web: aplicaciones, paneles y productos digitales hechos para tu operación.",
        features: ["Web apps a medida", "Integraciones y APIs", "Paneles y dashboards", "Mobile / PWA", "A cotizar según alcance"],
      },
    ],
  },

  method: {
    meta: {
      id: "metodo",
      eyebrow: "// el método +1",
      title: "cómo trabajamos, paso a paso",
      intro: "Un proceso claro, sin sorpresas. Vos siempre sabés en qué etapa estamos.",
    },
    steps: [
      { n: "01", title: "Escuchar", text: "Entendemos qué hacés, a quién le vendés y tu rubro. Nuestra fortaleza." },
      { n: "02", title: "Planear", text: "Propuesta, plan y mockups. Todo definido antes de arrancar." },
      { n: "03", title: "Diseñar", text: "Diseñamos e iteramos con vos hasta que cierre. Con criterio, no a lo loco." },
      { n: "04", title: "Desarrollar", text: "La construimos a medida con Next.js. Rápida, propia y autoadministrable." },
      { n: "05", title: "Lanzar", text: "Sale a la cancha, lista para vender. Con todo testeado." },
      { n: "06", title: "Acompañar", text: "Seguimiento y mantenimiento. No te entregamos y chau." },
    ],
  },

  differentiators: {
    meta: {
      id: "diferencia",
      eyebrow: "// la diferencia",
      title: "lo que no vas a encontrar en una plantilla",
    },
    items: [
      { title: "Estrategia antes que estética", text: "Primero definimos qué tenés que decir y a quién. Lo lindo viene después, al servicio de eso." },
      { title: "Cero genérico", text: "Ni templates ni IA sin curar. Cada pieza está pensada para vos." },
      { title: "Vos al mando", text: "Te la dejamos autoadministrable y te enseñamos a usarla. Sin depender de nadie." },
      { title: "Relación, no transacción", text: "Nos quedamos después del lanzamiento. Tu crecimiento es el nuestro." },
    ],
  },

  work: {
    meta: {
      id: "trabajos",
      eyebrow: "// trabajos",
      title: "algunas cosas que hicimos",
      intro: "Placeholders por ahora — se reemplazan por casos reales tratados en el estilo de la marca.",
    },
    items: [
      { id: "w1", title: "Proyecto uno", category: "Landing · Pyme", ratio: "portrait" },
      { id: "w2", title: "Proyecto dos", category: "Web · Profesional", ratio: "landscape" },
      { id: "w3", title: "Proyecto tres", category: "Landing · Músico", ratio: "square" },
      { id: "w4", title: "Proyecto cuatro", category: "Web app · Producto", ratio: "landscape" },
      { id: "w5", title: "Proyecto cinco", category: "Landing · Fotógrafo", ratio: "portrait" },
      { id: "w6", title: "Proyecto seis", category: "Web · Marca", ratio: "square" },
    ],
  },

  testimonials: {
    meta: {
      id: "testimonios",
      eyebrow: "// lo que dicen",
      title: "no lo decimos solo nosotros",
    },
    items: [
      { quote: "Por primera vez mi web explica lo que hago en 5 segundos. Y se nota en las consultas.", author: "Cliente uno", role: "Pyme de servicios" },
      { quote: "No fue comprar una plantilla: fue tener a alguien pensando mi negocio conmigo.", author: "Cliente dos", role: "Profesional independiente" },
      { quote: "El seguimiento post-lanzamiento hace toda la diferencia. No quedás solo.", author: "Cliente tres", role: "Marca local" },
    ],
  },

  pricing: {
    meta: {
      id: "planes",
      eyebrow: "// planes",
      title: "precios claros, sin letra chica",
      intro: "Puntos de partida. El alcance real lo definimos juntos en la etapa de escuchar.",
    },
    plans: [
      {
        id: "express",
        name: "Landing Express",
        nickname: "el empujón",
        price: "desde USD 200",
        note: "1 página · entrega ágil",
        description: "Una página, un objetivo, cero excusas. Ideal para arrancar con presencia.",
        features: ["1 página a medida", "Copy y estructura", "Responsive + SEO base", "Formulario de contacto"],
        highlighted: false,
        cta: { label: "Empezar", href: "#contacto" },
      },
      {
        id: "pro",
        name: "Landing Pro",
        nickname: "la que convierte",
        price: "desde USD 300",
        note: "hasta 3-5 páginas · autoadministrable",
        description: "Pensada para vender: varias secciones, autoadministrable y lista para escalar.",
        features: ["Hasta 3-5 páginas", "Autoadministrable (CMS)", "SEO técnico + performance", "Analítica y seguimiento", "Iteraciones incluidas"],
        highlighted: true,
        cta: { label: "La quiero", href: "#contacto" },
      },
      {
        id: "pack",
        name: "Pack Marca + Web",
        nickname: "de cero a marca",
        price: "a cotizar",
        note: "identidad + web, todo junto",
        description: "Si todavía no tenés marca, la creamos y la llevamos a la web. Todo coherente.",
        features: ["Identidad / logo", "Sistema visual", "Web a medida", "Guía de marca"],
        highlighted: false,
        cta: { label: "Cotizar", href: "#contacto" },
      },
    ],
  },

  faq: {
    meta: {
      id: "faq",
      eyebrow: "// preguntas",
      title: "lo que casi siempre nos preguntan",
    },
    items: [
      { q: "¿Cuánto tarda una web?", a: "Depende del alcance. Una Landing Express puede salir en un par de semanas; una web más grande, algunas más. En la etapa de planear te damos un cronograma concreto." },
      { q: "¿La puedo editar yo después?", a: "Sí. Te la dejamos autoadministrable y te enseñamos a usarla. La idea es que no dependas de nadie para cambios cotidianos." },
      { q: "¿Trabajan con clientes de otros países?", a: "Sí. Arrancamos con clientes locales y trabajamos también con clientes que pagan en USD. Todo remoto y coordinado." },
      { q: "¿Y si no tengo logo ni marca?", a: "Lo resolvemos con el Pack Marca + Web: creamos la identidad y la llevamos a la web, todo coherente." },
      { q: "¿Usan plantillas o IA?", a: "No como atajo. Usamos herramientas modernas, pero cada web se piensa y se hace a medida. Sin genérico." },
      { q: "¿Qué incluye el seguimiento?", a: "Ajustes post-lanzamiento, soporte y mejoras. El lanzamiento es el comienzo de la relación, no el final." },
    ],
  },

  cta: {
    title: "¿arrancamos?",
    intro: "Te auditamos la web actual gratis y te decimos, sin vueltas, qué mejorarías. Sin compromiso.",
    primary: { label: "Auditá tu web gratis", href: "mailto:hola@masuno.com" },
    secondary: { label: "Escribinos", href: "#contacto" },
  },

  footer: {
    tagline: "webs a medida que laburan. sin plantillas, sin humo.",
    columns: [
      {
        title: "Agencia",
        links: [
          { label: "Servicios", href: "#servicios" },
          { label: "Método", href: "#metodo" },
          { label: "Trabajos", href: "#trabajos" },
          { label: "Planes", href: "#planes" },
        ],
      },
      {
        title: "Contacto",
        links: [
          { label: "Instagram", href: "#" },
          { label: "Email", href: "mailto:hola@masuno.com" },
          { label: "WhatsApp", href: "#" },
        ],
      },
    ],
    legal: "© 2026 más uno · agencia web creativa. Hecho a medida, obvio.",
    email: "hola@masuno.com",
  },
};
