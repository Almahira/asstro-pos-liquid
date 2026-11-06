import React, { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGlassTier, type GlassTier } from "./useGlassTier";
import { GlassMaterial } from "./glassMaterial";
import { usePxToWorld } from "./usePxToWorld";

export type GlassShape = "card" | "button" | "capsule" | "circle" | "blob";

export interface LiquidGlassProps {
  glassId?: string;
  isContent?: boolean;
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
  glassId,
  isContent,
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
  const { placeAt, screenToWorld } = usePxToWorld();
  const { size } = useThree(); // <-- Ambil ukuran layar 3D
  const groupRef = useRef<THREE.Group>(null);
  const autoTier = useGlassTier();
  const tier = tierProp ?? autoTier;
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // LOGIKA PISAU PEMOTONG (CLIPPING)
  const clippingPlanes = useMemo(() => {
    if (!isContent) return undefined;

    // Ambil batas ruang dari tag <main> secara dinamis
    const mainEl = document.querySelector("main");
    if (!mainEl) return undefined;

    const rect = mainEl.getBoundingClientRect();

    // Potong 3D Glass persis di garis atas dan bawah elemen <main>
    const [, topY] = screenToWorld(0, rect.top);
    const [, bottomY] = screenToWorld(0, rect.bottom);

    return [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), topY), // Pembatas Header
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -bottomY), // Pembatas Footer
    ];
  }, [isContent, screenToWorld, size.height]);

  // Animasi reaktif — press-in scale + distortion/emissive per tier
  useFrame((_, delta) => {
    if (glassId && groupRef.current) {
      const el = document.getElementById(`glass-dom-${glassId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Translasi posisi layar HP langsung ke koordinat dunia 3D
        const [x, y, z] = placeAt(
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          position[2] ?? 0,
        );
        groupRef.current.position.set(x, y, z);
      }
    }

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
    <group ref={groupRef} position={position} rotation={rotation}>
      {shape === "blob" && blobGeometry ? (
        <mesh ref={meshRef} geometry={blobGeometry}>
          <GlassMaterial
            ref={materialRef}
            tier={tier}
            color={color}
            thickness={thickness}
            ior={ior}
            clippingPlanes={clippingPlanes}
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
            clippingPlanes={clippingPlanes}
          />
        </RoundedBox>
      )}
      {children}
    </group>
  );
};
