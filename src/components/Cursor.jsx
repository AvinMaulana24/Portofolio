import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Cursor.css";

const LINK = "a, button, [role='button'], summary, label, select, .tile, .th";
const TEXT =
  "textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio'])";

export default function Cursor() {
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    // Hanya untuk perangkat dengan mouse
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    document.documentElement.classList.add("has-xcur");

    const dotX = gsap.quickTo(dot.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const dotY = gsap.quickTo(dot.current, "y", {
      duration: 0.1,
      ease: "power3",
    });
    const ringX = gsap.quickTo(ring.current, "x", {
      duration: reduce ? 0.1 : 0.55,
      ease: "power3",
    });
    const ringY = gsap.quickTo(ring.current, "y", {
      duration: reduce ? 0.1 : 0.55,
      ease: "power3",
    });

    let first = true;
    const setState = (s) => {
      if (el.dataset.state !== s) el.dataset.state = s;
    };

    const onMove = (e) => {
      if (first) {
        // Posisikan langsung di awal agar tidak "terbang" dari pojok layar
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        first = false;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      el.dataset.visible = "true";
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(TEXT)) setState("text");
      else if (t.closest(LINK)) setState("link");
      else setState("default");
    };

    const onDown = () => (el.dataset.down = "true");
    const onUp = () => (el.dataset.down = "false");
    const onLeave = () => (el.dataset.visible = "false");
    const onEnter = () => (el.dataset.visible = first ? "false" : "true");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-xcur");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={root}
      className="xcur"
      data-state="default"
      data-visible="false"
      data-down="false"
      aria-hidden="true"
    >
      <div ref={ring} className="xcur-ring">
        <span className="xcur-ring-in" />
      </div>
      <div ref={dot} className="xcur-dot">
        <span className="xcur-dot-in" />
      </div>
    </div>
  );
}
