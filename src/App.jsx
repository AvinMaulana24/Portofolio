import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import "./components/Panelshapes.css";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Download,
  Send,
} from "lucide-react";
import Navbar from "./components/Navbar";
gsap.registerPlugin(ScrollTrigger);

const Scene3D = lazy(() => import("./three/Scene3D"));
const EASE = [0.2, 0.8, 0.2, 1];
const CV = import.meta.env.BASE_URL + "cv.pdf";
import {
  SiJavascript,
  SiPython,
  SiPhp,
  SiReact,
  SiFlutter,
  SiLaravel,
  SiFirebase,
  SiSupabase,
  SiMysql,
  SiVite,
  SiGithub,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const TECH = [
  ["JavaScript", SiJavascript, "#d9a800"],
  ["Python", SiPython, "#3776ab"],
  ["PHP", SiPhp, "#777bb3"],
  ["Java", FaJava, "#e76f00"],
  ["React", SiReact, "#149eca"],
  ["Flutter", SiFlutter, "#02569b"],
  ["Laravel", SiLaravel, "#ff2d20"],
  ["Firebase", SiFirebase, "#f57c00"],
  ["Supabase", SiSupabase, "#2f9e6e"],
  ["MySQL", SiMysql, "#00618a"],
  ["Vite", SiVite, "#646cff"],
  ["GitHub", SiGithub, "#6e7681"],
];
const PROJECTS = [
  {
    t: "IKMION",
    d: "Mobile online examination application with secure exam sessions and instant results.",
    g: ["#39326D", "#8880D6"],
    tg: ["Flutter", "Firebase"],
  },
  {
    t: "Roblox Game",
    d: "An original Roblox experience: gameplay systems, UI and level design.",
    g: ["#8880D6", "#DCD7FF"],
    tg: ["Roblox", "Lua"],
  },
  {
    t: "Laravel Web App",
    d: "A full-stack web application with authentication, dashboards and a MySQL backend.",
    g: ["#625E91", "#A49BEE"],
    tg: ["Laravel", "PHP", "MySQL"],
  },
];
const STEPS = [
  ["🎓", "EDUCATION", "Software Engineering", "Graduated with GPA 3.68."],
  [
    "🎮",
    "PERSONAL PROJECTS",
    "Games & Apps",
    "Roblox worlds and mobile experiments.",
  ],
  [
    "⚙️",
    "DEV JOURNEY",
    "Full-Stack Growth",
    "Laravel, Flutter, Firebase and Supabase.",
  ],
  [
    "🚀",
    "INTERESTS",
    "What’s Next",
    "Creative tech, UI engineering, product thinking.",
  ],
];

/* ---------- reusable animation primitives ---------- */
const R = ({ children, className, d = 0, y = 50, ...p }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay: d, ease: EASE }}
    {...p}
  >
    {children}
  </motion.div>
);

function Mag({ as = "a", children, className = "", ...p }) {
  const C = motion[as];
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 }),
    sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <C
      className={"btn " + className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.4);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...p}
    >
      {children}
    </C>
  );
}

function Tilt({ children, className, max = 14, ...p }) {
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 150, damping: 14 }),
    sy = useSpring(ry, { stiffness: 150, damping: 14 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 800 }}
      whileHover={{ scale: 1.05 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      {...p}
    >
      {children}
    </motion.div>
  );
}

const Split = ({ t, go, d = 0, hi }) => (
  <span className="wd" aria-hidden="true">
    {t.split("").map((c, i) => (
      <motion.i
        key={i}
        className={hi ? "hi" : ""}
        initial={{ y: "110%", rotate: 8 }}
        animate={go ? { y: 0, rotate: 0 } : {}}
        transition={{ delay: d + i * 0.035, duration: 0.8, ease: EASE }}
      >
        {c}
      </motion.i>
    ))}
  </span>
);

