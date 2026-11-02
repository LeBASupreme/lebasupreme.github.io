import type Lenis from "lenis";

let current: Lenis | null = null;
const listeners = new Set<(velocity: number) => void>();

export function attachLenis(lenis: Lenis) {
  current = lenis;
  lenis.on("scroll", (instance) => {
    listeners.forEach((listener) => listener(instance.velocity));
  });
}

export function detachLenis() {
  current = null;
}

export function getLenis() {
  return current;
}

export function onVelocity(listener: (velocity: number) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
