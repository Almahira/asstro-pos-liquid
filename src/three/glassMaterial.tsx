import React from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import type { GlassTier } from "./useGlassTier";

export interface GlassMaterialProps {
  tier: GlassTier;
  color?: string;
  thickness?: number;
  ior?: number;
  roughness?: number;
  clippingPlanes?: THREE.Plane[]; // <-- TAMBAHKAN INI
}

export const GlassMaterial = React.forwardRef<any, GlassMaterialProps>(
  function GlassMaterial(
    {
      tier,
      color = "#ffffff",
      thickness = 1.2,
      ior = 1.45,
      roughness = 0.04,
      clippingPlanes,
    },
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
          clippingPlanes={clippingPlanes}
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
        clippingPlanes={clippingPlanes}
      />
    );
  },
);
