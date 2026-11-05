import { useEffect, useState } from "react";

export type GlassTier = "hero" | "standard";

const STORAGE_KEY = "asstro:glass-tier";

/**
 * Heuristik konservatif untuk menentukan tier material kaca.
 * - iPhone kelas menengah (cores ≤ 4 atau dpr > 2.5) → standard
 * - Desktop / device kuat → hero
 * Bisa di-override via localStorage key `asstro:glass-tier`.
 */
function detectTier(): GlassTier {
  if (typeof window === "undefined") return "standard";

  const override = window.localStorage.getItem(STORAGE_KEY);
  if (override === "hero" || override === "standard") return override;

  const cores = navigator.hardwareConcurrency ?? 4;
  const dpr = window.devicePixelRatio ?? 1;

  if (cores <= 4 || dpr > 2.5) return "standard";
  return "hero";
}

export function useGlassTier(): GlassTier {
  // default "standard" saat SSR/hydration untuk cegah flash
  const [tier, setTier] = useState<GlassTier>("standard");

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return tier;
}

export function setGlassTierOverride(tier: GlassTier | null) {
  if (typeof window === "undefined") return;
  if (tier) window.localStorage.setItem(STORAGE_KEY, tier);
  else window.localStorage.removeItem(STORAGE_KEY);
}
