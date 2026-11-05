import React, { useId } from "react";
import { useGlassElement } from "../../three/useGlassElement";
import { useAppStore } from "../../store/useAppStore";
import { getGlassThemeStyles } from "../../three/glassThemeStyles";

interface Props {
  children: React.ReactNode;
  className?: string;
  tier?: "hero" | "standard";
}

export const GlassPanel: React.FC<Props> = ({
  children,
  className = "",
  tier = "standard",
}) => {
  const id = useId();
  const theme = useAppStore((s) => s.theme);
  const t = getGlassThemeStyles(theme);

  const { ref } = useGlassElement(id, {
    shape: "card",
    tier,
    depth: 0.4,
    color: t.meshColor,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative ${className}`}
      style={{
        backgroundColor: "transparent",
        ...t.text,
        boxShadow: t.boxShadow,
      }}
    >
      {children}
    </div>
  );
};
