# más uno — Landing

Landing de **+1 / más uno — diseño web + automatización, a medida**. Next.js (App Router) + TypeScript.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts
- `npm run dev` — desarrollo
- `npm run build` / `npm run start` — producción
- `npm run lint` — ESLint (next/core-web-vitals)
- `npm run typecheck` — TypeScript sin emitir

## Arquitectura

```
src/
  app/            App Router (layout, page, globals)
  styles/         tokens.css (design tokens del branding)
  lib/            fonts.ts (next/font), theme.ts, utils.ts
  types/          content.ts (interfaces del contenido)
  content/        site.ts (TODO el copy/datos, tipado y data-driven)
  components/
    ui/           primitivos reutilizables (Container, Grid, Section, Button, Tag, Card...)
    sections/     secciones de la landing (Hero, Method, Pricing, FAQ...)
```

### Principios
- **DRY / data-driven:** todo el contenido vive en `content/site.ts` tipado con `types/content.ts`.
  Las secciones iteran con `.map()` sobre esos datos — no hay copy hardcodeado en el markup.
- **Design tokens:** colores, tipografías, espaciado, sombras y radios en `styles/tokens.css`
  (variables CSS) + espejo tipado en `lib/theme.ts`. Cambiás el token, cambia todo.
- **Componentes:** primitivos en `components/ui` (con CSS Modules), secciones que sólo componen.
- **Fuentes:** Syne (display) · JetBrains Mono (mono/utilitario) · Inter (cuerpo), vía `next/font`.

## Estado
Calidad **media** a propósito: la estructura y el copy están para validar.
La "magia" brutalista/acid se agrega **sección por sección** en alta calidad.

## Próximo
- Reemplazar placeholders (`public/placeholders`) por imágenes reales (tratadas en halftone/duotono).
- Sumar `reactbits` para componentes espectaculares cuando elevemos cada sección.
