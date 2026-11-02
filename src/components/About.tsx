import { useRef } from "react";
import { ABOUT } from "../content";
import { useParisTime } from "../hooks/useParisTime";
import { gsap, SplitText, useGSAP, MOTION_OK } from "../motion";

export function About() {
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);
  const time = useParisTime();

  useGSAP(
    () => {
      const paragraph = copy.current;
      if (!paragraph) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(paragraph, { type: "words", aria: "auto" });
        const muted = tokenColor("--text-muted");
        const strong = tokenColor("--text-strong");
        gsap.fromTo(
          split.words,
          { color: muted },
          {
            color: strong,
            ease: "none",
            stagger: 0.04,
            scrollTrigger: {
              trigger: paragraph,
              start: "top 78%",
              end: "bottom 58%",
              scrub: true,
            },
          },
        );

        gsap.from(".hairline", {
          scaleX: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hairline", start: "top 92%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section className="about" id="about" ref={root} aria-label="About">
      <div className="hairline" />
      <div className="about-grid">
        <h2 className="kicker">(About)</h2>
        <p className="about-copy" ref={copy}>
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

function tokenColor(variable: string) {
  const probe = document.createElement("i");
  probe.style.color = `var(${variable})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}
