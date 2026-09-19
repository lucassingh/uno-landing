"use client";

import { CardNav, type CardNavItem } from "@/components/ui/CardNav";

// Mapeo inicial de las secciones del sitio a las 3 cards del nav.
// Editá labels, links y colores libremente — usa la paleta de tokens.
const NAV_ITEMS: CardNavItem[] = [
  {
    label: "Servicios",
    bgColor: "#031844", // --color-tinta
    textColor: "#FFFAE5", // --color-crema
    links: [
      { label: "Diseño web", href: "#servicios", ariaLabel: "Ir a Servicios" },
      { label: "Sistema +uno", href: "#sistema", ariaLabel: "Ir a Sistema +uno" },
    ],
  },
  {
    label: "Proyectos",
    bgColor: "#3A10E5", // --color-violeta
    textColor: "#FFFFFF",
    links: [
      { label: "Casos", href: "#proyectos", ariaLabel: "Ir a Proyectos" },
      { label: "Precios", href: "#precios", ariaLabel: "Ir a Precios" },
    ],
  },
  {
    label: "Contacto",
    bgColor: "#FFD300", // --color-amarillo
    textColor: "#031844", // --color-tinta
    links: [
      { label: "Hablemos", href: "#contacto", ariaLabel: "Ir a Contacto" },
      { label: "Volver arriba", href: "#top", ariaLabel: "Volver al inicio" },
    ],
  },
];

export function Navbar() {
  return (
    <CardNav
      logo="/logo/isotipo-color.svg"
      logoAlt="más uno"
      items={NAV_ITEMS}
      ease="power3.out"
      baseColor="#FFFFFF"
      menuColor="#031844"
      buttonBgColor="#031844"
      buttonTextColor="#FFFAE5"
      ctaLabel="Hablemos"
      ctaHref="#contacto"
    />
  );
}
