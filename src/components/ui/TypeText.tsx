"use client";

import { useEffect, useState, type ElementType, type HTMLAttributes } from "react";
import { useReducedMotion } from "motion/react";

export interface TypeTextProps extends HTMLAttributes<HTMLElement> {
  text: string;
  as?: ElementType;
  typingSpeed?: number;
}

/** Tipeo carácter a carácter, sin cursor ni loop — recorte del TextType de reactbits (que trae
 * gsap para el cursor parpadeante y ciclado entre varios strings) a lo único que usamos acá:
 * tipear un texto una vez y quedarse quieto. Para reiniciar el tipeo con un texto nuevo, remontá
 * el componente con una `key` distinta desde el padre (ver Testimonials, key={activeIndex}) en
 * vez de sumar un prop de reset acá. */
export function TypeText({ text, as: Component = "p", typingSpeed = 22, className, ...rest }: TypeTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, typingSpeed);
    return () => clearInterval(id);
  }, [text, typingSpeed, shouldReduceMotion]);

  return (
    <Component className={className} {...rest}>
      {text.slice(0, count)}
      {/* reserva desde el arranque el alto final del texto: sin esto el panel "crece" línea a
          línea mientras tipea y empuja lo que esté debajo. */}
      <span aria-hidden="true" style={{ opacity: 0 }}>
        {text.slice(count)}
      </span>
    </Component>
  );
}

export default TypeText;
