import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BASE_CAM_Z, POSE_KEYS } from "./SectionAnimationConfig";

/**
 * Berjalan paling awal di setiap frame (priority -2):
 *  1. meredam (damp) pose menuju target hasil scroll -> gerakan selalu kontinu
 *  2. menggerakkan kamera (pan + dolly) untuk efek depth antar-section
 */
export default function CameraController({ journey }) {
  useFrame((state, delta) => {
    const J = journey.current;
    if (!J) return;
    const dt = Math.min(delta, 0.05);

    for (const k of POSE_KEYS) {
      J.pose[k] = THREE.MathUtils.damp(J.pose[k], J.target[k], J.lambda, dt);
    }

    const { camX, camY, camZ } = J.pose;
    const cam = state.camera;
    cam.position.set(camX, camY, BASE_CAM_Z + camZ);
    cam.lookAt(camX * 0.5, camY * 0.5, 0);
  }, -2);

  return null;
}
