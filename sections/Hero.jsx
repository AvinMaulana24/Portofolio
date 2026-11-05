import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { SplitText, Magnetic } from "../components/ui";
import { P } from "../data";
gsap.registerPlugin(ScrollTrigger);
function Paint() {
  const c = useRef();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const cv = c.current,
      g = cv.getContext("2d"),
      pts = [],
      K = ["#141414", "#E8452C", "#0E1799"];
    let w,
      h,
      raf,
      last = -1e4,
      pm = { x: 0, y: 0 },
      ci = 0,
      lp = null;
    const rs = () => {
      w = cv.width = cv.offsetWidth;
      h = cv.height = cv.offsetHeight;
    };
    rs();
    const mv = (e) => {
      const b = cv.getBoundingClientRect();
      pm = { x: e.clientX - b.left, y: e.clientY - b.top };
      last = performance.now();
    };
    const tick = (t) => {
      const p =
        t - last < 2500
          ? pm
          : {
              x: w * (0.5 + 0.38 * Math.sin(t / 1700)),
              y: h * (0.5 + 0.3 * Math.sin(t / 1100 + 1)),
            };
      if (!lp || Math.hypot(p.x - lp.x, p.y - lp.y) > 6) {
        if (Math.random() < 0.05) ci = (ci + 1) % 3;
        pts.push({ x: p.x, y: p.y, t, c: K[ci] });
        lp = p;
        if (pts.length > 90) pts.shift();
      }
      g.clearRect(0, 0, w, h);
      g.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1],
          b = pts[i],
          age = (t - b.t) / 2200;
        if (age > 1) continue;
        g.strokeStyle = b.c;
        g.globalAlpha = (1 - age) * 0.9;
        g.lineWidth =
          14 + Math.min(60, Math.hypot(b.x - a.x, b.y - a.y) * 1.2) * (1 - age);
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
        g.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    addEventListener("pointermove", mv);
    addEventListener("resize", rs);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", mv);
      removeEventListener("resize", rs);
    };
  }, []);
  return (
    <canvas ref={c} aria-hidden className="absolute inset-0 h-full w-full" />
  );
}
export default function Hero() {
  const r = useRef(),
    D = 1.4,
    f = (d) => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: D + d },
    });
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const c = gsap.context(() => {
      gsap.to(".sun", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, r);
    return () => c.revert();
  }, []);
  const dot =
    "grid place-items-center rounded-full text-center font-display font-bold leading-tight";
  return (
    <section
      id="home"
      ref={r}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-accent px-6 pb-10 pt-32 text-bg md:pl-24 md:pr-10"
    >
      <div
        aria-hidden
        className="sun pointer-events-none absolute -right-24 top-24 h-[26rem] w-[26rem] rounded-full bg-sun"
      />
      <Paint />
      <p
        aria-hidden
        className="absolute bottom-10 left-5 hidden rotate-180 font-display text-3xl font-bold [writing-mode:vertical-rl] md:block"
      >
        {P.name}
      </p>
      <div className="relative">
        <motion.p
          {...f(0)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-bg/40 px-4 py-1.5 text-sm"
        >
          <span className="h-2 w-2 rounded-full bg-sun" />
          AVAILABLE FOR OPPORTUNITIES
        </motion.p>
        <h1 className="font-display text-[clamp(2.8rem,9vw,8.5rem)] font-extrabold leading-[.88] tracking-tight">
          <span className="block">
            <SplitText text="Building" delay={D} />
          </span>
          <span className="block md:ml-[12%]">
            <SplitText text="Digital Experiences" delay={D + 0.2} />
          </span>
          <span className="block md:ml-[34%]">
            <SplitText text="Through Code." delay={D + 0.5} />
          </span>
        </h1>
      </div>
      <div className="relative mt-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <motion.div
          {...f(0.9)}
          className="max-w-xs -rotate-2 bg-white p-5 text-ink shadow-2xl"
        >
          <p className="font-display text-xl font-bold">{P.name}</p>
          <p className="text-sm text-mute">
            Software Developer / Creative Programmer
          </p>
          <p className="mt-3 text-sm">
            Saya adalah lulusan Rekayasa Perangkat Lunak yang memiliki
            ketertarikan dalam membangun aplikasi, mengembangkan solusi digital,
            dan menciptakan pengalaman pengguna melalui teknologi.
          </p>
        </motion.div>
        <motion.div {...f(1.2)} className="flex items-end gap-3">
          <Magnetic>
            <a href="#projects" className={`${dot} h-40 w-40 bg-sun text-ink`}>
              Explore
              <br />
              My Work
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="./cv.pdf"
              download
              className={`${dot} mb-10 h-28 w-28 bg-ink text-bg`}
            >
              <span>
                <Download size={16} className="mx-auto mb-1" />
                Download CV
              </span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className={`${dot} h-24 w-24 border border-bg/70`}
            >
              Contact
              <br />
              Me
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
