import { useEffect, useRef, useState } from "react";
import { EMAIL, LINKS } from "../config";
import { useMagnetic } from "../hooks/useMagnetic";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { DESKTOP, gsap, useGSAP, MOTION_OK } from "../motion";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLButtonElement>(null);
  const magnet = useMagnetic<HTMLButtonElement>(0.22);
  const [copied, setCopied] = useState(false);
  const desktop = useMediaQuery(DESKTOP);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".hairline", {
          scaleX: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hairline", start: "top 92%" },
        });
        gsap.to(".contact-mascot img", {
          y: -8,
          rotation: 1.2,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: root },
  );

  useEffect(() => {
    const node = emailRef.current;
    if (!node) return;
    const fit = () => fitEmail(node);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [desktop]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const field = document.createElement("textarea");
      field.value = EMAIL;
      field.setAttribute("readonly", "");
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const hint = copied ? "Copied." : desktop ? "Click it, it’s copied." : "Tap it, it’s copied.";

  return (
    <section className="contact" id="contact" ref={root} aria-labelledby="contact-title">
      <div className="hairline" />
      <div className="contact-grid">
        <p className="kicker">(Contact)</p>
        <div className="contact-body">
          <div className="contact-lead">
            <h2 id="contact-title">Write to me, I reply fast.</h2>
            <div className="contact-mascot">
              <img src="/mascot.png" alt="" aria-hidden="true" draggable={false} />
            </div>
          </div>
          <div className="contact-mail">
            <button
              ref={(node) => {
                emailRef.current = node;
                magnet.current = node;
              }}
              type="button"
              className="email-button"
              onClick={copyEmail}
            >
              {EMAIL}
            </button>
            <p className="email-hint" aria-live="polite">
              {hint}
            </p>
          </div>
          <ul className="contact-links">
            <li>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a href={LINKS.github} target="_blank" rel="noreferrer">
                GitHub — LeBASupreme <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function fitEmail(node: HTMLElement) {
  node.style.fontSize = "";
  const min = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--font-size-2xl"),
  );
  let size = parseFloat(getComputedStyle(node).fontSize);
  while (node.scrollWidth > node.clientWidth + 1 && size > min) {
    size -= 1;
    node.style.fontSize = `${size}px`;
  }
}
