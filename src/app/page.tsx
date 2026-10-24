import {
  Navbar,
  Hero,
  About,
  Services,
  Apps,
  Metodo,
  Casos,
  Proyectos,
  Pricing,
  Testimonials,
  Faq,
  CtaFinal,
  Footer,
} from "@/components/sections";

// Problema y SistemaMasUno (pata del bot calificador + mini-CRM) quedan FUERA del home desde
// 2026-10-24: el Sistema +uno se pospuso. Los componentes siguen en components/sections y
// la página /system en app/_system — para volver, re-importarlos acá en su lugar original
// (después de About) y sacar el redirect de next.config.mjs.
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <About />
        <Services />
        <Apps />
        <Metodo />
        <Casos />
        <Proyectos />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
