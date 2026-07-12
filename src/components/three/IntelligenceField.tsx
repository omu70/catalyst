"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ============================================================================
   <IntelligenceField /> — the "ledger atmosphere" WebGL layer.

   Art direction (Molten Obsidian): NOT a starfield. A sparse drift of warm
   dust motes and signal glints suspended in the light beams — the atmosphere
   of a machine shop at night. Low density, warm palette, large soft sprites.

   Performance contract:
   - ONE draw call (a single THREE.Points mesh — no per-node objects)
   - DPR hard-capped at 1.75 (retina crispness without 4K fill-rate cost)
   - No allocations inside useFrame (all vectors are hoisted refs)
   - Additive blending + soft sprite = glow without post-processing passes
   ========================================================================== */

/** Tuning constants — the entire scene is parameterized here. */
const FIELD = {
  /** Sparse by design — density is what made the old version read "space". */
  NODE_COUNT: 520,
  /** Radius of the mote field in world units. */
  RADIUS: 10,
  /** Vertical squash — a wide, low atmosphere rather than a sphere. */
  Y_FLATTEN: 0.6,
  /** Base autonomous rotation, radians/second. Barely perceptible. */
  ROTATION_SPEED: 0.012,
  /** How far pointer parallax can tilt the field, in radians. */
  PARALLAX_TILT: 0.09,
  /** Lerp factor for parallax easing (per-frame smoothing). */
  PARALLAX_EASE: 0.03,
  NODE_SIZE: 0.16,
  /** Fraction of motes that are emerald signals vs neutral dust. */
  ACCENT_RATIO: 0.16,
  /** Fraction of motes that are champagne glints. */
  DATA_RATIO: 0.22,
} as const;

const COLOR_DUST_DIM = new THREE.Color("#c9cdc0"); // paper dust — barely there
const COLOR_DUST = new THREE.Color("#a9b0a0"); // cool dust
const COLOR_DATA = new THREE.Color("#b18a3f"); // bronze glint
const COLOR_ACCENT = new THREE.Color("#0e9f6e"); // emerald signal

/**
 * Deterministic PRNG (mulberry32). Seeded so the atmosphere renders
 * identically on every visit — a fixed composition, not random noise.
 */
function createPrng(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft radial sprite generated once at runtime — avoids shipping a texture. */
function createGlowSprite(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Builds mote positions (wide, low atmosphere) + per-mote colors, once. */
function buildFieldGeometry(): {
  positions: Float32Array;
  colors: Float32Array;
} {
  const prng = createPrng(4217);
  const positions = new Float32Array(FIELD.NODE_COUNT * 3);
  const colors = new Float32Array(FIELD.NODE_COUNT * 3);
  const tint = new THREE.Color();

  for (let i = 0; i < FIELD.NODE_COUNT; i++) {
    // Near-uniform volume distribution — atmosphere, not a shell/structure.
    const radius = FIELD.RADIUS * Math.pow(prng(), 0.42);
    const theta = prng() * Math.PI * 2;
    const phi = Math.acos(2 * prng() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * FIELD.Y_FLATTEN;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    // Palette: mostly dim warm dust, a scattering of champagne glints,
    // and rare emerald signals that carry the brand accent.
    const roll = prng();
    if (roll < FIELD.ACCENT_RATIO) {
      tint.copy(COLOR_ACCENT);
    } else if (roll < FIELD.ACCENT_RATIO + FIELD.DATA_RATIO) {
      tint.copy(COLOR_DATA);
    } else {
      tint.lerpColors(COLOR_DUST_DIM, COLOR_DUST, prng());
    }
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  return { positions, colors };
}

/** The drifting mote field. Lives inside the Canvas. */
function FieldPoints(): React.JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const { positions, colors } = useMemo(() => buildFieldGeometry(), []);
  const sprite = useMemo(() => createGlowSprite(), []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Barely-perceptible drift — alive, never busy.
    group.rotation.y += FIELD.ROTATION_SPEED * delta;

    // Pointer parallax — eased toward target so motion feels weighty.
    const targetX = pointer.y * FIELD.PARALLAX_TILT;
    const targetZ = -pointer.x * FIELD.PARALLAX_TILT;
    group.rotation.x += (targetX - group.rotation.x) * FIELD.PARALLAX_EASE;
    group.rotation.z += (targetZ - group.rotation.z) * FIELD.PARALLAX_EASE;
  });

  return (
    <group ref={groupRef} rotation={[0.18, 0, -0.06]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={sprite}
          size={FIELD.NODE_SIZE}
          vertexColors
          transparent
          // Light theme: NORMAL blending — additive light is invisible on
          // paper. Motes read as suspended pigment instead of glow.
          opacity={0.5}
          depthWrite={false}
          blending={THREE.NormalBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/**
 * Public canvas wrapper. Rendered client-only (dynamically imported by
 * BackgroundLayer with ssr:false) so Three.js never enters the server bundle.
 */
export default function IntelligenceField(): React.JSX.Element {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 11], fov: 55 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <FieldPoints />
    </Canvas>
  );
}
