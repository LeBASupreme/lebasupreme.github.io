import { useEffect, useId, useRef, useState } from "react";
import { PROJECTS, type Project } from "../content";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { appear, DESKTOP, gsap, useGSAP, MOTION_OK } from "../motion";
import { claimPlayback, hasClip, releasePlayback, useProjectClip } from "../playback";
import { ProjectPreview } from "./ProjectPreview";

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const desktop = useMediaQuery(`${DESKTOP} and ${MOTION_OK}`);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current;
        if (section) appear(section, ".projects-head, .project-list");
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
          <ProjectRow
            key={project.slug}
            project={project}
            onHover={(active) =>
              setHover((current) =>
                active ? project.slug : current === project.slug ? null : current,
              )
            }
          />
        ))}
        <div className="hairline" />
      </div>
      <p className="projects-hint">Tap a row to read the note.</p>
      {desktop ? <ProjectPreview slug={hover} /> : null}
    </section>
  );
}

function ProjectRow({ project, onHover }: { project: Project; onHover: (active: boolean) => void }) {
  const row = useRef<HTMLElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const play = useRef<(next: boolean) => void>(() => {});
  const [open, setOpen] = useState(false);
  const [near, setNear] = useState(false);
  const desktop = useMediaQuery(DESKTOP);
  const media = useProjectClip(!desktop && near ? project.slug : null);
  const available = hasClip(media);
  const noteId = useId();
  const tags = project.tech === "—" ? "" : project.tech.replaceAll(", ", " · ");

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = clip.current;
    if (!node || !near) return;
    node.load();
  }, [near]);

  useEffect(() => {
    const node = clip.current;
    if (!node || desktop) return;
    if (open) claimPlayback(node);
    else releasePlayback(node);
  }, [open, desktop, near, available]);

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
  }, [open, available]);

  return (
    <article
      className={project.longName ? "project is-long" : "project"}
      ref={row}
      onMouseEnter={() => {
        if (!desktop) return;
        setOpen(true);
        onHover(true);
      }}
      onMouseLeave={() => {
        if (!desktop) return;
        setOpen(false);
        onHover(false);
      }}
    >
      <div
        className="project-main"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={noteId}
        onClick={() => {
          if (desktop) return;
          setNear(true);
          setOpen((value) => !value);
        }}
        onFocus={() => {
          if (!desktop) return;
          setOpen(true);
          onHover(true);
        }}
        onBlur={() => {
          if (!desktop) return;
          setOpen(false);
          onHover(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setNear(true);
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
        {desktop || !available ? null : (
          <div className="note-video">
            <video
              ref={clip}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            >
              {media.webm ? <source src={`/${project.slug}.webm`} type="video/webm" /> : null}
              {media.mp4 ? <source src={`/${project.slug}.mp4`} type="video/mp4" /> : null}
            </video>
          </div>
        )}
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
