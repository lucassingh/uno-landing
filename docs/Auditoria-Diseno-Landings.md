# Auditoría de diseño — landing principal y /system

> Metodología y hallazgos del pase de pulido "background / animaciones de entrada / mobile" que
> pidió Lucas 2026-09-18, para aplicar por etapas a las dos landings y quedar documentado como
> referencia (se repite el mismo proceso cada vez que se agregan secciones nuevas).
>
> Tres categorías por landing, en este orden: **fondos** (propuesta, la decide Lucas) →
> **animaciones de entrada** (implementado) → **mobile** (auditado + arreglos concretos donde
> el fix es mecánico; lo que necesita diseño propio queda marcado como pendiente).

---

## Metodología

1. **Fondos**: listar el `bg` actual de cada sección y proponer cuáles convendría diferenciar
   (navy invertido, u otro tono) para que la página no se sienta plana — sin aplicar el cambio
   hasta que Lucas elija, porque es una decisión de composición/ritmo visual, no un bug.
2. **Animaciones de entrada**: componente reutilizable en `components/ui` (`ScrollReveal`) +
   aplicarlo a las secciones que todavía no tienen ninguna interacción de scroll propia. Las
   que YA tienen la suya (herramientas más específicas: `TextReveal`, `StickyScroll`, un stagger
   a medida en el Hero) se dejan como están — sumarles un reveal genérico encima sería
   redundante o podría pelearse con su propio mecanismo.
3. **Mobile**: revisar cada componente pesado/interactivo (3D, drag, scroll-jacking, WebGL) y
   confirmar que reduce su complejidad en pantallas chicas. Los arreglos mecánicos (un overflow,
   un breakpoint que falta) se aplican directo; los que necesitan una alternativa de diseño
   propia ("¿cómo se ve esto en mobile si no es la versión desktop?") quedan documentados como
   pendientes puntuales, no inventados a ciegas.

---

## Etapa 1 — Landing principal (`/`)

Orden real de secciones (`src/app/page.tsx`): Hero → About → Problema → SistemaMasUno →
Services → Metodo → Proyectos → Pricing → Testimonials → Faq → CtaFinal → Footer.

### 1a. Fondos — propuesta (sin aplicar)

| Sección | `bg` actual | Propuesta |
|---|---|---|
| Hero | crema (`default`) | mantener — primera pantalla, tiene que ser liviana |
| About | **navy** (`invert`) | mantener — ya rompe el patrón, funciona bien como primer respiro |
| Problema | crema | mantener |
| SistemaMasUno | crema | mantener — ya es visualmente densa (deck de cards), un bg oscuro compitiría |
| Services | crema | mantener |
| Metodo | **navy** (`invert`) | mantener — sección ancla del sitio, ya tiene su propio Grainient |
| Proyectos | crema | mantener |
| Pricing | crema | **candidata a diferenciar** — llega después de 6 secciones crema seguidas (Problema→Pricing), es la sección de mayor intención de compra: un fondo distinto (o al menos `alt`/blanco) la separaría del resto y le daría peso de "página de decisión" |
| Testimonials | crema | mantener |
| Faq | crema (+ DotGrid) | mantener — la textura de puntos ya la diferencia sin cambiar de color |
| CtaFinal | Grainient amarillo full-bleed | mantener — ya es la sección más distinta de toda la página, funciona como cierre |
| Footer | navy | mantener |

**Resumen**: el ritmo ya no es "todo crema" — alterna crema/navy/grainient con buen criterio.
La única sección que cambié es **Pricing**: 6 secciones crema seguidas antes de llegar ahí es
mucho tramo sin quiebre justo antes de la sección de conversión.

**✅ Aplicado** (2026-09-18): `Pricing` pasó de `bg="default"` a `bg="alt"` (blanco).

### 1b. Animaciones de entrada — implementado

Nuevo componente reutilizable: **`ScrollReveal`** (`src/components/ui/ScrollReveal.tsx`).
`motion.div` con `whileInView` (una sola vez, `viewport.amount=0.3`), respeta
`prefers-reduced-motion` (sin envoltorio si está activado), y una prop `direction`
(`up`/`down`/`left`/`right`) — para el patrón "dos cajas que se juntan al centro" se envuelve
cada mitad por separado con direcciones opuestas, no hay una prop "converge" mágica.

