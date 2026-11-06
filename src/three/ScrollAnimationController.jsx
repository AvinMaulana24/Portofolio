import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SECTION_IDS,
  POSE_KEYS,
  TRANSITION_WINDOW,
  getConfig,
} from "./SectionAnimationConfig";

gsap.registerPlugin(ScrollTrigger);

/**
 * Menerjemahkan posisi scroll -> pose target objek 3D.
 *
 * Satu ScrollTrigger global menjadi sumber kebenaran. Pose dihitung secara
 * deterministik dari scrollY (bukan banyak tween yang saling menimpa), sehingga
 * lompat antar-section lewat navbar tidak menyebabkan flicker. Penghalusan
 * dilakukan oleh CameraController (damping) di dalam loop render.
 *
 * Komponen ini tidak menyentuh DOM milik Framer Motion, jadi tidak ada konflik
 * properti animasi antara GSAP dan Framer Motion.
 */
export default function ScrollAnimationController({ journey, tier, reduced }) {
  useLayoutEffect(() => {
    const J = journey.current;
    const config = getConfig(tier);

    const list = SECTION_IDS.map((id, i) => ({
      id,
      el: document.getElementById(id),
      cfg: config[i],
    })).filter((s) => s.el);

    if (!list.length) return;

    const cfgs = list.map((s) => s.cfg);
    const anchors = { trans: [], dwell: [] };
    J.lambda = reduced ? 30 : 5;

    const compute = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      list.forEach(({ el, cfg }, i) => {
        const r = el.getBoundingClientRect();
        const top = r.top + sy;
        const from = top - vh * TRANSITION_WINDOW.start;
        const to = Math.max(from + 1, top - vh * TRANSITION_WINDOW.end);
        anchors.trans[i] = {
          from,
          to,
          ease: gsap.parseEase(cfg.in?.ease || "none"),
        };
        const dFrom = top - vh * TRANSITION_WINDOW.end;
        anchors.dwell[i] = {
          from: dFrom,
          to: Math.max(
            dFrom + 1,
            top + r.height - vh * TRANSITION_WINDOW.start,
          ),
        };
      });
    };

    const sample = (y, out) => {
      const n = cfgs.length;
      let seg = -1;
      let p = 0;
      let k = 0;
      for (let i = 1; i < n; i++) {
        const a = anchors.trans[i];
        if (y >= a.to) {
          k = i;
          continue;
        }
        if (y > a.from) {
          seg = i;
          p = (y - a.from) / (a.to - a.from);
        }
        break;
      }

      if (seg > 0) {
        const A = cfgs[seg - 1].pose;
        const B = cfgs[seg].pose;
        const e = anchors.trans[seg].ease(p);
        for (const key of POSE_KEYS) out[key] = A[key] + (B[key] - A[key]) * e;
        const arc = cfgs[seg].in?.arc;
        if (arc) {
          const w = Math.sin(Math.PI * p);
          out.x += (arc.x || 0) * w;
          out.y += (arc.y || 0) * w;
          out.z += (arc.z || 0) * w;
        }
      } else {
        const B = cfgs[k].pose;
        for (const key of POSE_KEYS) out[key] = B[key];
      }

      // gerakan tambahan di dalam section (nol di tepi -> tanpa lompatan)
      for (let i = 0; i < n; i++) {
        const d = cfgs[i].drift;
        const a = anchors.dwell[i];
        if (!d || !a) continue;
        const dp = (y - a.from) / (a.to - a.from);
        if (dp <= 0 || dp >= 1) continue;
        const w = Math.sin(Math.PI * dp);
        for (const key in d) out[key] += d[key] * w;
      }
    };

    const update = () => sample(window.scrollY, J.target);

    compute();
    update();
    Object.assign(J.pose, J.target); // mulai dari pose yang benar, tanpa terbang masuk

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: () => {
        compute();
        update();
      },
    });

    return () => st.kill();
  }, [journey, tier, reduced]);

  return null;
}
