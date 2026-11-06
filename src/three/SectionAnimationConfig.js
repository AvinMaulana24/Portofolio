/**
 * SectionAnimationConfig.js
 * ---------------------------------------------------------------
 * Satu-satunya tempat untuk mengatur "koreografi" objek 3D.
 *
 * Satuan pose:
 *  x, y   : koordinat layar ternormalisasi (-1 kiri/bawah ... +1 kanan/atas)
 *  z      : kedalaman (positif = mendekati kamera), dalam satuan ukuran objek
 *  rx,ry,rz : rotasi (radian) -> pose dasar section
 *  scale  : pengali ukuran dasar (otomatis menyesuaikan ukuran viewport)
 *  light  : pengali intensitas cahaya
 *  spin   : kecepatan putar inti (rad/detik)
 *  float  : amplitudo gerak mengambang
 *  orbit  : 0..1, kemunculan elemen satelit (Skills)
 *  camX/camY/camZ : offset kamera (efek depth / dolly)
 *
 * Tiap section punya:
 *  pose  : posisi "tenang" ketika section aktif
 *  drift : gerakan tambahan di dalam section (envelope sin -> selalu kembali
 *          ke pose di tepi section, jadi tidak ada lompatan)
 *  in    : karakter transisi MENUJU section ini (ease + lengkungan lintasan)
 */

export const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "journey",
  "contact",
];

export const POSE_KEYS = [
  "x",
  "y",
  "z",
  "rx",
  "ry",
  "rz",
  "scale",
  "light",
  "spin",
  "float",
  "orbit",
  "camX",
  "camY",
  "camZ",
];

export const BASE_CAM_Z = 7;

/**
 * z-index kanvas 3D.
 *  15 -> objek tampil DI ATAS panel konten (pointer-events dimatikan).
 *   5 -> objek berada DI BELAKANG panel (hanya terlihat di celah/area transparan).
 */
export const CANVAS_Z_INDEX = 15;

/** Jendela transisi: dari "top 90%" sampai "top 25%" milik section tujuan. */
export const TRANSITION_WINDOW = { start: 0.9, end: 0.25 };

const ZERO = Object.fromEntries(POSE_KEYS.map((k) => [k, 0]));
const pose = (o) => ({ ...ZERO, scale: 1, light: 1, ...o });

/* ------------------------------ DESKTOP ------------------------------ */
const DESKTOP = [
  {
    id: "home", // Floating introduction
    pose: pose({
      x: 0.52,
      y: 0.02,
      rx: 0.28,
      ry: -0.5,
      rz: 0.04,
      scale: 1,
      light: 1,
      spin: 0.14,
      float: 0.12,
    }),
    drift: { y: 0.05, ry: 0.15 },
    in: null,
  },
  {
    id: "about", // Cinematic rotation: diagonal, lebih tenang, rotasi lebih terlihat
    pose: pose({
      x: -0.76,
      y: -0.1,
      z: 0.5,
      rx: -0.15,
      ry: 0.95,
      rz: -0.08,
      scale: 0.78,
      light: 1.05,
      spin: 0.42,
      float: 0.06,
      camX: 0.15,
      camZ: -0.4,
    }),
    drift: { ry: 0.5, y: 0.04 },
    in: { ease: "power2.inOut", arc: { x: 0, y: 0.28 } },
  },
  {
    id: "skills", // Orbital motion: pusat sistem teknologi
    pose: pose({
      x: 0.66,
      y: 0.1,
      z: -0.8,
      rx: 0.45,
      ry: 1.5,
      rz: 0.15,
      scale: 0.78,
      light: 1.1,
      spin: 0.7,
      float: 0.1,
      orbit: 1,
      camX: -0.2,
      camZ: 0.6,
    }),
    drift: { x: -0.06, y: 0.08, ry: 0.4 },
    in: { ease: "expo.inOut", arc: { x: 0, y: -0.2 } },
  },
  {
    id: "projects", // Cinematic transformation: sisi layar, rotasi dramatis
    pose: pose({
      x: -0.8,
      y: -0.2,
      z: 0.3,
      rx: -0.4,
      ry: 2.2,
      rz: -0.2,
      scale: 0.7,
      light: 1.15,
      spin: 0.55,
      float: 0.08,
      orbit: 0.25,
      camX: 0.3,
      camZ: -0.2,
    }),
    drift: { y: -0.12, rz: 0.1 },
    in: { ease: "power3.inOut", arc: { x: 0, y: 0.3 } },
  },
  {
    id: "journey", // Spatial movement: melengkung mengikuti timeline
    pose: pose({
      x: 0.78,
      y: 0,
      z: -0.2,
      rx: 0.1,
      ry: 2.9,
      rz: 0.35,
      scale: 0.62,
      light: 1.1,
      spin: 0.3,
      float: 0.1,
      orbit: 0.1,
      camX: -0.3,
      camZ: 0.2,
    }),
    drift: { x: -0.12, y: 0.35, rz: 0.4 },
    in: { ease: "sine.inOut", arc: { x: -0.2, y: -0.25 } },
  },
  {
    id: "contact", // Final cinematic scene: focal point, cahaya naik, rotasi melambat
    pose: pose({
      x: 0.5,
      y: 0,
      z: 0.4,
      rx: 0.15,
      ry: 3.4,
      rz: 0,
      scale: 1.15,
      light: 1.5,
      spin: 0.1,
      float: 0.08,
      orbit: 0.35,
      camZ: -0.5,
    }),
    drift: { ry: 0.2 },
    in: { ease: "power3.out", arc: { x: 0.2, y: 0.2 } },
  },
];

