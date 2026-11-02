import { useRef } from "react";
import { MARQUEE } from "../content";
import { gsap, useGSAP, MOTION_OK } from "../motion";
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
        gsap.to(trackEl, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
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
