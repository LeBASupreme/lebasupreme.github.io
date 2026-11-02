import { useRef } from "react";
import { LINKS } from "../config";
import { HeroMascot } from "./HeroMascot";
import { gsap, SplitText, useGSAP, MOTION_OK } from "../motion";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.67c0-1.83-.03-4.18-2.55-4.18-2.55 0-2.94 1.99-2.94 4.05V24h-4V8.5z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function scrollTo(target: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector(target)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const bubble = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const titleEl = title.current;
      const bubbleEl = bubble.current;
      if (!titleEl || !bubbleEl) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(titleEl, { type: "lines", mask: "lines", aria: "auto" });
        let revealed = false;
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.03,
          onComplete: () => {
            split.revert();
            revealed = true;
          },
        });
        gsap.from(bubbleEl, { opacity: 0, duration: 0.5, delay: 0.45, ease: "power2.out" });
        return () => {
          if (!revealed) split.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <header className="hero" ref={root}>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <nav className="hero-nav" aria-label="Primary">
        <p className="hero-id">
          <span>Aziz Ben Amor</span>
          <span className="hero-role">Full-stack developer</span>
        </p>
        <div className="hero-tools">
          <a className="hero-social" href={LINKS.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon />
            <span className="visually-hidden">LinkedIn</span>
          </a>
          <a className="hero-social" href={LINKS.github} target="_blank" rel="noreferrer">
            <GitHubIcon />
            <span className="visually-hidden">GitHub</span>
          </a>
          <a
            className="hero-cta"
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollTo("#contact");
            }}
          >
            <span className="only-mobile">Contact</span>
            <span className="only-desktop">Get in touch →</span>
          </a>
        </div>
      </nav>
      <div className="hero-stage">
        <h1 className="hero-title" ref={title}>
          Hi,
          <br />
          I’m
          <br />
          Aziz.
        </h1>
        <div className="mascot">
          <HeroMascot />
        </div>
        <p className="bubble" ref={bubble}>
          <span className="only-desktop">Psst. Looking for an internship from April 2027.</span>
          <span className="only-mobile">Psst. Internship from April 2027?</span>
        </p>
        <div className="hero-aside">
          <p className="kicker">(Paris — available April 2027)</p>
          <p className="hero-bio">
            Full-stack developer in Paris. I build SaaS products, apps and AI agents that actually ship.
          </p>
          <button type="button" className="kicker hero-scroll" onClick={() => scrollTo("#about")}>
            Scroll ↓
          </button>
        </div>
      </div>
    </header>
  );
}
