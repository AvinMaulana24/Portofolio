import { useEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import "./Preloader.css";

const EASE = [0.2, 0.8, 0.2, 1];

const PHASES = [
  [0, "Preparing workspace"],
  [35, "Loading projects"],
  [70, "Polishing details"],
  [100, "Welcome"],
];
const phaseFor = (n) => [...PHASES].reverse().find(([t]) => n >= t)[1];

export default function Preloader({ done }) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const pathLength = useTransform(progress, (v) => v / 100);
  // Lengkung mulut: 0% = garis datar, 100% = senyum lebar
  const mouth = useTransform(progress, (v) => {
    const k = 4 + (v / 100) * 30;
    return `M 27 58 Q 50 ${58 + k} 73 58`;
  });
  const [n, setN] = useState(0);

  // `done` dari App berupa fungsi inline baru di setiap render,
  // jadi disimpan di ref agar animasi tidak ter-restart.
  const doneRef = useRef(done);
  useEffect(() => {
    doneRef.current = done;
  });

  useEffect(() => {
    progress.set(0);
    const unsub = progress.on("change", (v) => setN(Math.round(v)));
    let timer;
    const controls = animate(progress, 100, {
      duration: reduce ? 0.6 : 2.4,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        timer = setTimeout(() => doneRef.current(), 450);
      },
    });
    return () => {
      unsub();
      controls.stop();
      clearTimeout(timer);
    };
  }, [progress, reduce]);

  const status = phaseFor(n);

  return (
    <motion.div
      className="xpre"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${n}%`}
      exit={{
        y: "-100%",
        borderBottomLeftRadius: "50% 18%",
        borderBottomRightRadius: "50% 18%",
      }}
      transition={{ duration: 0.95, ease: [0.7, 0, 0.2, 1] }}
    >
      <div className="xpre-center">
        <motion.div
          className="xpre-orb"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.45 } }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <span className="xpre-dash" aria-hidden="true" />
          <span className="xpre-core" aria-hidden="true" />

          <svg className="xpre-svg" viewBox="0 0 168 168" aria-hidden="true">
            <defs>
              <linearGradient id="xpreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#A49BEE" />
                <stop offset="1" stopColor="#DCD7FF" />
              </linearGradient>
            </defs>
            <circle className="xpre-track" cx="84" cy="84" r="78" />
            <motion.circle
              className="xpre-bar"
              cx="84"
              cy="84"
              r="78"
              style={{ pathLength }}
            />
          </svg>

          <motion.svg
            className="xpre-face"
            viewBox="0 0 100 100"
            aria-hidden="true"
            animate={
              n >= 100
                ? { scale: [1, 1.22, 1], rotate: [0, -6, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Mata: muncul dengan spring, lalu berkedip berkala (CSS) */}
            {[34, 66].map((cx, i) => (
              <g key={cx} className="xpre-blink">
                <motion.circle
                  cx={cx}
                  cy="38"
                  r="5.5"
                  className="xpre-eye"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                    delay: 0.3 + i * 0.1,
                  }}
                />
              </g>
            ))}
            {/* Mulut: dari garis datar menjadi senyum sesuai progres */}
            <motion.path
              className="xpre-mouth"
              d={mouth}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          className="xpre-text"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          <span className="xpre-name">Muhammad Avin Maulana</span>
          <span className="xpre-status">
            <i className="xpre-dot" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {status}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>
      </div>

      <div className="xpre-count" aria-hidden="true">
        {String(n).padStart(2, "0")}
        <small>%</small>
      </div>
      <div className="xpre-note" aria-hidden="true">
        Portfolio 2026
      </div>
    </motion.div>
  );
}
