import { useEffect, useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "../motion";
import { claimPlayback, hasClip, releasePlayback, useProjectClip } from "../playback";

export function ProjectPreview({ slug }: { slug: string | null }) {
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const slugRef = useRef(slug);
  const clip = useProjectClip(slug);
  const available = hasClip(clip);
  slugRef.current = slug;

  useGSAP(
    () => {
      const el = card.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 0, scale: 0.92 });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
        const spin = gsap.quickTo(el, "rotation", { duration: 0.5, ease: "power3.out" });
        let lastX = 0;

        const move = (event: PointerEvent) => {
          const gap = readSpace("--space-6");
          const lift = readSpace("--space-16");
          xTo(event.clientX + gap);
          yTo(event.clientY - lift);
          spin(gsap.utils.clamp(-8, 8, (event.clientX - lastX) * 0.18));
          lastX = event.clientX;
        };

        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: card },
  );

  useEffect(() => {
    const el = card.current;
    const node = video.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (slug && node && available) {
      gsap.to(el, {
        autoAlpha: 1,
        scale: 1,
        duration: reduce ? 0 : 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
      claimPlayback(node);
      return () => releasePlayback(node);
    }
    gsap.to(el, {
      autoAlpha: 0,
      scale: 0.92,
      rotation: 0,
      duration: reduce ? 0 : 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [slug, available]);

  return (
    <div className="project-float" ref={card} aria-hidden="true">
      {slug && available ? (
        <video
          key={slug}
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        >
          {clip.webm ? <source src={`/${slug}.webm`} type="video/webm" /> : null}
          {clip.mp4 ? <source src={`/${slug}.mp4`} type="video/mp4" /> : null}
        </video>
      ) : null}
    </div>
  );
}

function readSpace(name: string) {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
}
