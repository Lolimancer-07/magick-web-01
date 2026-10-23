"use client";

/**
 * useLayoutMode — determines the current layout container using CSS matchMedia.
 *
 * wide   ≥ 1024 px   (three-pane desktop)
 * medium  768-1023 px (canvas + drawer overlays)
 * compact < 768 px OR landscape height < 500 px  (phone / small tablet)
 *
 * Uses container queries / matchMedia — never user-agent sniffing.
 * Keeps the appStore in sync so any component can read `state.layoutMode`.
 */

import { useEffect, useCallback } from "react";
import { useAppStore, type LayoutMode } from "@/store/appStore";

function computeMode(): LayoutMode {
  if (typeof window === "undefined") return "wide";
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Landscape phones (short height, narrower width)
  if (h < 500 && w < 1024) return "compact";
  if (w >= 1024) return "wide";
  if (w >= 768) return "medium";
  return "compact";
}

export function useLayoutMode(): LayoutMode {
  const setLayoutMode = useAppStore((s) => s.setLayoutMode);
  const layoutMode = useAppStore((s) => s.layoutMode);

  const update = useCallback(() => {
    setLayoutMode(computeMode());
  }, [setLayoutMode]);

  useEffect(() => {
    // Initial sync
    update();

    // Use ResizeObserver on documentElement for accuracy
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(document.documentElement);
    } else {
      window.addEventListener("resize", update, { passive: true });
    }

    // Also watch visualViewport so keyboard doesn't fool us
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [update]);

  return layoutMode;
}
