import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 1200px)";

/** Whole block fades in once. Nothing translates. */
export function appear(trigger: Element, selector: string) {
  const nodes = trigger.querySelectorAll(selector);
  if (!nodes.length) return;
  gsap.from(nodes, {
    opacity: 0,
    duration: 0.45,
    ease: "power2.out",
    scrollTrigger: { trigger, start: "top 85%", once: true },
  });
}