Aplicado en:
- **Problema**: header (`up`) + `SlideCarousel` (`up`, delay 0.1).
- **Services**: header (`up`) + `MagicBento` (`up`, delay 0.1).
- **Pricing**: header (`up`) + cada card del grid con stagger por columna (`delay={(i%3)*0.08}`).
- **Testimonials**: card de lista (`left`) + panel de la quote (`right`) — el patrón "converge"
  que pediste, literal.
- **CtaFinal**: columna de texto/expectativas (`left`) + card del form (`right`) — mismo patrón.
- **SistemaMasUno**: columna de texto (`left`) únicamente — el mazo de cards (`CardSwap`) ya
  tiene su propio ciclo de auto-swap corriendo desde el mount, sumarle una entrada propia podía
  pelearse con eso.
- **FaqAccordion** (componente compartido: afecta home Y `/system` de una — la card entera
  (`up`).

**No tocadas a propósito** (ya tienen su propia animación de scroll, más específica que un
reveal genérico):
- **Hero**: stagger a medida (`container`/`item` variants).
- **About**: `TextReveal` (pineado, palabra por palabra).
- **Metodo**: `StickyScroll` (carril pineado, cambia de card con el scroll).
- **Proyectos**: pineada + `CircularGallery` con drag — ver nota mobile abajo, tocar esto ahora
  sin resolver primero el punto de mobile sería doble trabajo.

### 1c. Mobile — auditado

**Arreglado (mecánico, bajo riesgo):**
- **SistemaMasUno / `CardSwap`**: el mazo se pasaba `width="clamp(480px, 50vw, 960px)"` —
  el piso de 480px es más ancho que CUALQUIER celular (incluso uno grande, 414-430px), así que
  desde siempre desbordaba horizontalmente en mobile. El coeficiente `50vw` en realidad nunca
  entraba en juego por debajo de los 960px de ancho de viewport (el piso ganaba siempre), así
  que bajar el piso a `clamp(260px, 50vw, 960px)` (alto: `clamp(210px, 40vw, 740px)`) no cambia
  nada en desktop y arregla el desborde en mobile.

**✅ Implementado** (2026-09-18):
- **Proyectos / `CircularGallery`**: en vez de mockup previo, se construyó directo una lista
  vertical simple (`.mobileList`/`.mobileCard` en `Proyectos.module.css`) con el mismo
  contenido (número, título, descripción, tech tags) pero sin drag/pin/WebGL — toggle 100% CSS
  vía `@media (max-width: 720px)`: la galería pineada+drag se oculta (`.desktopGallery{display:
  none}`), la lista se muestra (`.mobileList{display:flex}`). El SectionHeader (con el ícono
  "deslizá") queda compartido entre las dos versiones — se le sacó del copy la frase "deslizá
  para conocerlos" porque en mobile ya no aplica.

**Ya venía bien (verificado, no hace falta tocar):**
- **Hero / `Cubes`**: ya stackea bien en mobile (`@media max-width:900px` en `Hero.module.css`)
  y es CSS 3D liviano, no WebGL.
- **Metodo / `StickyScroll`**: ya reduce el alto del carril en mobile (`trackStep{min-height:
  42vh}` a ≤900px) — adaptación razonable ya en pie.

---

## Etapa 2 — Landing `/system`

Orden real de secciones (`src/app/system/page.tsx`): Hero → Mapa → Asistente → Multicanal →
Crm → Stock → Rubro → Equipo → VsErp → Caso → Precios → Faq.

### 2a. Fondos — propuesta (sin aplicar)

Las 12 secciones están en `bg="default"` (crema) — a propósito, fue un pedido explícito tuyo
durante el pase de alta fidelidad de cada una. Antes de tocar nada:

- **Rubro** y **VsErp** ya tienen su propio quiebre de color ADENTRO de la sección (el panel
  "el motor" navy con Grainient, y la franja de CTA navy al final) aunque la sección en sí siga
  siendo crema — ya rompen el patrón sin que haga falta cambiar el `bg`.
- **Faq** ya se diferencia con la textura de `DotGrid` (compartida con el home).
- El resto (Hero, Mapa, Asistente, Multicanal, Crm, Stock, Equipo, Caso) son crema lisa.

**Propuesta — la misma lógica que usé en la landing principal**: dejar todo como está excepto
**Precios**, por el mismo motivo que en el home (es la sección de mayor intención, y acá
además cierra justo antes de Faq). No propondría un quiebre navy de página completa en ningún
lado: entre el panel de Rubro, la franja de VsErp, el pineado gigante de Caso y la trama de
Faq, la página ya tiene bastante variedad de "textura" sin necesitar más color de fondo.

**✅ Aplicado** (2026-09-18): `Precios` pasó de `bg="default"` a `bg="alt"` (blanco).

### 2b. Animaciones de entrada — implementado

`ScrollReveal` (mismo componente de la Etapa 1) aplicado en:
- **Mapa**: header (`up`) + bento (`up`, delay).
- **Multicanal**: header (`up`) + bento (`up`, delay).
- **Crm**: header (`up`) + `BrowserShowcase` (`up`, delay).
- **Stock**: header (`up`) + `MagicBento` (`up`, delay).
- **Asistente**: header (`up`) + el showcase del celu (`up`, delay) — el showcase tiene su
  propio loop gateado por `useInView` puertas adentro, no se pisan.
- **Equipo**: header (`up`) + leyenda+tabla juntas (`up`, delay) + las dos menciones de apoyo
  (`up`, delay mayor).
- **Precios**: header (`up`) + las 2 cards de plan en converge (`left`/`right`) — mismo patrón
  que pediste para Testimonials/CtaFinal del home.
- **VsErp**: header (`up`) + la card de la planilla de specs (`up`, delay) + la franja de CTA
  (`up`, delay mayor) — las barras adentro siguen con su propio `useInView` para el loop
  infinito, es un mecanismo aparte que no se toca.
- **Rubro**: header (`up`) + el panel completo motor+config (`up`, delay) — como los dos lados
  viven ADENTRO de una sola card con un solo borde/sombra, un converge partido se vería raro
  (el borde apareciendo antes que el contenido de un lado); va como una sola unidad.
- **Faq**: ya cubierta por el `FaqAccordion` compartido (Etapa 1).

**No tocadas** (ya tienen su propia animación de scroll):
- **Hero**: stagger a medida + `BrowserShowcase`.
- **Caso**: el pineado gigante con línea que se dibuja — es la pieza de scrollytelling más
  elaborada de todo el sitio, tocarla con un reveal genérico encima no suma nada.

### 2c. Mobile — auditado

**Arreglado (mecánico, bajo riesgo):**
- **Mapa / `SystemMapaBento`, card "capas del sistema"**: el texto explicativo de cada capa
  (`.layerHint`) solo aparecía en `:hover` — en touch no hay hover que lo dispare NUNCA, así
  que ese contenido (no es decoración, explica qué hace cada capa) quedaba invisible en
  cualquier celular. Envuelto en `@media (hover: hover)` / `@media (hover: none)`: en mouse
  sigue apareciendo con la animación de siempre, en touch queda visible de entrada, sin
  animación. Revisé los otros hovers de la misma card (tabs de filtro, fila del lead caliente)
  y esos SÍ son decorativos — el estado sin hover ya muestra todo, no hace falta tocarlos.

**✅ Implementado** (2026-09-18):
- **`BrowserShowcase`** (usado por Hero y Crm): mantenía `aspect-ratio: 1900/908` (proporción
  de ventana de escritorio) a cualquier ancho — en un celular angosto la altura real quedaba
  muy chica (a 340px de ancho, ~163px de alto) y el screenshot de dashboard se veía
  amontonado/ilegible. En vez de un mockup distinto, se cambió el aspect-ratio a `4/3` a los
  ≤640px: como `.browserShot` ya usa `object-fit:cover` + `object-position:top center`, un
  contenedor más alto no agranda la imagen, la RECORTA distinto — mismo screenshot, un crop
  más angosto y alto que muestra más detalle legible de la parte de arriba del dashboard en vez
  de la ventana completa achicada.

**Ya venía bien (verificado, no hace falta tocar):**
- **Caso**: el pin de 300vh + los puntos numerados ya tienen su propio ajuste mobile (puntos a
  3rem y línea reposicionada a los ≤560px, la card de caption pasa a columna a los ≤720px) —
  construido así desde el pase de alta fidelidad de esta sección, no es un hallazgo nuevo.
- **Rubro**: el panel motor+config ya pasa a una columna a los ≤720px.
- Los planes de **Precios**, la tabla de **Equipo** y las cards de **Stock**/**Multicanal** ya
  tenían sus propios breakpoints puestos durante el pase de alta fidelidad de cada uno.
