import { useRef } from "react";
import { JOURNEY } from "../content";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { DESKTOP, gsap, useGSAP, MOTION_OK } from "../motion";
import { getLenis } from "../scroll-bus";

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const desktop = useMediaQuery(`${DESKTOP} and ${MOTION_OK}`);

  useGSAP(
    () => {
      const trackEl = track.current;
      const pinEl = pin.current;
      if (!trackEl || !pinEl) return;

      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const distance = () =>
          Math.max(0, trackEl.scrollWidth - (trackEl.parentElement?.clientWidth ?? 0));

        gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });

        let dragging = false;
        let startX = 0;
        let startScroll = 0;

        const down = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          dragging = true;
          startX = event.clientX;
          startScroll = getLenis()?.scroll ?? window.scrollY;
          trackEl.setPointerCapture(event.pointerId);
        };
        const move = (event: PointerEvent) => {
          if (!dragging) return;
          const next = startScroll + (startX - event.clientX);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(next, { immediate: true });
          else window.scrollTo(0, next);
        };
        const up = () => {
          dragging = false;
        };

        trackEl.addEventListener("pointerdown", down);
        trackEl.addEventListener("pointermove", move);
        trackEl.addEventListener("pointerup", up);
        trackEl.addEventListener("pointercancel", up);
        return () => {
          trackEl.removeEventListener("pointerdown", down);
          trackEl.removeEventListener("pointermove", move);
          trackEl.removeEventListener("pointerup", up);
          trackEl.removeEventListener("pointercancel", up);
        };
      });
    },
    { scope: root },
  );

  return (
    <section className="journey" id="journey" ref={root} aria-label="Journey">
      <div className="journey-pin" ref={pin}>
        <div className="journey-head">
          <h2 className="kicker">(Journey)</h2>
          <p className="kicker">
            <span className="only-mobile">Swipe →</span>
            <span className="only-desktop">Drag or scroll →</span>
          </p>
        </div>
        <div
          className="journey-window"
          tabIndex={desktop ? -1 : 0}
          aria-label="Journey steps"
        >
          <ul className="journey-track" ref={track}>
            {JOURNEY.map((step) => (
              <li
                className={"next" in step && step.next ? "step is-next" : "step"}
                key={`${step.year}-${step.label}`}
              >
                <p className="step-year">{step.year}</p>
                <div className="step-copy">
                  <p className="step-label">{step.label}</p>
                  <p className="step-detail">{step.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
