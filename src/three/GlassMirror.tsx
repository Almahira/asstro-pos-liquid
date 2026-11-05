import React from "react";
import { useGlassRegistry } from "./glassRegistry";
import { LiquidGlass } from "./LiquidGlass";
import { usePxToWorld } from "./usePxToWorld";

export const GlassMirror: React.FC = () => {
  const rects = useGlassRegistry((s) => s.rects);
  const { px, placeAt } = usePxToWorld();

  return (
    <>
      {Object.entries(rects).map(([id, rect]) => {
        if (rect.w === 0 || rect.h === 0) return null;
        return (
          <LiquidGlass
            key={id}
            shape={rect.shape}
            width={px(rect.w)}
            height={px(rect.h)}
            depth={rect.depth ?? 0.4}
            radius={rect.radius}
            tier={rect.tier}
            color={rect.color}
            hovered={rect.hovered}
            pressed={rect.pressed}
            position={placeAt(rect.x, rect.y, rect.w, rect.h, 0)}
          />
        );
      })}
    </>
  );
};