/* ---------- SVG Futuristic Background Component (FIX TOTAL) ---------- */
function SvgBackground() {
  const content = (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100dvh",
        pointerEvents: "none",
        zIndex: -9999,
        overflow: "hidden",
        backgroundColor: "#08090d",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#08090d" />
            <stop offset="50%" stopColor="#141226" />
            <stop offset="100%" stopColor="#1c1836" />
          </linearGradient>

          <radialGradient id="quantumGlow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8880D6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#39326D" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="quantumGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC21A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E8452C" stopOpacity="0" />
          </radialGradient>

          <pattern
            id="cyberGridPattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="#A49BEE"
              strokeWidth="0.8"
              strokeOpacity="0.12"
            />
          </pattern>

          <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>

        <rect width="1920" height="1080" fill="url(#bgGrad)" />

        <g filter="url(#blurFilter)">
          <circle cx="400" cy="300" r="300" fill="url(#quantumGlow1)" />
          <circle cx="1500" cy="800" r="350" fill="url(#quantumGlow2)" />
        </g>

        <g className="svg-cyber-grid">
          <rect
            x="-400"
            y="-200"
            width="2720"
            height="1480"
            fill="url(#cyberGridPattern)"
          />
        </g>

        <g className="svg-scanner-beam">
          <line
            x1="0"
            y1="0"
            x2="1920"
            y2="0"
            stroke="#FFC21A"
            strokeWidth="2"
            strokeOpacity="0.8"
            filter="drop-shadow(0 0 10px #FFC21A)"
          />
        </g>
      </svg>
    </div>
  );

  return createPortal(content, document.body);
}

