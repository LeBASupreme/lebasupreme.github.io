import { useRef } from "react";
import { MARQUEE } from "../content";
import { gsap, useGSAP, MOTION_OK } from "../motion";
import { onVelocity } from "../scroll-bus";

const line = `${MARQUEE.join("  •  ")}  •  `;

export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trackEl = track.current;
      if (!trackEl) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tween = gsap.to(trackEl, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
        const stop = onVelocity((velocity) => {
          const scale = 1 + Math.min(Math.abs(velocity) / 80, 3);
          gsap.to(tween, { timeScale: scale, duration: 0.25, overwrite: "auto" });
        });
        return () => stop();
      });
    },
    { scope: root },
  );

  return (
    <div className="marquee" ref={root}>
      <div className="marquee-track" ref={track}>
        <span>{line}</span>
        <span aria-hidden="true">{line}</span>
      </div>
    </div>
  );
}
