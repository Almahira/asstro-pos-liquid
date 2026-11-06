import { create } from "zustand";
import type { GlassShape } from "./LiquidGlass";
import type { GlassTier } from "./useGlassTier";

export interface GlassRect {
  x: number;
  y: number;
  w: number;
  h: number;
  shape: GlassShape;
  hovered: boolean;
  pressed: boolean;
  tier?: GlassTier;
  depth?: number;
  color?: string;
  radius?: number;
  isContent?: boolean;
}

interface GlassRegistryStore {
  rects: Record<string, GlassRect>;
  register: (id: string, rect: GlassRect) => void;
  unregister: (id: string) => void;
  update: (id: string, patch: Partial<GlassRect>) => void;
}

export const useGlassRegistry = create<GlassRegistryStore>((set) => ({
  rects: {},
  register: (id, rect) => set((s) => ({ rects: { ...s.rects, [id]: rect } })),
  unregister: (id) =>
    set((s) => {
      const next = { ...s.rects };
      delete next[id];
      return { rects: next };
    }),
  update: (id, patch) =>
    set((s) => {
      const existing = s.rects[id];
      if (!existing) return s;
      return { rects: { ...s.rects, [id]: { ...existing, ...patch } } };
    }),
}));
