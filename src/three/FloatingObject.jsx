import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { BASE_CAM_Z } from "./SectionAnimationConfig";

const { damp, smoothstep, degToRad } = THREE.MathUtils;

// [geometri, radius orbit, inklinasi, kecepatan, fase, ukuran]
const SATS = [
  ["oct", 1.9, 0.3, 0.5, 0.0, 1.0],
  ["sph", 2.15, -0.5, -0.38, 1.1, 0.9],
  ["box", 2.4, 0.7, 0.3, 2.2, 1.1],
  ["tor", 2.05, -0.2, -0.55, 3.3, 1.0],
  ["oct", 2.5, 0.1, 0.22, 4.4, 0.8],
  ["sph", 2.3, 0.9, 0.42, 5.2, 0.75],
  ["box", 2.6, -0.8, -0.27, 0.7, 0.8],
  ["oct", 1.8, 0.55, 0.6, 2.9, 0.75],
];
const SAT_COUNT = { desktop: 8, tablet: 5, mobile: 3 };

function makeChevron() {
  // bentuk "<" (">" dibuat dengan mirror)
  const s = new THREE.Shape();
  s.moveTo(0.14, 0.32);
  s.lineTo(-0.14, 0);
  s.lineTo(0.14, -0.32);
  s.lineTo(0.24, -0.32);
  s.lineTo(-0.04, 0);
  s.lineTo(0.24, 0.32);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  g.center();
  return g;
}

/**
 * Objek utama: "developer sculpture"
 *  - inti kristal berfaset (iridescent) + cangkang translusen
 *  - tiga cincin giroskop berbahan logam satin
 *  - tanda < > yang mengorbit dan selalu menghadap kamera
 *  - satelit kecil (muncul bertahap di section Skills)
 * Geometri dan material dibuat sekali dan dipakai ulang.
 */
