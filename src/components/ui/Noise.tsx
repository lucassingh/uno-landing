"use client";

import { useEffect, useRef } from "react";
import styles from "./Noise.module.css";
import { cn } from "@/lib/utils";

export interface NoiseProps {
  patternRefreshInterval?: number;
  patternAlpha?: number;
  className?: string;
}

/** Grano/ruido animado como textura de fondo (react-bits, adaptado sin Tailwind). */
export function Noise({ patternRefreshInterval = 2, patternAlpha = 15, className = "" }: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const canvasSize = 512;

    const resize = () => {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    resize();
    loop();

    return () => window.cancelAnimationFrame(animationId);
  }, [patternRefreshInterval, patternAlpha]);

  return <canvas ref={canvasRef} className={cn(styles.overlay, className)} style={{ imageRendering: "pixelated" }} />;
}

export default Noise;
