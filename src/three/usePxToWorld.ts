import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

/**
 * Konversi ukuran pixel (ala CSS) ke world unit 3D.
 * `viewport.width / size.width` = berapa world unit per 1 pixel CSS.
 */
export function usePxToWorld() {
  const { viewport, size } = useThree();

  return useMemo(() => {
    const scale = viewport.width / size.width;

    return {
      scale,
      /** 1 dimensi px → world */
      px: (v: number) => v * scale,
      /** 2 dimensi px → world tuple */
      px2: (w: number, h: number): [number, number] => [w * scale, h * scale],

      /**
       * Posisi CENTER elemen (px) → world coords.
       * (xPx, yPx) adalah pixel dari kiri-atas viewport, mengacu ke TITIK TENGAH elemen.
       */
      screenToWorld: (
        xPx: number,
        yPx: number,
        z = 0,
      ): [number, number, number] => [
        (xPx / size.width - 0.5) * viewport.width,
        -(yPx / size.height - 0.5) * viewport.height,
        z,
      ],

      /**
       * ⭐ NEW — Posisi TOP-LEFT elemen + ukuran (px) → world coords.
       * Lebih intuitif, mirip CSS `left`/`top`/`width`/`height`.
       *
       * Contoh: elemen 180×56 di kiri-atas dengan margin 20px:
       *   placeAt(20, 20, 180, 56)  →  [x, y, z]
       */
      placeAt: (
        xPx: number,
        yPx: number,
        wPx: number,
        hPx: number,
        z = 0,
      ): [number, number, number] => [
        ((xPx + wPx / 2) / size.width - 0.5) * viewport.width,
        -((yPx + hPx / 2) / size.height - 0.5) * viewport.height,
        z,
      ],
    };
  }, [viewport.width, viewport.height, size.width, size.height]);
}
