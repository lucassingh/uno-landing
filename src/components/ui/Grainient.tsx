"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export interface GrainientProps {
  color1?: string;
  color2?: string;
  color3?: string;
  timeSpeed?: number;
  warpFrequency?: number;
  warpAmplitude?: number;
  warpStrength?: number;
  blendSoftness?: number;
  centerX?: number;
  centerY?: number;
  grainScale?: number;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

/* Grainient (reconstrucción): dos/tres colores mezclados con ruido deformado (domain warping) para
   el flujo orgánico tipo "aceite en agua", + grano de film. Corre sobre OGL (WebGL). */
const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uCenter;
uniform float uTimeSpeed;
uniform float uWarpFrequency;
uniform float uWarpAmplitude;
uniform float uWarpStrength;
uniform float uBlendSoftness;
uniform float uGrainScale;
varying vec2 vUv;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++){ v += a * noise(p); p = p * 2.0 + 11.3; a *= 0.5; }
  return v;
}

void main(){
  float t = uTime * uTimeSpeed * 0.1;
  vec2 asp = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (vUv - uCenter) * asp;

  float freq = uWarpFrequency;
  vec2 w1 = vec2(fbm(p * freq + vec2(0.0, t)), fbm(p * freq + vec2(3.1, -t)));
  vec2 w2 = vec2(
    fbm(p * freq + w1 * uWarpStrength + vec2(1.7, 9.2) + t * 0.5),
    fbm(p * freq + w1 * uWarpStrength + vec2(8.3, 2.8) - t * 0.5)
  );
  vec2 pos = p + (w2 - 0.5) * (uWarpAmplitude * 0.01);

  float d = length(pos);
  float m = smoothstep(0.12 - uBlendSoftness, 0.9 + uBlendSoftness, d);
  vec3 col = mix(uColor1, uColor2, m);
  col = mix(col, uColor3, smoothstep(0.7, 1.15, d));

  float g = hash(vUv * uResolution.xy + fract(uTime) * 57.0);
  col += (g - 0.5) * uGrainScale * 0.08;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function Grainient({
  color1 = "#3A10E5",
  color2 = "#031844",
  color3 = "#031844",
  timeSpeed = 0.5,
  warpFrequency = 3,
  warpAmplitude = 32,
  warpStrength = 2.15,
  blendSoftness = 0.13,
  centerX = 0.23,
  centerY = -0.01,
  grainScale = 1.7,
  className,
}: GrainientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch {
      // WebGL no disponible (contexto agotado tras muchos remounts de HMR, GPU/driver,
      // navegador sin soporte, etc.) — se deja el fondo sólido de la sección de atrás en vez
      // de tirar abajo la página entera con un runtime error.
      return;
    }
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    el.appendChild(canvas);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uColor1: { value: hexToRgb(color1) },
        uColor2: { value: hexToRgb(color2) },
        uColor3: { value: hexToRgb(color3) },
        uCenter: { value: [centerX, centerY] },
        uTimeSpeed: { value: timeSpeed },
        uWarpFrequency: { value: warpFrequency },
        uWarpAmplitude: { value: warpAmplitude },
        uWarpStrength: { value: warpStrength },
        uBlendSoftness: { value: blendSoftness },
        uGrainScale: { value: grainScale },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(el.clientWidth || 1, el.clientHeight || 1);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Gate de visibilidad correcto (el anterior se había sacado por un bug real — ver abajo):
    // `running` se lee al INICIO de cada frame y, si es false, el loop simplemente no vuelve a
    // pedir el próximo — no queda una cadena de rAF fantasma pidiendo frames para siempre. El
    // bug viejo (comentario original, para no repetirlo): la cadena de rAF seguía viva pase lo
    // que pase y solo el *render* se salteaba según una bandera "visible" separada; si esa
    // bandera quedaba trabada en false por el timing async del observer, el fondo se congelaba
    // en el primer frame para siempre aunque la animación "siguiera corriendo" por dentro. Acá
    // en cambio `play()` es la única función que arranca la cadena, así que no hay estado
    // intermedio en el que pueda quedar atascada.
    const start = performance.now();
    let raf = 0;
    let running = false;
    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render({ scene: mesh });
    };
    const play = () => {
      if (running || reduce) return;
      running = true;
      loop();
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    renderer.render({ scene: mesh }); // primer frame estático ya visible mientras el observer resuelve

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? play() : pause()), { threshold: 0 });
      io.observe(el);
    } else {
      play();
    }

    return () => {
      io?.disconnect();
      pause();
      ro.disconnect();
      if (canvas.parentNode === el) el.removeChild(canvas);
      const ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    };
  }, [color1, color2, color3, timeSpeed, warpFrequency, warpAmplitude, warpStrength, blendSoftness, centerX, centerY, grainScale]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

export default Grainient;