export default function FloatingObject({ journey, tier, reduced }) {
  const root = useRef();
  const spinner = useRef();
  const r1 = useRef();
  const r2 = useRef();
  const r3 = useRef();
  const cL = useRef();
  const cR = useRef();
  const sats = useRef([]);
  const acc = useRef(0);

  const hi = tier === "desktop";
  const count = SAT_COUNT[tier];

  const geo = useMemo(() => {
    const seg = hi ? [16, 128] : [8, 64];
    return {
      core: new THREE.IcosahedronGeometry(0.62, 1),
      shell: new THREE.IcosahedronGeometry(0.8, hi ? 2 : 1),
      r1: new THREE.TorusGeometry(1.0, 0.022, seg[0], seg[1]),
      r2: new THREE.TorusGeometry(1.22, 0.03, seg[0], seg[1]),
      r3: new THREE.TorusGeometry(1.45, 0.016, seg[0], seg[1]),
      chev: makeChevron(),
      oct: new THREE.OctahedronGeometry(0.1, 0),
      sph: new THREE.SphereGeometry(0.075, hi ? 16 : 10, hi ? 16 : 10),
      box: new THREE.BoxGeometry(0.11, 0.11, 0.11),
      tor: new THREE.TorusGeometry(0.085, 0.025, 8, 20),
    };
  }, [hi]);

  const mats = useMemo(
    () => ({
      core: new THREE.MeshPhysicalMaterial({
        color: "#8880D6",
        metalness: 0.55,
        roughness: 0.28,
        clearcoat: 0.8,
        clearcoatRoughness: 0.25,
        iridescence: 0.6,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [120, 420],
        flatShading: true,
      }),
      shell: new THREE.MeshPhysicalMaterial({
        color: "#DCD7FF",
        transparent: true,
        opacity: 0.14,
        roughness: 0.05,
        clearcoat: 1,
        depthWrite: false,
      }),
      r1: new THREE.MeshStandardMaterial({
        color: "#DCD7FF",
        metalness: 0.9,
        roughness: 0.22,
      }),
      r2: new THREE.MeshStandardMaterial({
        color: "#A49BEE",
        metalness: 0.85,
        roughness: 0.3,
      }),
      r3: new THREE.MeshStandardMaterial({
        color: "#625E91",
        metalness: 0.8,
        roughness: 0.35,
      }),
      chev: new THREE.MeshPhysicalMaterial({
        color: "#DCD7FF",
        metalness: 0.15,
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
      }),
      sat: new THREE.MeshStandardMaterial({
        color: "#A49BEE",
        metalness: 0.7,
        roughness: 0.3,
      }),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
    },
    [geo],
  );
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
    },
    [mats],
  );

  /* ----- interaksi pointer (hanya perangkat dengan mouse) ----- */
  useEffect(() => {
    const P = journey.current.pointer;
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!fine || reduced || tier === "mobile") {
      P.on = false;
      P.tx = P.ty = 0;
      return;
    }
    P.on = true;
    const move = (e) => {
      P.tx = (e.clientX / window.innerWidth) * 2 - 1;
      P.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const leave = () => {
      P.tx = 0;
      P.ty = 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", leave);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", leave);
      document.documentElement.removeEventListener("mouseleave", leave);
      P.on = false;
    };
  }, [journey, tier, reduced]);

  /* ----- sapuan saat berpindah proyek: window.dispatchEvent('scene3d:project') ----- */
  useEffect(() => {
    if (reduced) return;
    const K = journey.current.kick;
    const onProject = (e) => {
      gsap.killTweensOf(K);
      K.dir = e.detail?.dir >= 0 ? 1 : -1;
      K.p = 0;
      gsap.to(K, {
        p: 1,
        duration: 1.3,
        ease: "power3.inOut",
        onComplete: () => (K.p = 0),
      });
    };
    window.addEventListener("scene3d:project", onProject);
    return () => {
      window.removeEventListener("scene3d:project", onProject);
      gsap.killTweensOf(K);
    };
  }, [journey, reduced]);

  useFrame((state, delta) => {
    const J = journey.current;
    if (!J || !root.current) return;

    const p = J.pose;
    const P = J.pointer;
    const K = J.kick;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const live = !reduced;

    // ukuran referensi viewport pada kedalaman z = 0 (kamera dasar)
    const { width, height } = state.size;
    const refH = 2 * Math.tan(degToRad(state.camera.fov) / 2) * BASE_CAM_Z;
    const refW = refH * (width / height);
    const S = Math.min(refH * 0.15, refW * 0.1);

    // pointer (di-damp, dibatasi kecil agar tidak mengganggu animasi scroll)
    P.x = damp(P.x, live && P.on ? P.tx : 0, 3, dt);
    P.y = damp(P.y, live && P.on ? P.ty : 0, 3, dt);
    const pk = tier === "tablet" ? 0.5 : 1;

    const sweep = Math.sin(Math.PI * K.p);
    if (live) acc.current += dt * p.spin;
    const a = acc.current;

    const floatY = live ? Math.sin(t * 0.8) * p.float * S : 0;
    const floatZ = live ? Math.sin(t * 0.45) * p.float * S * 3 : 0; // mendekat/menjauh
    const wobX = live ? Math.sin(t * 0.5) * 0.08 : 0;
    const wobY = live ? Math.cos(t * 0.35) * 0.1 : 0;

    root.current.position.set(
      (p.x + K.dir * 0.22 * sweep + P.x * 0.04 * pk) * (refW / 2),
      (p.y + P.y * 0.04 * pk) * (refH / 2) + floatY,
      p.z * S * 2 + sweep * S * 1.5 + floatZ,
    );
    root.current.rotation.set(
      p.rx + wobX - P.y * 0.22 * pk,
      p.ry + wobY + P.x * 0.32 * pk + K.dir * Math.PI * 2 * K.p,
      p.rz,
    );
    root.current.scale.setScalar(S * p.scale);

    // putaran internal (kontinu; kecepatannya diatur per section)
    spinner.current.rotation.set(Math.sin(a * 0.5) * 0.2, a, 0);
    r1.current.rotation.set(1.2, 0, a * 1.1);
    r2.current.rotation.set(0.4, a * 0.8, 1.6);
    r3.current.rotation.set(-0.7, 0, -a * 0.6 + 0.5);
    // tanda < > mengorbit tetapi tetap menghadap kamera
    cL.current.rotation.y = -a;
    cR.current.rotation.y = -a;

    // satelit orbit, muncul bertahap sesuai nilai orbit
    for (let i = 0; i < count; i++) {
      const m = sats.current[i];
      if (!m) continue;
      const [, r, inc, spd, ph, size] = SATS[i];
      const ang = ph + (live ? t * spd : 0);
      m.position.set(
        Math.cos(ang) * r,
        Math.sin(ang) * r * Math.sin(inc),
        Math.sin(ang) * r * Math.cos(inc),
      );
      const from = (i / count) * 0.55;
      const vis = smoothstep(p.orbit, from, from + 0.4);
      m.visible = vis > 0.001;
      m.scale.setScalar(size * vis);
      if (live) m.rotation.x += dt * 0.8;
    }
  });

  return (
    <group ref={root}>
      <group ref={spinner}>
        <mesh
          geometry={geo.core}
          material={mats.core}
          castShadow
          receiveShadow
        />
        <mesh geometry={geo.shell} material={mats.shell} />
        <mesh
          ref={r1}
          geometry={geo.r1}
          material={mats.r1}
          castShadow
          receiveShadow
        />
        <mesh
          ref={r2}
          geometry={geo.r2}
          material={mats.r2}
          castShadow
          receiveShadow
        />
        <mesh
          ref={r3}
          geometry={geo.r3}
          material={mats.r3}
          castShadow
          receiveShadow
        />
        <group position={[-1.75, 0, 0]}>
          <mesh ref={cL} geometry={geo.chev} material={mats.chev} castShadow />
        </group>
        <group position={[1.75, 0, 0]} scale={[-1, 1, 1]}>
          <mesh ref={cR} geometry={geo.chev} material={mats.chev} castShadow />
        </group>
      </group>
      {SATS.slice(0, count).map((s, i) => (
        <mesh
          key={i}
          ref={(el) => (sats.current[i] = el)}
          geometry={geo[s[0]]}
          material={mats.sat}
          castShadow
        />
      ))}
    </group>
  );
}
