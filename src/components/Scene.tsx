import React from "react";
import ImageBackground from "./ImageBackground";
import { GlassMirror } from "../three/GlassMirror";

const Scene: React.FC = () => (
  <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[5, 5, 5]} intensity={2} />
    <ImageBackground />
    <GlassMirror />
  </>
);

export default Scene;
