/* =============================================================
   Interfaces del contenido. El markup nunca hardcodea copy:
   todo sale de content/site.ts tipado con esto.
   ============================================================= */

export type ColorToken =
  | "tinta" | "blanco" | "gris" | "rosa" | "cyan" | "amarillo" | "verde" | "naranja";

export interface Cta {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLines: string[];
  /** palabra a resaltar dentro del titular (marker) */
  highlight: string;
  intro: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  stats: Stat[];
}

export interface ProblemPoint {
  title: string;
  text: string;
  accent: ColorToken;
}

export interface ProblemContent {
  eyebrow: string;
  titleLines: string[];
  points: ProblemPoint[];
}

export interface ValueProp {
  id: string;
  title: string;
  text: string;
  accent: ColorToken;
}

export interface MethodStep {
  n: string;
  title: string;
  text: string;
}

export interface Service {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface Differentiator {
  title: string;
  text: string;
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  ratio: "square" | "portrait" | "landscape";
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  nickname: string;
  price: string;
  note: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: Cta;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface AboutBeat {
  index: string;
  title: string;
  description: string;
  accent: ColorToken;
}

export interface AboutScrollContent {
  id: string;
  beats: AboutBeat[];
}

export interface SectionMeta {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface FooterContent {
  tagline: string;
  columns: Array<{ title: string; links: NavItem[] }>;
  legal: string;
  email: string;
}

export interface SiteContent {
  brand: { name: string; wordmark: string; tagline: string };
  nav: NavItem[];
  navCta: Cta;
  hero: HeroContent;
  marquee: string[];
  aboutScroll: AboutScrollContent;
  problem: ProblemContent;
  valueProps: { meta: SectionMeta; items: ValueProp[] };
  services: { meta: SectionMeta; items: Service[] };
  method: { meta: SectionMeta; steps: MethodStep[] };
  differentiators: { meta: SectionMeta; items: Differentiator[] };
  work: { meta: SectionMeta; items: WorkItem[] };
  testimonials: { meta: SectionMeta; items: Testimonial[] };
  pricing: { meta: SectionMeta; plans: PricingPlan[] };
  faq: { meta: SectionMeta; items: FaqItem[] };
  cta: { title: string; intro: string; primary: Cta; secondary: Cta };
  footer: FooterContent;
}
