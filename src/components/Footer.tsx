import { LINKS } from "../config";
import { useParisTime } from "../hooks/useParisTime";

export function Footer() {
  const time = useParisTime();

  return (
    <footer className="site-footer">
      <a className="footer-link" href={LINKS.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a className="footer-link" href={LINKS.github} target="_blank" rel="noreferrer">
        GitHub — LeBASupreme
      </a>
      <p>Paris, {time}</p>
      <p>© 2026</p>
    </footer>
  );
}
