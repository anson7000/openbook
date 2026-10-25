import { useEffect, useState } from "react";
import Page from "./Page";

// Zoom currently implemented in Canvas
// Ctrl + or Ctrl Mouse Wheel Up to zoom in
// Ctrl - or Ctrl Mouse Wheel Down to zoom out
// Prevents browser from using these controls (prevent zooming the whole page)
const PAGE_WIDTH = 1123;
const PAGE_HEIGHT = 794;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export default function Canvas() {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const updateZoom = (delta: number) => {
      setZoom((currentZoom) =>
        Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom + delta)),
      );
    };

    const handleZoomShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;

      const isZoomIn =
        event.key === "+" ||
        event.code === "Equal" ||
        event.code === "NumpadAdd";
      const isZoomOut =
        event.key === "-" ||
        event.code === "Minus" ||
        event.code === "NumpadSubtract";
      const isReset = event.key === "0" || event.code === "Numpad0";

      if (!isZoomIn && !isZoomOut && !isReset) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (isReset) {
        setZoom(1);
      } else {
        updateZoom(isZoomIn ? ZOOM_STEP : -ZOOM_STEP);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (event.deltaY !== 0) {
        updateZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
      }
    };

    window.addEventListener("keydown", handleZoomShortcut, true);
    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    return () => {
      window.removeEventListener("keydown", handleZoomShortcut, true);
      window.removeEventListener("wheel", handleWheel, true);
    };
  }, []);

  return (
    <main className="flex h-full min-w-0 flex-1 overflow-auto p-6">
      <div
        className="relative m-auto shrink-0"
        style={{
          width: PAGE_WIDTH * zoom,
          height: PAGE_HEIGHT * zoom,
        }}
      >
        <div
          className="canvas-zoom absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          <Page width={PAGE_WIDTH} height={PAGE_HEIGHT} />
        </div>
      </div>
    </main>
  );
}
