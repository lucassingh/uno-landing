import { ImageResponse } from "next/og";

// Imagen de preview al compartir el link (WhatsApp, LinkedIn, X). Edge: el runtime de Node
// de next/og rompe en Windows ("Invalid URL"), y en edge la imagen queda cacheada en el CDN.
export const runtime = "edge";
export const alt = "más uno — diseño web + automatización, a medida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TINTA = "#031844";
const CREMA = "#FFFAE5";
const AMARILLO = "#FFD300";

const HEADLINE = "Diseño web + automatización,";
const ACCENT = "a medida.";

// Satori no lee woff2 (las fuentes locales del sitio), así que Montserrat se baja como TTF
// de Google Fonts en el build. Si falla, la imagen sale igual con la fuente por defecto.
async function loadMontserrat(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Montserrat:wght@800&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    return await (await fetch(fontUrl)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const logoSvg = await (
    await fetch(new URL("../../public/logo/lockup-horizontal-white.svg", import.meta.url))
  ).text();
  const logoSrc = `data:image/svg+xml;base64,${btoa(logoSvg)}`;
  const montserrat = await loadMontserrat(`${HEADLINE}${ACCENT}masuno.io`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: TINTA,
          fontFamily: montserrat ? "Montserrat" : undefined,
        }}
      >
        {/* lockup 1191×332; <img> es lo que entiende ImageResponse, no next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={430} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, color: CREMA }}>{HEADLINE}</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, color: AMARILLO }}>{ACCENT}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 48, height: 6, background: AMARILLO, marginRight: 20 }} />
          <div style={{ fontSize: 30, fontWeight: 800, color: CREMA }}>masuno.io</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: montserrat ? [{ name: "Montserrat", data: montserrat, weight: 800, style: "normal" }] : [],
    },
  );
}
