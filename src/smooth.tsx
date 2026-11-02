import { useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "./motion";
import { attachLenis, detachLenis } from "./scroll-bus";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const lenis = new Lenis({ autoRaf: false });
      attachLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        detachLenis();
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
