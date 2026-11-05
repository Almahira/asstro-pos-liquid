import React, { useId } from "react";
import { useGlassElement } from "../../three/useGlassElement";
import { useAppStore } from "../../store/useAppStore";
import { getGlassThemeStyles } from "../../three/glassThemeStyles";

interface Props {
  type?: "button" | "submit";
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  tier?: "hero" | "standard";
  className?: string;
}

export const GlassButton: React.FC<Props> = ({
  type = "button",
  onClick,
  children,
  variant = "primary",
  tier,
  className = "",
}) => {
  const id = useId();
  const theme = useAppStore((s) => s.theme);
  const t = getGlassThemeStyles(theme);

  const { ref, setHovered, setPressed } = useGlassElement(id, {
    shape: "capsule",
    tier: tier ?? (variant === "primary" ? "hero" : "standard"),
    depth: 0.4,
    color: t.meshColor,
  });

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={`relative w-full rounded-2xl px-5 py-4 font-bold text-base outline-none flex items-center justify-center gap-2 select-none transition-shadow ${className}`}
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
