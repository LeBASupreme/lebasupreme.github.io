import { useRef } from "react";
import { ABOUT } from "../content";
import { useParisTime } from "../hooks/useParisTime";
import { appear, gsap, useGSAP, MOTION_OK } from "../motion";

export function About() {
  const root = useRef<HTMLElement>(null);
  const time = useParisTime();

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        appear(section, ".about-copy, .facts");
      });
    },
    { scope: root },
  );

  return (
    <section className="about" id="about" ref={root} aria-label="About">
      <div className="hairline" />
      <div className="about-grid">
        <h2 className="kicker">(About)</h2>
        <p className="about-copy">
          {ABOUT}
        </p>
      </div>
      <ul className="facts">
        <li className="fact">
          <p className="fact-label">Local time</p>
          <p className="fact-value">
            <span className="visually-hidden">Current time in Paris, </span>
            Paris, {time} <span aria-hidden="true">●</span>
          </p>
        </li>
        <li className="fact">
          <p className="fact-label">Studying</p>
          <p className="fact-value">EFREI Paris, 2024–2027</p>
        </li>
        <li className="fact">
          <p className="fact-label">Exchange</p>
          <p className="fact-value">
            <span className="only-mobile">Portsmouth, 2026</span>
            <span className="only-desktop">University of Portsmouth, 2026</span>
          </p>
        </li>
        <li className="fact">
          <p className="fact-label">Next</p>
          <p className="fact-value">
            <span className="only-mobile">AI internship, April 2027</span>
            <span className="only-desktop">AI internship, from April 2027</span>
          </p>
        </li>
      </ul>
    </section>
  );
}