/* ---------- sections ---------- */
function Hero({ go }) {
  const ref = useRef();
  useEffect(() => {
    const c = gsap.context(() => {
      gsap.utils.toArray("[data-d]").forEach((el) =>
        gsap.to(el, {
          yPercent: +el.dataset.d,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }),
      );
    }, ref);
    return () => c.revert();
  }, []);
  const fade = (d) => ({
    initial: { opacity: 0, y: 24 },
    animate: go ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.8, ease: EASE },
  });
  return (
    <section
      id="home"
      ref={ref}
      style={{ paddingTop: "clamp(24px, 5vh, 48px)" }}
    >
      <div className="panel hero shape shape-hero p-8 md:p-12">
        <div>
          <motion.div className="eyebrow" {...fade(0.1)}>
            CREATIVE DEVELOPER PORTFOLIO
          </motion.div>
          <h1 aria-label="Designing ideas into digital reality.">
            <span className="ln">
              <Split t="DESIGNING" go={go} d={0.2} />
            </span>
            <span className="ln">
              <Split t="IDEAS" hi go={go} d={0.45} />{" "}
              <Split t="INTO" go={go} d={0.6} />
            </span>
            <span className="ln">
              <Split t="DIGITAL" go={go} d={0.8} />{" "}
              <Split t="REALITY." hi go={go} d={1} />
            </span>
          </h1>
          <motion.div className="sub" {...fade(1.3)}>
            Software Developer | Creative Programmer
          </motion.div>
          <motion.p className="d" {...fade(1.4)}>
            Saya merupakan lulusan Rekayasa Perangkat Lunak yang memiliki
            ketertarikan dalam membangun aplikasi, mengembangkan teknologi, dan
            menciptakan solusi digital yang inovatif.
          </motion.p>
          <motion.div className="btns" {...fade(1.55)}>
            <Mag className="dark" href="#projects">
              Explore My Work <ArrowRight size={16} />
            </Mag>
            <Mag href={CV} download>
              Download CV
            </Mag>
          </motion.div>
        </div>
        <Tilt className="stage" max={8}>
          <svg
            viewBox="0 0 500 500"
            role="img"
            aria-label="Floating 3D laptop illustration"
          >
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DCD7FF" />
                <stop offset="1" stopColor="#A49BEE" />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4b4392" />
                <stop offset="1" stopColor="#29264D" />
              </linearGradient>
              <radialGradient id="g3" cx=".35" cy=".3">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#8880D6" />
              </radialGradient>
            </defs>
            <ellipse
              cx="250"
              cy="440"
              rx="170"
              ry="26"
              fill="#29264D"
              opacity=".28"
            />
            <g className="fl2" style={{ transformOrigin: "250px 300px" }}>
              <path d="M120 330 L190 392 L400 352 L340 292Z" fill="url(#g1)" />
              <path d="M120 330 L190 392 L190 408 L120 346Z" fill="#8880D6" />
              <path d="M190 392 L400 352 L400 368 L190 408Z" fill="#77719C" />
              <path d="M140 150 L330 120 L372 282 L180 316Z" fill="url(#g2)" />
              <path
                d="M170 178 L310 156 L336 262 L196 286Z"
                fill="#8880D6"
                opacity=".55"
              />
              <text
                x="190"
                y="236"
                fill="#DCD7FF"
                fontFamily="Syne,sans-serif"
                fontWeight="800"
                fontSize="46"
                transform="rotate(-9 190 236)"
              >
                &lt;/&gt;
              </text>
            </g>
            <circle cx="408" cy="120" r="34" fill="url(#g3)" className="fl2" />
            <circle cx="84" cy="96" r="20" fill="url(#g3)" className="fl2" />
            <ellipse
              className="spin"
              cx="96"
              cy="300"
              rx="52"
              ry="16"
              fill="none"
              stroke="#DCD7FF"
              strokeWidth="6"
              opacity=".8"
            />
            <path
              className="spin"
              d="M420 300 l30 -14 l30 14 l-30 14z M420 300 v34 l30 14 v-34z M480 300 v34 l-30 14 v-34z"
              fill="#39326D"
            />
          </svg>
          <div className="px" data-d="-25" style={{ top: "6%", right: "6%" }}>
            <div className="glass fl2">{"{ }"}</div>
          </div>
          <div className="px" data-d="20" style={{ bottom: "12%", left: 0 }}>
            <div className="glass fl2" style={{ width: 70, height: 70 }}>
              &lt;/&gt;
            </div>
          </div>
          <div className="px" data-d="-15" style={{ top: "30%", left: "-2%" }}>
            <div className="badge fl2">⚛ React</div>
          </div>
          <div className="px" data-d="25" style={{ bottom: "4%", right: "8%" }}>
            <div className="badge fl2">Flutter</div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about">
      <R className="panel alt about shape shape-about p-8 md:p-12">
        <div>
          <div className="eyebrow">WHO I AM</div>
          <h2 className="disp">
            About <span className="hi">Me.</span>
          </h2>
          <p>
            I’m a Software Engineering graduate who loves turning rough ideas
            into polished apps, games and web products.
          </p>
          <p>My philosophy: learn in public, ship small, refine forever.</p>
        </div>
        <div className="frame">
          <motion.div
            className="in"
            initial={{ clipPath: "inset(100% -30% -30% -30%)" }}
            whileInView={{ clipPath: "inset(-20% -30% -30% -30%)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
          >
            <svg
              viewBox="0 0 200 250"
              width="80%"
              aria-label="Portrait placeholder"
            >
              <circle cx="100" cy="92" r="46" fill="#39326D" />
              <path d="M20 250 q10 -100 80 -100 q70 0 80 100z" fill="#8880D6" />
              <rect
                x="62"
                y="82"
                width="76"
                height="26"
                rx="13"
                fill="#DCD7FF"
                opacity=".9"
              />
            </svg>
          </motion.div>
        </div>
        <motion.div
          className="quote"
          initial={{ opacity: 0, rotate: -10, y: 60 }}
          whileInView={{ opacity: 1, rotate: 3, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 70, delay: 0.3 }}
        >
          <div className="disp">
            KEEP LEARNING.
            <br />
            KEEP BUILDING.
            <br />
            KEEP CREATING.
          </div>
          <small>Rekayasa Perangkat Lunak · IPK 3.68</small>
        </motion.div>
      </R>
    </section>
  );
}

function Tech() {
  const rawTechList = TECH.map((t) => t[0]);
  const techString = rawTechList.join(" ✦ ") + " ✦ ";

  const V = {
    hide: { opacity: 0, y: 50, scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <section id="skills">
      <R className="panel tech shape shape-tech p-8 md:p-12">
        <div className="eyebrow">STACK</div>
        <h2 className="disp">
          TECHNOLOGIES I <span className="hi">WORK WITH.</span>
        </h2>

        <div className="my-8 overflow-hidden w-full" aria-hidden="true">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="6"
            className="py-2 block w-full"
          >
            <span className="font-display text-[clamp(1.5rem,3.5vw,3rem)] font-bold text-white/40 tracking-wider whitespace-nowrap">
              {techString} &nbsp;&nbsp;&nbsp; {techString}
            </span>
          </marquee>
        </div>

        <motion.div
          className="grid"
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.06 }}
        >
          {TECH.map(([n, Icon, c]) => (
            <Tilt key={n} className="tile" variants={V}>
              <b
                style={{
                  background: c,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon size={22} color="#fff" aria-hidden="true" />
              </b>
              {n}
            </Tilt>
          ))}
        </motion.div>
      </R>
    </section>
  );
}

function Projects() {
  const [i, setI] = useState(0),
    p = PROJECTS[i],
    L = PROJECTS.length;

  const go = (n, dir) => {
    setI(n);
    window.dispatchEvent(
      new CustomEvent("scene3d:project", { detail: { dir } }),
    );
  };
  return (
    <section id="projects">
      <R className="panel alt shape shape-projects p-8 md:p-12">
        <div className="eyebrow">SELECTED WORK</div>
        <h2
          className="disp"
          style={{
            fontSize: "clamp(32px,4.4vw,56px)",
            color: "#fff",
            margin: "10px 0 28px",
          }}
        >
          FEATURED <span className="hi">PROJECTS.</span>
        </h2>
        <div className="pj">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              className="big"
              initial={{ opacity: 0, x: 70, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -70, rotate: -2 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <motion.div
                className="shot"
                style={{
                  background: `linear-gradient(135deg,${p.g[0]},${p.g[1]})`,
                }}
                initial={{
                  clipPath: "inset(0 100% 0 0 round 58px 20px 58px 20px)",
                }}
                animate={{
                  clipPath: "inset(0 0% 0 0 round 58px 20px 58px 20px)",
                }}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
              >
                0{i + 1} · {p.t}
                <em>PREVIEW</em>
              </motion.div>
              <div className="info">
                <h3 className="disp">{p.t}</h3>
                <p>{p.d}</p>
                <div className="tags">
                  {p.tg.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
                <a className="vp" href="#">
                  View Project{" "}
                  <ArrowUpRight size={14} style={{ verticalAlign: "-2px" }} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="side">
            {PROJECTS.map((q, k) => (
              <motion.button
                key={q.t}
                className={"th" + (k === i ? " on" : "")}
                onClick={() => go(k, k > i ? 1 : -1)}
                whileTap={{ scale: 0.96 }}
              >
                <i
                  style={{
                    background: `linear-gradient(135deg,${q.g[0]},${q.g[1]})`,
                  }}
                />
                0{k + 1} {q.t}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="nv" style={{ marginTop: 22 }}>
          <Mag
            as="button"
            className="ic"
            aria-label="Previous project"
            onClick={() => go((i + L - 1) % L, -1)}
          >
            <ArrowLeft size={20} />
          </Mag>
          <Mag
            as="button"
            className="ic"
            aria-label="Next project"
            onClick={() => go((i + 1) % L, 1)}
          >
            <ArrowRight size={20} />
          </Mag>
        </div>
      </R>
    </section>
  );
}

function Journey() {
  const ref = useRef();
  useEffect(() => {
    const c = gsap.context(() => {
      gsap.to(".tlp", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".tl",
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      });
      gsap.from(".st", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tl", start: "top 80%" },
      });
      gsap.from(".st .o", {
        scale: 0,
        rotate: -90,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".tl", start: "top 80%" },
      });
    }, ref);
    return () => c.revert();
  }, []);
  return (
    <section id="journey" ref={ref}>
      <div className="panel shape shape-journey p-8 md:p-12">
        <div className="eyebrow">TIMELINE</div>
        <h2
          className="disp"
          style={{
            fontSize: "clamp(32px,4.4vw,56px)",
            color: "#fff",
            marginTop: 10,
          }}
        >
          EDUCATION &amp; <span className="hi">JOURNEY.</span>
        </h2>
        <div className="tl">
          <div className="tlp" />
          {STEPS.map(([ic, k, h, t]) => (
            <div className="st" key={k}>
              <div className="o">{ic}</div>
              <div>
                <small>{k}</small>
                <h3 className="disp">{h}</h3>
                <p>{t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact">
      <R className="panel alt contact shape shape-contact p-8 md:p-12">
        <div>
          <div className="eyebrow">CONTACT</div>
          <h2 className="disp">
            LET’S CREATE <span className="hi">SOMETHING AMAZING.</span>
          </h2>
          <p className="d">
            Have an idea or project? Let’s turn it into reality.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              e.target.reset();
            }}
          >
            <div className="r2">
              <input
                required
                name="name"
                placeholder="Name"
                aria-label="Name"
                autoComplete="name"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                aria-label="Email"
                autoComplete="email"
              />
            </div>
            <input
              required
              name="subject"
              placeholder="Subject"
              aria-label="Subject"
            />
            <textarea
              required
              name="message"
              rows="4"
              placeholder="Message"
              aria-label="Message"
            />
            <div>
              <Mag as="button" className="dark" type="submit">
                Send Message <Send size={16} />
              </Mag>
            </div>
            <AnimatePresence>
              {sent && (
                <motion.div
                  id="ok"
                  role="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Thanks! Connect a form service (Formspree, EmailJS) to deliver
                  messages.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
        <div className="stage cube">
          <svg viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DCD7FF" />
                <stop offset="1" stopColor="#8880D6" />
              </linearGradient>
            </defs>
            <g className="fl2">
              <path
                d="M150 40 L250 100 L250 200 L150 260 L50 200 L50 100Z"
                fill="url(#g4)"
              />
              <path
                d="M150 40 L250 100 L150 160 L50 100Z"
                fill="#fff"
                opacity=".55"
              />
              <path
                d="M150 160 L250 100 L250 200 L150 260Z"
                fill="#39326D"
                opacity=".75"
              />
              <text
                x="104"
                y="190"
                fontFamily="Syne"
                fontWeight="800"
                fontSize="44"
                fill="#DCD7FF"
                transform="rotate(-6 104 190)"
              >
                &lt;/&gt;
              </text>
            </g>
          </svg>
        </div>
      </R>
    </section>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "";
    } catch {
      return "";
    }
  });
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const dark = theme
    ? theme === "dark"
    : matchMedia("(prefers-color-scheme:dark)").matches;

  useEffect(() => {
    if (theme) {
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem("theme", theme);
      } catch {}
    }
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    if (ready) setTimeout(() => ScrollTrigger.refresh(), 100);
  }, [ready]);

  const toggleTheme = () => {
    const nextTheme = dark ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  };

  return (
    <>
      {/* Memanggil Latar Belakang SVG Futuristik */}
      <SvgBackground />

      <AnimatePresence>
        {!ready && <Preloader done={() => setReady(true)} />}
      </AnimatePresence>
      <motion.div className="bar" style={{ scaleX: sx }} />
      <Cursor />

      {ready && (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      )}

      {/* Futuristic Neural Interface Navbar */}
      <Navbar dark={dark} toggleTheme={toggleTheme} />

      <main className="wrap relative z-10">
        <Hero go={ready} />
        <About />
        <Tech />
        <Projects />
        <Journey />
        <Contact />
      </main>

      <footer className="relative z-20 border-t border-[#8880D6]/20 bg-[#08090d]/90 backdrop-blur-md pt-16 pb-28 mt-20">
        <div className="wrap max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-[#A49BEE]/80 font-mono text-center">
              Software Developer &amp; Creative Programmer
            </p>
          </div>

          <div className="text-xs font-mono text-[#A49BEE]/60 text-center">
            © 2026 Muhammad Avin Maulana. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <nav
              aria-label="Social"
              className="flex items-center gap-4 text-sm font-mono text-[#DCD7FF]/80"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFC21A] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFC21A] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFC21A] transition-colors"
              >
                Instagram
              </a>
            </nav>

            <Mag
              as="a"
              href="#home"
              className="p-3 rounded-2xl bg-[#39326D]/60 border border-[#8880D6]/30 text-[#DCD7FF] hover:text-[#FFC21A] transition-colors flex items-center justify-center"
            >
              <ArrowUp size={16} />
            </Mag>
          </div>
        </div>
      </footer>
    </>
  );
}
