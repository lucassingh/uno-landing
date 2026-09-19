import {
  Navbar,
  Hero,
  About,
  Problema,
  SistemaMasUno,
  Services,
  Metodo,
  Proyectos,
  Pricing,
  Testimonials,
  Faq,
  CtaFinal,
  Footer,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <About />
        <Problema />
        <SistemaMasUno />
        <Services />
        <Metodo />
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
