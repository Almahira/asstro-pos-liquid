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
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setPressed(true)}
      onBlur={() => setPressed(false)}
      className={`relative w-full rounded-2xl px-5 py-4 outline-none text-base transition-shadow ${t.placeholderClass}`}
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
