import { useEffect, useId, useRef, useState } from "react";
import { PROJECTS, type Project } from "../content";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { DESKTOP, gsap, useGSAP, MOTION_OK } from "../motion";

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".project", {
          y: 28,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".project-list", start: "top 82%" },
        });
        gsap.from(".hairline", {
          scaleX: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hairline", start: "top 92%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="projects" id="projects" ref={root} aria-labelledby="projects-title">
      <div className="projects-head">
        <h2 id="projects-title">Projects</h2>
        <p className="projects-count">(06)</p>
      </div>
      <div className="project-list">
        {PROJECTS.map((project) => (
          <ProjectRow key={project.index} project={project} />
        ))}
        <div className="hairline" />
      </div>
      <p className="projects-hint">Tap a row to read the note.</p>
    </section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const row = useRef<HTMLElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const play = useRef<(next: boolean) => void>(() => {});
  const [open, setOpen] = useState(false);
  const desktop = useMediaQuery(DESKTOP);
  const noteId = useId();
  const tags = project.tech === "—" ? "" : project.tech.replaceAll(", ", " · ");

  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;
      gsap.set(".note", { height: 0, overflow: "hidden" });
      play.current = contextSafe((next: boolean) => {
        const article = row.current;
        if (!article) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const wide = window.matchMedia(DESKTOP).matches;
        const duration = reduce ? 0 : 0.45;
        if (wide) {
          gsap.to(article, {
            backgroundColor: next ? tokenColor("--surface-brand") : "transparent",
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(article.querySelectorAll("[data-ink='strong']"), {
            color: next ? tokenColor("--text-on-brand") : tokenColor("--text-strong"),
            duration,
            overwrite: "auto",
          });
          gsap.to(article.querySelectorAll("[data-ink='muted']"), {
            color: next ? tokenColor("--text-on-brand") : tokenColor("--text-muted"),
            duration,
            overwrite: "auto",
          });
        }
        gsap.to(article.querySelector(".note"), {
          height: next ? "auto" : 0,
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    },
    { scope: row },
  );

  useEffect(() => {
    play.current(open);
  }, [open]);

  return (
    <article
      className={project.longName ? "project is-long" : "project"}
      ref={row}
      onMouseEnter={() => desktop && setOpen(true)}
      onMouseLeave={() => desktop && setOpen(false)}
    >
      <div
        className="project-main"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={noteId}
        onClick={() => {
          if (!desktop) setOpen((value) => !value);
        }}
        onFocus={() => desktop && setOpen(true)}
        onBlur={() => desktop && setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        <span className="project-index" data-ink="muted">
          {project.index}
        </span>
        <span className="project-name" data-ink="strong">
          {project.name}
        </span>
        <span className="project-role" data-ink="strong">
          {project.role}
        </span>
        <span className="project-tech" data-ink="muted">
          {project.tech}
        </span>
        <span className="project-year" data-ink="muted">
          {project.year}
        </span>
        <span className="project-meta" data-ink="muted">
          {project.mobileMeta}
        </span>
        <span className={open ? "project-toggle is-open" : "project-toggle"} aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </div>
      <div className="note" id={noteId} ref={note} aria-hidden={!open}>
        <p className="note-copy" data-ink="strong">
          {project.note}
        </p>
        {tags ? (
          <p className="note-tags" data-ink="muted">
            {tags}
          </p>
        ) : null}
      </div>
    </article>
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
