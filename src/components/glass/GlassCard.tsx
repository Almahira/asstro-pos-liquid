import React, { useId } from "react";
import { useGlassElement } from "../../three/useGlassElement";
import { useAppStore } from "../../store/useAppStore";
import { getGlassThemeStyles } from "../../three/glassThemeStyles";

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  tier?: "hero" | "standard";
}

export const GlassCard: React.FC<Props> = ({
  onClick,
  children,
  className = "",
  tier,
}) => {
  const id = useId();
  const theme = useAppStore((s) => s.theme);
  const t = getGlassThemeStyles(theme);

  const { ref, setHovered, setPressed } = useGlassElement(id, {
    shape: "card",
    tier: tier ?? "standard",
    depth: 0.35,
    color: t.meshColor,
  });

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={`relative flex flex-col items-center p-3 rounded-2xl transition-shadow active:scale-95 select-none outline-none ${className}`}
      style={{
        backgroundColor: "transparent",
        border: "none",
        ...t.text,
        boxShadow: t.boxShadow,
      }}
    >
      {children}
    </button>
  );
};
