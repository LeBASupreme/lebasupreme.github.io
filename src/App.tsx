import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { Marquee } from "./components/Marquee";
import { Projects } from "./components/Projects";
import { SmoothScroll } from "./smooth";

export function App() {
  return (
    <SmoothScroll>
      <Hero />
      <Marquee />
      <main>
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
