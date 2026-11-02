import { useRef } from "react";
import { JOURNEY } from "../content";
import { DESKTOP, gsap, useGSAP, MOTION_OK } from "../motion";

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const pin = section.querySelector<HTMLElement>(".journey-pin");
      const frame = section.querySelector<HTMLElement>(".journey-window");
      const track = section.querySelector<HTMLElement>(".journey-track");
      if (!pin || !frame || !track) return;

      const mm = gsap.matchMedia();

      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        frame.classList.add("is-driven");
        const travel = () => Math.max(0, track.scrollWidth - frame.clientWidth);
        gsap.from(".step", {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        });
        gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top 18%",
            end: () => `+=${travel()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        return () => frame.classList.remove("is-driven");
      });

      mm.add(`(max-width: 1199px) and ${MOTION_OK}`, () => {
        gsap.from(".step", {
          x: 40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="journey" id="journey" ref={root} aria-label="Journey">
      <div className="journey-pin">
        <div className="journey-head">
          <h2 className="kicker">(Journey)</h2>
          <p className="kicker">
            <span className="only-mobile">Swipe →</span>
            <span className="only-desktop">Scroll →</span>
          </p>
        </div>
        <div className="journey-window" tabIndex={0} aria-label="Journey steps">
          <ul className="journey-track">
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
