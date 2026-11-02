import { useRef } from "react";
import { getLenis } from "../scroll-bus";
import { useMagnetic } from "../hooks/useMagnetic";
import { gsap, SplitText, useGSAP, MOTION_OK } from "../motion";

function scrollTo(target: string) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target);
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

function space(name: string) {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLParagraphElement>(null);
  const cta = useMagnetic<HTMLAnchorElement>(0.4);

  useGSAP(
    () => {
      const hero = root.current;
      const titleEl = title.current;
      const floatEl = float.current;
      const cursorEl = cursor.current;
      const parallaxEl = parallax.current;
      const bubbleEl = bubble.current;
      if (!hero || !titleEl || !floatEl || !cursorEl || !parallaxEl || !bubbleEl) return;

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

        gsap.from(floatEl, {
          scale: 0.72,
          opacity: 0,
          y: space("--space-8"),
          duration: 0.9,
          delay: 0.15,
          ease: "back.out(1.7)",
          transformOrigin: "50% 100%",
        });
        gsap.to(floatEl, {
          y: -space("--space-3"),
          rotation: 1.6,
          duration: 3.2,
          delay: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.from(bubbleEl, {
          autoAlpha: 0,
          y: space("--space-4"),
          duration: 0.6,
          delay: 0.85,
          ease: "power3.out",
        });

        gsap.to(parallaxEl, {
          y: () => window.innerHeight * 0.16,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        const xTo = gsap.quickTo(cursorEl, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(cursorEl, "y", { duration: 0.6, ease: "power3.out" });
        const fine = window.matchMedia("(pointer: fine)");
        const onMove = (event: PointerEvent) => {
          if (!fine.matches) return;
          const box = hero.getBoundingClientRect();
          const dx = (event.clientX - box.left) / box.width - 0.5;
          const dy = (event.clientY - box.top) / box.height - 0.5;
          xTo(dx * space("--space-8"));
          yTo(dy * space("--space-5"));
        };
        hero.addEventListener("pointermove", onMove);
        return () => {
          hero.removeEventListener("pointermove", onMove);
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
        <a
          ref={cta}
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
      </nav>
      <div className="hero-stage">
        <h1 className="hero-title" ref={title}>
          Hi,
          <br />
          I’m
          <br />
          Aziz.
        </h1>
        <div className="mascot-parallax" ref={parallax}>
          <div className="mascot-cursor" ref={cursor}>
            <div className="mascot-float" ref={float}>
              <img
                src="/mascot.png"
                alt="Drawing of Aziz walking, hands in pockets"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <p className="bubble" ref={bubble}>
          <span className="only-desktop">Psst. Looking for an internship from April 2027.</span>
          <span className="only-mobile">Psst. Internship from April 2027?</span>
        </p>
        <div className="hero-aside">
          <p className="kicker">(Paris — available April 2027)</p>
          <p className="hero-bio">
            Engineering student at EFREI Paris. Back-ends, AI agents, and interfaces that move just
            right.
          </p>
          <button
            type="button"
            className="kicker hero-scroll"
            onClick={() => scrollTo("#about")}
          >
            Scroll ↓
          </button>
        </div>
      </div>
    </header>
  );
}
