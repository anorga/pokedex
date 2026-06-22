import { useEffect, useState } from "react";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates a number from 0 up to `target`, respecting reduced-motion. */
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dur = reduce ? 0 : duration;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
      setValue(Math.round(target * easeOut(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
