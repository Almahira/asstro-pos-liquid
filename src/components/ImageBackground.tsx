import React, { Suspense, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Image, useTexture } from "@react-three/drei";
import { useAppStore } from "../store/useAppStore";

import landsacapeLight from "../assets/landsacape light.webp";
import landscapeDark from "../assets/landscape dark.webp";
import potraitDark from "../assets/potrait dark.webp";
import potraitLight from "../assets/potrait light.webp";

const BACKGROUND_Z = -10;

const ImageBackgroundContent: React.FC = () => {
  const theme = useAppStore((s) => s.theme);
  const { viewport, camera } = useThree();

  const isLandscape = viewport.width > viewport.height;
  const imageSource = isLandscape
    ? theme === "dark"
      ? landscapeDark
      : landsacapeLight
    : theme === "dark"
      ? potraitDark
      : potraitLight;

  const texture = useTexture(imageSource);

  // ✅ FIX: di types Three.js terbaru, texture.image bertipe `unknown`.
  //    Cast ke bentuk yang kita butuhkan.
  const img = texture.image as { width: number; height: number };
  const imgAspect = img.width / img.height;

  // Kompensasi kedalaman (viewport R3F diukur di z = 0)
  const distToZ0 = Math.abs(camera.position.z);
  const depthFactor = (distToZ0 + Math.abs(BACKGROUND_Z)) / distToZ0;
  const bgWidth = viewport.width * depthFactor;
  const bgHeight = viewport.height * depthFactor;

  // Cover
  const scale = useMemo<[number, number]>(() => {
    const bgAspect = bgWidth / bgHeight;
    if (imgAspect > bgAspect) {
      return [bgHeight * imgAspect, bgHeight];
    }
    return [bgWidth, bgWidth / imgAspect];
  }, [imgAspect, bgWidth, bgHeight]);

  return (
    <group position={[0, 0, BACKGROUND_Z]}>
      <Image url={imageSource} scale={scale} transparent={false} />
    </group>
  );
};

const ImageBackground: React.FC = () => (
  <Suspense fallback={null}>
    <ImageBackgroundContent />
  </Suspense>
);

export default ImageBackground;
