import React, { useState } from "react";
import { LiquidGlass } from "./LiquidGlass";
import { usePxToWorld } from "./usePxToWorld";

const GlassDemo: React.FC = () => {
  const { px, placeAt } = usePxToWorld();
  const [hoverBtn, setHoverBtn] = useState(false);
  const [pressBtn, setPressBtn] = useState(false);
  const [hoverHero, setHoverHero] = useState(false);

  // Layout constants (dalam px CSS)
  const M = 24; // margin dari kiri layar
  const BTN_W = 180;
  const BTN_H = 56;
  const CARD_W = 300;
  const CARD_H = 140;
  const GAP = 20;

  return (
    <>
      {/* ⬇️ 1. Tombol standard (auto tier) */}
      <LiquidGlass
        shape="button"
        width={px(BTN_W)}
        height={px(BTN_H)}
        depth={0.4}
        position={placeAt(M, M, BTN_W, BTN_H, 0.5)}
        hovered={hoverBtn}
        pressed={pressBtn}
      >
        {/* invisible hit-area untuk test hover/click */}
        <mesh
          position={[0, 0, 0.25]}
          onPointerOver={() => setHoverBtn(true)}
          onPointerOut={() => {
            setHoverBtn(false);
            setPressBtn(false);
          }}
          onPointerDown={() => setPressBtn(true)}
          onPointerUp={() => setPressBtn(false)}
        >
          <planeGeometry args={[px(BTN_W), px(BTN_H)]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </LiquidGlass>

      {/* ⬇️ 2. Card standard (auto tier) */}
      <LiquidGlass
        shape="card"
        width={px(CARD_W)}
        height={px(CARD_H)}
        depth={0.5}
        radius={0.18}
        position={placeAt(M, M + BTN_H + GAP, CARD_W, CARD_H, 0)}
      />

      {/* ⬇️ 3. Card HERO (paksa tier hero untuk perbandingan) */}
      <LiquidGlass
        shape="card"
        tier="hero"
        width={px(CARD_W)}
        height={px(CARD_H)}
        depth={0.5}
        radius={0.18}
        position={placeAt(M, M + BTN_H + GAP + CARD_H + GAP, CARD_W, CARD_H, 0)}
        hovered={hoverHero}
      >
        <mesh
          position={[0, 0, 0.3]}
          onPointerOver={() => setHoverHero(true)}
          onPointerOut={() => setHoverHero(false)}
        >
          <planeGeometry args={[px(CARD_W), px(CARD_H)]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </LiquidGlass>
    </>
  );
};

export default GlassDemo;
