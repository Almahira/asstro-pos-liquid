import React, { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGlassTier, type GlassTier } from "./useGlassTier";
import { GlassMaterial } from "./glassMaterial";

export type GlassShape = "card" | "button" | "capsule" | "circle" | "blob";

export interface LiquidGlassProps {
  shape?: GlassShape;
  /** Lebar dalam world units — gunakan usePxToWorld().px(pxCss) */
  width: number;
  /** Tinggi dalam world units */
  height: number;
  depth?: number;
  /** Radius sudut. Auto per-shape kalau tidak diisi. */
  radius?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  thickness?: number;
  ior?: number;
  /** Paksa tier tertentu (default: auto-detect via useGlassTier) */
  tier?: GlassTier;
  /** State hover eksternal dari DOM overlay */
  hovered?: boolean;
  /** State pressed eksternal dari DOM overlay */
  pressed?: boolean;
  children?: React.ReactNode;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  shape = "card",
  width,
  height,
  depth = 0.35,
  radius,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "#ffffff",
  thickness = 1.2,
  ior = 1.45,
  tier: tierProp,
  hovered = false,
  pressed = false,
  children,
}) => {
  const autoTier = useGlassTier();
  const tier = tierProp ?? autoTier;

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // Animasi reaktif — press-in scale + distortion/emissive per tier
  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const m = materialRef.current;

    // Semua tier: pressed → scale.z mengecil (efek "ambles")
    const targetScaleZ = pressed ? 0.88 : 1;
    meshRef.current.scale.z = THREE.MathUtils.lerp(
      meshRef.current.scale.z,
      targetScaleZ,
      Math.min(delta * 8, 1),
    );

    // hero: animate distortion
    if ("distortion" in m && typeof m.distortion === "number") {
      const targetD = pressed ? 0.5 : hovered ? 0.2 : 0;
      m.distortion = THREE.MathUtils.lerp(
        m.distortion,
        targetD,
        Math.min(delta * 5, 1),
      );
    }

    // standard (meshPhysicalMaterial): animate emissive
    if ("emissiveIntensity" in m && typeof m.emissiveIntensity === "number") {
      const targetE = pressed ? 0.35 : hovered ? 0.15 : 0;
      m.emissiveIntensity = THREE.MathUtils.lerp(
        m.emissiveIntensity,
        targetE,
        Math.min(delta * 5, 1),
      );
    }
  });

  // Geometry blob (organik) — hanya untuk shape "blob"
  const blobGeometry = useMemo(() => {
    if (shape !== "blob") return null;
    const s = new THREE.Shape();
    const pts = 64;
    const baseR = Math.min(width, height) / 2;
    const wobble = 0.12;
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const r = baseR * (1 + Math.sin(a * 3 + 0.5) * wobble);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    return new THREE.ExtrudeGeometry(s, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 8,
      curveSegments: 24,
    });
  }, [shape, width, height, depth]);

  // Radius otomatis per shape
  const autoRadius =
    radius ??
    (shape === "button" || shape === "capsule" || shape === "circle"
      ? Math.min(width, height) / 2
      : 0.12);

  const safeRadius = Math.min(autoRadius, width / 2, height / 2);

  return (
    <group position={position} rotation={rotation}>
      {shape === "blob" && blobGeometry ? (
        <mesh ref={meshRef} geometry={blobGeometry}>
          <GlassMaterial
            ref={materialRef}
            tier={tier}
            color={color}
            thickness={thickness}
            ior={ior}
          />
        </mesh>
      ) : (
        <RoundedBox
          ref={meshRef as any}
          args={[width, height, depth]}
          radius={safeRadius}
          smoothness={12}
        >
          <GlassMaterial
            ref={materialRef}
            tier={tier}
            color={color}
            thickness={thickness}
            ior={ior}
          />
        </RoundedBox>
      )}
      {children}
    </group>
  );
};
