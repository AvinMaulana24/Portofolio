import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Home, User, Layers, FolderKanban, Route, Mail } from "lucide-react";
import NavigationMenu from "./NavigationMenu";
import "./FloatingNavigation.css";

// Menu & ID section sama persis dengan navbar lama
export const NAV_ITEMS = [
  { name: "HOME", id: "home", icon: Home },
  { name: "ABOUT", id: "about", icon: User },
  { name: "EXPERTISE", id: "skills", icon: Layers },
  { name: "PROJECTS", id: "projects", icon: FolderKanban },
  { name: "JOURNEY", id: "journey", icon: Route },
  { name: "CONTACT", id: "contact", icon: Mail },
];

const getMode = () => {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1100) return "tablet";
  return "desktop";
};

function useLayoutMode() {
  const [mode, setMode] = useState(getMode);
  useEffect(() => {
    const onResize = () => setMode(getMode());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mode;
}

/** Empat titik yang berubah (morph) menjadi X */
function MenuGlyph({ open }) {
  const corners = [
    [6, 6],
    [18, 6],
    [6, 18],
    [18, 18],
  ];
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      animate={{ rotate: open ? 135 : 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
      aria-hidden="true"
    >
      {corners.map(([x, y], i) => (
        <motion.line
          key={i}
          x1={x}
          y1={y}
          initial={false}
          animate={{ x2: open ? 12 : x + 0.01, y2: open ? 12 : y + 0.01 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
        />
      ))}
    </motion.svg>
  );
}

export default function FloatingNavigation({ dark, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(NAV_ITEMS[0].id);
  const mode = useLayoutMode();
  const reduce = useReducedMotion();

  const buttonRef = useRef(null);
  const lockRef = useRef(false); // true selama smooth-scroll hasil klik menu
  const unlockRef = useRef(0);

  /* ---------- Scroll detection (tidak pernah membuka menu) ---------- */
  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      if (lockRef.current) return;
      const probe = window.innerHeight * 0.35;
      let current = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= probe) current = item.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) current = NAV_ITEMS[NAV_ITEMS.length - 1].id;
      setActive(current);
    };

    const onScroll = () => {
      if (lockRef.current) {
        // Tunggu smooth-scroll selesai agar tidak bentrok dengan klik menu
        clearTimeout(unlockRef.current);
        unlockRef.current = setTimeout(() => {
          lockRef.current = false;
          update();
        }, 160);
        return;
      }
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(unlockRef.current);
    };
  }, []);

  /* ---------- Escape menutup menu ---------- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ---------- Klik menu: tutup + smooth scroll + update active ---------- */
  const handleSelect = useCallback(
    (id) => {
      setOpen(false);
      setActive(id);
      const el = document.getElementById(id);
      if (!el) return;
      lockRef.current = true;
      clearTimeout(unlockRef.current);
      unlockRef.current = setTimeout(() => {
        lockRef.current = false;
      }, 1400);
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      try {
        history.replaceState(null, "", `#${id}`);
      } catch {
        /* abaikan */
      }
    },
    [reduce],
  );

  const handleClose = useCallback(() => setOpen(false), []);

  /* ---------- Efek magnetik pada tombol ---------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 16, mass: 0.4 });

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = buttonRef.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* ---------- Cincin progres scroll ---------- */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((i) => i.id === active),
  );
  const activeNum = String(activeIndex + 1).padStart(2, "0");
  const resumeHref =
    import.meta.env.BASE_URL + "CV_Muhammad_Avin_Maulana_IT Programmer.pdf";

  return (
    <div className="fnav" data-open={open} data-mode={mode}>
      {/* Klik di luar menu = tutup */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="fnav-backdrop"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fnav-stage">
        <AnimatePresence>
          {open && (
            <NavigationMenu
              key="menu"
              items={NAV_ITEMS}
              active={active}
              mode={mode}
              dark={dark}
              toggleTheme={toggleTheme}
              resumeHref={resumeHref}
              reduce={reduce}
              onSelect={handleSelect}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>

        <div className="fnav-shadow" aria-hidden="true" />

        <div className="fnav-float">
          <span className="fnav-glow" aria-hidden="true" />

          <motion.button
            ref={buttonRef}
            type="button"
            className="fnav-button"
            data-open={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="fnav-menu"
            style={{ x: sx, y: sy }}
            animate={{ scale: open ? 1.1 : 1 }}
            whileHover={reduce ? undefined : { scale: open ? 1.14 : 1.07 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="fnav-ring" viewBox="0 0 72 72" aria-hidden="true">
              <circle className="fnav-ring-track" cx="36" cy="36" r="34" />
              <motion.circle
                className="fnav-ring-bar"
                cx="36"
                cy="36"
                r="34"
                style={{ pathLength: progress }}
              />
            </svg>
            <MenuGlyph open={open} />
          </motion.button>

          {/* Nomor section aktif (scroll-aware) */}
          <AnimatePresence>
            {!open && (
              <motion.span
                key={activeNum}
                className="fnav-status"
                initial={{ opacity: 0, scale: 0.4, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                aria-hidden="true"
              >
                {activeNum}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
