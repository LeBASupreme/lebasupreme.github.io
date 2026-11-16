import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { Marquee } from "./components/Marquee";
import { Projects } from "./components/Projects";
import { usePathname } from "./navigate";
import { Terminal } from "./terminal/Terminal";

export function App() {
  const path = usePathname();
  if (path === "/terminal") return <Terminal />;

  return (
    <>
      <Hero />
      <Marquee />
      <main>
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
