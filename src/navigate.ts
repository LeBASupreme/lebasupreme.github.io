import { useEffect, useState } from "react";

export function currentPath() {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path || "/";
}

export function navigate(to: string) {
  const next = to.replace(/\/+$/, "") || "/";
  if (currentPath() === next) return;
  window.history.pushState(null, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function usePathname() {
  const [path, setPath] = useState(() => currentPath());

  useEffect(() => {
    const sync = () => setPath(currentPath());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return path;
}
