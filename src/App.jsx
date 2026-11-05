import { lazy, Suspense, useState, useEffect } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Cursor, Loader, ScrollProgress, Marquee } from "./components/ui";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";

const About = lazy(() =>
  import("./sections/Content").then((m) => ({ default: m.About })),
);
const Skills = lazy(() =>
  import("./sections/Content").then((m) => ({ default: m.Skills })),
);
const Projects = lazy(() =>
  import("./sections/Content").then((m) => ({ default: m.Projects })),
);
const Journey = lazy(() =>
  import("./sections/Content").then((m) => ({ default: m.Journey })),
);
const Contact = lazy(() => import("./sections/Contact"));

export default function App() {
  const [l, setL] = useState(true);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "";
    } catch {
      return "";
    }
  });

  const dark = theme
    ? theme === "dark"
    : matchMedia("(prefers-color-scheme:dark)").matches;

  const toggleTheme = () => {
    const nextTheme = dark ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  };

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <ScrollProgress />
      <AnimatePresence>
        {l && <Loader done={() => setL(false)} />}
      </AnimatePresence>

      <Navbar dark={dark} toggleTheme={toggleTheme} />

      <main>
        <Hero />

        {/* Teks Berjalan (Marquee) dipasang langsung di sini agar terjamin aktif */}
        <div className="py-4 bg-accent/20">
          <Marquee
            items={[
              "Flutter",
              "Laravel",
              "React.js",
              "Firebase",
              "Supabase",
              "Python",
              "Lua",
              "MySQL",
              "UI/UX Design",
            ]}
          />
        </div>

        <Suspense fallback={null}>
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
        </Suspense>
      </main>
    </MotionConfig>
  );
}
