import { useRef } from "react";
import { gsap, useGSAP } from "../motion";

export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  useGSAP(
    (_context, contextSafe) => {
      const element = ref.current;
      if (!element || !contextSafe) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const xTo = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3.out" });

        const move = contextSafe((event: PointerEvent) => {
          const box = element.getBoundingClientRect();
          const dx = event.clientX - (box.left + box.width / 2);
          const dy = event.clientY - (box.top + box.height / 2);
          const reach = Math.max(box.width, box.height) * 1.4;
          if (Math.hypot(dx, dy) > reach) {
            xTo(0);
            yTo(0);
            return;
          }
          xTo(dx * strength);
          yTo(dy * strength);
        });

        const reset = () => {
          xTo(0);
          yTo(0);
        };

        window.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", reset);
        return () => {
          window.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
        };
      });
    },
    { scope: ref },
  );

  return ref;
}
