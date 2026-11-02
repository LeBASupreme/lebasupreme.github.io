import { useEffect, useState } from "react";

let current: HTMLVideoElement | null = null;

export function claimPlayback(video: HTMLVideoElement) {
  if (current && current !== video) {
    current.pause();
    try {
      current.currentTime = 0;
    } catch {
      /* metadata not ready */
    }
  }
  current = video;
  video.play().catch(() => {});
}

export function releasePlayback(video: HTMLVideoElement) {
  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    /* metadata not ready */
  }
  if (current === video) current = null;
}

export type ClipFiles = { webm: boolean; mp4: boolean };

const NO_CLIP: ClipFiles = { webm: false, mp4: false };

/** Which of `/<slug>.webm` and `/<slug>.mp4` are real video files. */
export function useProjectClip(slug: string | null) {
  const [files, setFiles] = useState<ClipFiles>(NO_CLIP);

  useEffect(() => {
    if (!slug) {
      setFiles(NO_CLIP);
      return;
    }
    let cancel = false;
    Promise.all([isVideo(`/${slug}.webm`), isVideo(`/${slug}.mp4`)]).then(([webm, mp4]) => {
      if (!cancel) setFiles({ webm, mp4 });
    });
    return () => {
      cancel = true;
    };
  }, [slug]);

  return files;
}

export function hasClip(files: ClipFiles) {
  return files.webm || files.mp4;
}

function isVideo(url: string) {
  return fetch(url, { method: "HEAD" })
    .then((res) => {
      const type = res.headers.get("content-type") ?? "";
      return res.ok && type.startsWith("video");
    })
    .catch(() => false);
}
