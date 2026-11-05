import React from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
import type { GlassTier } from "./useGlassTier";

export interface GlassMaterialProps {
  tier: GlassTier;
  color?: string;
  thickness?: number;
  ior?: number;
  roughness?: number;
}

/**
 * Material dipilih per-tier:
 * - hero     → MeshTransmissionMaterial (render pass tambahan, "wow" refraction)
 * - standard → meshPhysicalMaterial native Three (transmission built-in, jauh lebih murah)
 *
 * ref di-passing via forwardRef supaya LiquidGlass bisa animate property.
 */
export const GlassMaterial = React.forwardRef<any, GlassMaterialProps>(
  function GlassMaterial(
    { tier, color = "#ffffff", thickness = 1.2, ior = 1.45, roughness = 0.04 },
    ref,
  ) {
    if (tier === "hero") {
      return (
        <MeshTransmissionMaterial
          ref={ref}
          transmission={1}
          thickness={thickness}
          roughness={roughness}
          ior={ior}
          chromaticAberration={0.08}
          anisotropy={0.2}
          distortion={0}
          distortionScale={0.5}
          temporalDistortion={0.05}
          color={color}
        />
      );
    }

    // standard tier
    return (
      <meshPhysicalMaterial
        ref={ref}
        transmission={1}
        thickness={thickness}
        roughness={roughness}
        ior={ior}
        color={color}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0}
        emissive={color}
        emissiveIntensity={0}
      />
    );
  },
);
