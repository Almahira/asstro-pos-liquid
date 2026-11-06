import React, { useId } from "react";
import { useGlassElement } from "../../three/useGlassElement";
import { useAppStore } from "../../store/useAppStore";
import { getGlassThemeStyles } from "../../three/glassThemeStyles";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  tier?: "hero" | "standard";
}

export const GlassInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  tier,
}) => {
  const id = useId();
  const theme = useAppStore((s) => s.theme);
  const t = getGlassThemeStyles(theme);

  const { ref, setHovered, setPressed } = useGlassElement(id, {
    shape: "capsule",
    tier: tier ?? "standard",
    depth: 0.35,
    color: t.meshColor,
  });

  return (
    <input
      ref={ref as React.RefObject<HTMLInputElement>}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={`relative w-full rounded-full px-5 py-4 outline-none text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:bg-white/10 dark:focus:bg-black/20 ${t.placeholderClass}`}
      style={{
        backgroundColor: "transparent",
        border: "none",
        ...t.text,
        boxShadow: t.boxShadow,
        caretColor: t.text.color,
      }}
    />
  );
};
