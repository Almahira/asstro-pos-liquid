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

    let last = { x: 0, y: 0, w: 0, h: 0 };

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      if (
        Math.abs(r.left - last.x) < 0.5 &&
        Math.abs(r.top - last.y) < 0.5 &&
        Math.abs(r.width - last.w) < 0.5 &&
        Math.abs(r.height - last.h) < 0.5
      ) {
        return;
      }

      last = { x: r.left, y: r.top, w: r.width, h: r.height };

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
      });
    };

    // ⭐ Throttle: scroll/resize listener set flag; ukur di rAF berikutnya
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

    // RAF loop 700ms — mengikuti animasi Framer Motion
    let rafId: number | null = null;
    const start = performance.now();
    const loop = (t: number) => {
      measure();
      if (t - start < 700) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(measureThrottled);
    ro.observe(el);
    window.addEventListener("resize", measureThrottled);
    window.addEventListener("scroll", measureThrottled, {
      capture: true,
      passive: true,
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", measureThrottled);
      window.removeEventListener("scroll", measureThrottled, true);
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
