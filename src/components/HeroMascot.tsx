import { useEffect, useRef, useState } from "react";

const LABEL = "Drawing of Aziz walking, hands in pockets";

export function HeroMascot() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const video = videoRef.current;
    if (!video) return;

    let alive = true;
    const fallback = () => {
      if (alive) setShowVideo(false);
    };
    const confirmAlpha = () => {
      if (!alive || video.videoWidth === 0) return;
      const sample = document.createElement("canvas");
      sample.width = 4;
      sample.height = 4;
      const context = sample.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setShowVideo(true);
        return;
      }
      context.drawImage(video, 0, 0, 4, 4);
      const corner = context.getImageData(0, 0, 1, 1).data;
      setShowVideo(corner[3] < 250);
    };

    video.addEventListener("error", fallback);
    video.addEventListener("loadeddata", confirmAlpha);
    video.play().catch(fallback);

    return () => {
      alive = false;
      video.removeEventListener("error", fallback);
      video.removeEventListener("loadeddata", confirmAlpha);
    };
  }, [reduce]);

  return (
    <>
      <img
        src="/mascot.png"
        alt={LABEL}
        draggable={false}
        className={showVideo ? "is-covered" : undefined}
      />
      {reduce ? null : (
        <video
          ref={videoRef}
          className={showVideo ? "is-on" : undefined}
          autoPlay
          muted
          loop
          playsInline
          poster="/mascot.png"
          aria-label={LABEL}
        >
          <source src="/mascot-loop-transparent.mov" type='video/mp4; codecs="hvc1"' />
          <source src="/mascot-loop-transparent.webm" type="video/webm" />
        </video>
      )}
    </>
  );
}
