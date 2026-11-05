import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

const E = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-5%" }}
    transition={{ duration: 0.9, delay, ease: E }}
  >
    {children}
  </motion.div>
);

export const SplitText = ({ text, delay = 0 }) => (
  <span aria-label={text}>
    {text.split(" ").map((w, i) => (
      <span
        key={i}
        aria-hidden
        className="inline-block overflow-hidden pr-[.25em] align-bottom"
      >
        <motion.span
          className="inline-block"
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + i * 0.07, ease: E }}
        >
          {w}
        </motion.span>
      </span>
    ))}
  </span>
);

export function Magnetic({ children, s = 0.35 }) {
  const r = useRef(),
    x = useMotionValue(0),
    y = useMotionValue(0),
    sx = useSpring(x, { stiffness: 200, damping: 15 }),
    sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={r}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        // Nonaktifkan efek magnetic pada perangkat sentuh (touchscreen)
        if (e.pointerType !== "mouse") return;
        const b = r.current.getBoundingClientRect();
        x.set((e.clientX - b.left - b.width / 2) * s);
        y.set((e.clientY - b.top - b.height / 2) * s);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Tilt({ children, className = "" }) {
  const x = useMotionValue(0),
    y = useMotionValue(0),
    rx = useSpring(x, { stiffness: 150, damping: 15 }),
    ry = useSpring(y, { stiffness: 150, damping: 15 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        // Nonaktifkan efek 3D tilt pada perangkat sentuh
        if (e.pointerType !== "mouse") return;
        const b = e.currentTarget.getBoundingClientRect();
        y.set(((e.clientX - b.left) / b.width - 0.5) * 8);
        x.set(-((e.clientY - b.top) / b.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Cursor() {
  const x = useMotionValue(-100),
    y = useMotionValue(-100),
    sx = useSpring(x, { stiffness: 500, damping: 40 }),
    sy = useSpring(y, { stiffness: 500, damping: 40 }),
    [big, setBig] = useState(false),
    [on, setOn] = useState(false);

  useEffect(() => {
    // Sembunyikan custom cursor secara penuh di perangkat touch/mobile
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    setOn(true);
    const mv = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!e.target.closest?.("a,button,input,textarea,[data-cursor]"));
    };
    addEventListener("mousemove", mv);
    return () => removeEventListener("mousemove", mv);
  }, []);

  return on ? (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ width: big ? 72 : 14, height: big ? 72 : 14 }}
      />
    </motion.div>
  ) : null;
}

export function Loader({ done }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const a = animate(0, 100, {
      duration: 1.3,
      ease: "easeInOut",
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: done,
    });
    return () => a.stop();
  }, []);

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[90] flex items-end justify-between bg-accent p-6 text-bg md:p-14"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <span className="font-display text-sm">Loading portfolio</span>
      <span className="font-display text-[clamp(4rem,20vw,14rem)] font-extrabold leading-[.8]">
        {n}
      </span>
    </motion.div>
  );
}

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll(),
    s = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-verm"
      style={{ scaleX: s }}
    />
  );
};

export function Counter({ to, dec = 0 }) {
  const r = useRef(),
    v = useInView(r, { once: true }),
    [n, setN] = useState(0);
  useEffect(() => {
    if (v) animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: setN });
  }, [v]);
  return <span ref={r}>{n.toFixed(dec)}</span>;
}

export function Marquee({ items = [] }) {
  const rm = useReducedMotion(),
    row = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-y border-line py-4">
      <motion.div
        className="flex w-max whitespace-nowrap font-display text-[clamp(1.25rem,4vw,2.5rem)] font-bold"
        animate={rm ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className="pr-10">
            {t}
            <span className="pl-10">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
