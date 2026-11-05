import React, { useId } from "react";
import { Search } from "lucide-react";
import { useGlassElement } from "../../three/useGlassElement";
import { useAppStore } from "../../store/useAppStore";
import { getGlassThemeStyles } from "../../three/glassThemeStyles";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export const GlassSearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Cari…",
  className = "",
}) => {
  const id = useId();
  const theme = useAppStore((s) => s.theme);
  const t = getGlassThemeStyles(theme);

  const { ref, setHovered, setPressed } = useGlassElement(id, {
    shape: "capsule",
    tier: "standard",
    depth: 0.3,
    color: t.meshColor,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full ${className}`}
      style={{
        backgroundColor: "transparent",
        ...t.text,
        boxShadow: t.boxShadow,
      }}
    >
      <Search size={18} style={{ opacity: 0.75, flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setPressed(true)}
        onBlur={() => setPressed(false)}
        className={`bg-transparent outline-none w-full text-sm font-medium ${t.placeholderClass}`}
        style={{
          color: t.text.color,
          caretColor: t.text.color,
        }}
      />
    </div>
  );
};
