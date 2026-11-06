import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import FloatingObject from "./FloatingObject";
import CameraController from "./CameraController";
import ScrollAnimationController from "./ScrollAnimationController";
import {
  BASE_CAM_Z,
  CANVAS_Z_INDEX,
  createJourneyState,
  getConfig,
} from "./SectionAnimationConfig";

const DPR = { desktop: [1, 1.25], tablet: [1, 1.25], mobile: [1, 1] };
const MOBILE_FPS = 30;

const tierOf = () =>
  window.innerWidth < 768
    ? "mobile"
    : window.innerWidth < 1100
      ? "tablet"
      : "desktop";

function useTier() {
  const [tier, setTier] = useState(tierOf);
  useEffect(() => {
    const on = () => setTier(tierOf());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return tier;
}

function useReducedMotion() {
  const [r, setR] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    // lepas konteks uji agar tidak menghabiskan jatah konteks WebGL di HP
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Di HP, render dibatasi ~30 fps: frameloop="demand" + pemicu berkala.
 * WAJIB dipasang di dalam <Canvas> saat frameloop="demand".
 */
function Throttle({ fps = MOBILE_FPS }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let last = 0;
    let raf;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (t - last >= 1000 / fps) {
        last = t;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, fps]);
  return null;
}

/** Intensitas cahaya mengikuti pose.light (naik halus menuju Contact). */
function Lights({ journey, tier }) {
  const amb = useRef();
  const key = useRef();
  const rim = useRef();
  useFrame(() => {
    const L = journey.current.pose.light;
    if (amb.current) amb.current.intensity = 0.35 * L;
    if (key.current) key.current.intensity = 2.0 * L;
    if (rim.current) rim.current.intensity = 40 * L;
  });
  return (
    <>
      <ambientLight ref={amb} color="#DCD7FF" />
      <directionalLight ref={key} position={[4, 5, 6]} />
      {/* lampu titik dilewati di HP/tablet untuk meringankan GPU */}
      {tier === "desktop" && (
        <pointLight ref={rim} position={[-5, -2, 4]} color="#A49BEE" />
      )}
    </>
  );
}

/** Environment prosedural (tanpa unduh HDR): softbox lavender. */
function Studio({ tier, low }) {
  const look = (self) => self.lookAt(0, 0, 0);
  const resolution =
    tier === "mobile" ? 64 : low || tier === "tablet" ? 128 : 256;
  return (
    <Environment resolution={resolution} frames={1} environmentIntensity={0.9}>
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#DCD7FF"
        position={[-4, 3, 4]}
        scale={[6, 3, 1]}
        onUpdate={look}
      />
      <Lightformer
        form="ring"
        intensity={1.6}
        color="#8880D6"
        position={[4, -2, 2]}
        scale={4}
        onUpdate={look}
      />
      <Lightformer
        form="rect"
        intensity={1.2}
        color="#A49BEE"
        position={[0, 5, -4]}
        scale={[8, 2, 1]}
        onUpdate={look}
      />
      <Lightformer
        form="rect"
        intensity={0.8}
        color="#39326D"
        position={[0, -5, 3]}
        scale={[8, 2, 1]}
        onUpdate={look}
      />
    </Environment>
  );
}

export default function Scene3D() {
  const tier = useTier();
  const reduced = useReducedMotion();
  const [low, setLow] = useState(false);
  const [active, setActive] = useState(true);
  const [webgl] = useState(hasWebGL);
  const journey = useRef(null);
  if (!journey.current) journey.current = createJourneyState(getConfig(tier));

  // jeda render ketika tab tidak aktif
  useEffect(() => {
    const on = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.scene3d;
    },
    [],
  );

  if (!webgl) return null; // fallback: ilustrasi SVG lama tetap tampil

  const mobile = tier === "mobile";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        // tinggi layar terbesar: kanvas tidak di-resize saat bilah alamat HP naik/turun
        height: "100lvh",
        zIndex: CANVAS_Z_INDEX,
        pointerEvents: "none",
      }}
    >
      <ScrollAnimationController
        journey={journey}
        tier={tier}
        reduced={reduced}
      />
      <Canvas
        frameloop={!active ? "never" : mobile ? "demand" : "always"}
        dpr={low ? 1 : DPR[tier]}
        camera={{ fov: 40, near: 0.1, far: 50, position: [0, 0, BASE_CAM_Z] }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          document.documentElement.dataset.scene3d = "on";
        }}
      >
        {mobile && active && <Throttle fps={MOBILE_FPS} />}
        <PerformanceMonitor onDecline={() => setLow(true)} />
        <Studio tier={tier} low={low} />
        <Lights journey={journey} tier={tier} />
        <CameraController journey={journey} />
        <FloatingObject journey={journey} tier={tier} reduced={reduced} />
      </Canvas>
    </div>
  );
}
