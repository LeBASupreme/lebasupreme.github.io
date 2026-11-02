import { useRef } from "react";
import { EMAIL, LINKS } from "../config";
import { appear, gsap, useGSAP, MOTION_OK } from "../motion";

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current;
        if (section) appear(section, ".contact-grid");
      });
    },
    { scope: root },
  );

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
            <a className="email-button" href={`mailto:${EMAIL}`}>
              [Here]
            </a>
            <p className="email-hint">Opens your mail.</p>
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
