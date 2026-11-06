import React, { useId } from "react";
import { useGlassElement } from "../../three/useGlassElement";
import { useAppStore } from "../../store/useAppStore";
import { getGlassThemeStyles } from "../../three/glassThemeStyles";

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  size?: number;
  ariaLabel?: string;
  tier?: "hero" | "standard";
  badge?: number;
}

export const GlassIconButton: React.FC<Props> = ({
  onClick,
  children,
  size = 44,
  ariaLabel,
  tier,
  badge,
}) => {
  const id = useId();
  const theme = useAppStore((s) => s.theme);
  const t = getGlassThemeStyles(theme);

  const { ref, setHovered, setPressed } = useGlassElement(id, {
    shape: "circle",
    tier: tier ?? "standard",
    depth: 0.35,
    color: t.meshColor,
  });

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className="relative flex items-center justify-center select-none outline-none transition-shadow rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: "transparent",
        border: "none",
        ...t.text,
        boxShadow: t.boxShadow,
      }}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-lg pointer-events-none"
          style={{ textShadow: "none", color: "#fff" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