/* ------------------------------ helpers ------------------------------ */
const scaleObj = (o, f) =>
  o ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v * f])) : o;

function derive(src, opt = {}) {
  const {
    x = 1,
    scale = 1,
    rot = 1,
    spin = 1,
    orbit = 1,
    cam = 1,
    drift = 1,
    override = {},
  } = opt;
  return src.map((s) => ({
    ...s,
    pose: {
      ...s.pose,
      x: s.pose.x * x,
      scale: s.pose.scale * scale,
      rx: s.pose.rx * rot,
      ry: s.pose.ry * rot,
      rz: s.pose.rz * rot,
      spin: s.pose.spin * spin,
      orbit: s.pose.orbit * orbit,
      camX: s.pose.camX * cam,
      camY: s.pose.camY * cam,
      camZ: s.pose.camZ * cam,
      ...(override[s.id] || {}),
    },
    drift: scaleObj(s.drift, drift),
    in: s.in ? { ...s.in, arc: scaleObj(s.in.arc, x) } : s.in,
  }));
}

/* ------------------------------ TABLET ------------------------------- */
// Rotasi dikurangi, objek sedikit lebih kecil, satelit lebih sedikit.
const TABLET = derive(DESKTOP, {
  x: 0.85,
  scale: 0.85,
  rot: 0.6,
  spin: 0.7,
  orbit: 0.6,
  cam: 0.5,
  drift: 0.6,
});

/* ------------------------------ MOBILE ------------------------------- */
// Identitas objek tetap, tetapi kecil dan menepi di bagian atas layar
// (navbar berada di bawah) agar tidak menutupi konten. Parallax dikurangi.
const MOBILE = derive(DESKTOP, {
  x: 0.5,
  scale: 1,
  rot: 0.5,
  spin: 0.6,
  orbit: 0.5,
  cam: 0,
  drift: 0.3,
  override: {
    home: { x: 0.55, y: 0.74, z: 0, scale: 0.95 },
    about: { x: -0.55, y: 0.76, z: 0, scale: 0.85 },
    skills: { x: 0.55, y: 0.76, z: 0, scale: 0.85 },
    projects: { x: -0.55, y: 0.76, z: 0, scale: 0.8 },
    journey: { x: 0.55, y: 0.76, z: 0, scale: 0.8 },
    contact: { x: 0, y: 0.5, z: 0, scale: 1.25 },
  },
});

const CONFIGS = { desktop: DESKTOP, tablet: TABLET, mobile: MOBILE };

export const getConfig = (tier) => CONFIGS[tier] || DESKTOP;

export function createJourneyState(cfg) {
  const p = { ...cfg[0].pose };
  return {
    pose: { ...p }, // nilai yang sudah di-damp (dipakai render)
    target: { ...p }, // nilai hasil sampling scroll
    lambda: 5, // kekencangan damping
    kick: { p: 0, dir: 1 }, // sapuan saat berpindah proyek
    pointer: { x: 0, y: 0, tx: 0, ty: 0, on: false },
  };
}
