import { useEffect, useRef } from "react";
import { useGlassRegistry } from "./glassRegistry";
import type { GlassShape } from "./LiquidGlass";
import type { GlassTier } from "./useGlassTier";

export interface UseGlassElementOptions {
  shape: GlassShape;
  tier?: GlassTier;
  depth?: number;
  color?: string;
  radius?: number;
}

export function useGlassElement(id: string, opts: UseGlassElementOptions) {
  const ref = useRef<HTMLElement>(null);
  const register = useGlassRegistry((s) => s.register);
  const unregister = useGlassRegistry((s) => s.unregister);
  const update = useGlassRegistry((s) => s.update);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1. TAGGING: Beri ID unik agar bisa dilacak langsung oleh WebGL
    el.id = `glass-dom-${id}`;

    // DETEKSI OTOMATIS: Apakah elemen ini anak dari tag <main>?
    const isContentNode = el.closest("main") !== null;

    let last = { w: 0, h: 0 };
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      if (
        Math.abs(r.width - last.w) < 0.5 &&
        Math.abs(r.height - last.h) < 0.5
      ) {
        return;
      }

      last = { w: r.width, h: r.height };
      register(id, {
        x: r.left,
        y: r.top,
        w: r.width,
        h: r.height,
        shape: opts.shape,
        hovered: false,
        pressed: false,
        tier: opts.tier,
        depth: opts.depth,
        color: opts.color,
        radius: opts.radius,
        isContent: isContentNode,
      });
    };

    let scheduled = false;
    const measureThrottled = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        measure();
      });
    };

    measure();
    const ro = new ResizeObserver(measureThrottled);
    ro.observe(el);
    window.addEventListener("resize", measureThrottled);

    // CATATAN: Loop manual RAF dan event listener 'scroll' dihapus total!

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureThrottled);
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    update(id, {
      shape: opts.shape,
      tier: opts.tier,
      depth: opts.depth,
      color: opts.color,
      radius: opts.radius,
    });
  }, [id, opts.shape, opts.tier, opts.depth, opts.color, opts.radius, update]);

  return {
    ref: ref as React.RefObject<
      HTMLElement & HTMLInputElement & HTMLButtonElement
    >,
    setHovered: (hovered: boolean) => update(id, { hovered }),
    setPressed: (pressed: boolean) => update(id, { pressed }),
  };
}
