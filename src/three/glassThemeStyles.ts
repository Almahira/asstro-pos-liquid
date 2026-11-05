import type { CSSProperties } from "react";

export interface GlassThemeStyle {
  text: CSSProperties;
  boxShadow: string;
  meshColor: string;
  placeholderClass: string;
  accentColor: string;
}

export function getGlassThemeStyles(theme: "light" | "dark"): GlassThemeStyle {
  if (theme === "light") {
    return {
      text: {
        color: "#0a0f1a",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
      },
      boxShadow: [
        "inset 0 1px 0 rgba(255, 255, 255, 0.75)",
        "inset 0 -1px 0 rgba(0, 0, 0, 0.12)",
        "0 6px 22px rgba(0, 0, 0, 0.22)",
      ].join(", "),
      meshColor: "#f0f0f2",
      placeholderClass: "placeholder:text-black/40",
      accentColor: "#b45309", // amber-700
    };
  }

  return {
    text: {
      color: "#f8fafc",
      textShadow:
        "0 0 14px rgba(255, 255, 255, 0.55), 0 1px 2px rgba(0, 0, 0, 0.7)",
    },
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      "inset 0 -1px 0 rgba(0, 0, 0, 0.25)",
      "0 0 24px rgba(255, 255, 255, 0.18)",
    ].join(", "),
    meshColor: "#ffffff",
    placeholderClass: "placeholder:text-white/40",
    accentColor: "#fcd34d", // amber-300
  };
}
