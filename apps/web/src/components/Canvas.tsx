import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useLiveQuery } from "dexie-react-hooks";
import Page from "./Page";
import { db } from "../lib/db";
import { useEditorStore } from "../store/useEditorStore";

// Zoom currently implemented in Canvas
// Ctrl + or Ctrl Mouse Wheel Up to zoom in
// Ctrl - or Ctrl Mouse Wheel Down to zoom out
// Prevents browser from using these controls (prevent zooming the whole page)
const PAGE_SIZES = {
  portrait: { width: 794, height: 1123 },
  landscape: { width: 1123, height: 794 },
} as const;

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export default function Canvas() {
  const [zoom, setZoom] = useState(1);
  const {
    selectedCheatsheetId,
    selectedPageId,
    setSelectedPageId,
    setSelectedTileId,
    setSelectedEditor,
  } = useEditorStore();

  // Every page is mounted so that printing (Ctrl+P) can output all of them,
  // but only the selected page is rendered on screen.
  const pages = useLiveQuery(
    () =>
      selectedCheatsheetId
        ? db.pages
            .where("cheatsheetId")
            .equals(selectedCheatsheetId)
            .sortBy("order")
        : [],
    [selectedCheatsheetId],
  );

  // The selected tile is drawn with a blue border and ring; drop the selection
  // before the print snapshot is taken, then put it back once the print dialog
  // closes so the tile keeps matching the editor that still has focus.
  // flushSync keeps these updates in the DOM the browser paginates.
  useEffect(() => {
    let tileToRestore: string | null = null;
    let clearedForPrint = false;

    const handleBeforePrint = () => {
      const { selectedTileId } = useEditorStore.getState();
      if (!clearedForPrint) tileToRestore = selectedTileId;
      clearedForPrint = true;

      flushSync(() => {
        setSelectedTileId(null);
        setSelectedEditor(null);
      });
    };

    const handleAfterPrint = () => {
      if (!clearedForPrint) return;

      const tileId = tileToRestore;
      tileToRestore = null;
      clearedForPrint = false;

      flushSync(() => {
        setSelectedTileId(tileId);
      });
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [setSelectedTileId, setSelectedEditor]);

  useEffect(() => {
    if (!pages?.length) return;
    if (selectedPageId && pages.some((page) => page.id === selectedPageId)) {
      return;
    }
    setSelectedPageId(pages[0].id);
  }, [pages, selectedPageId, setSelectedPageId]);

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
    <main className="print-canvas flex h-full min-w-0 flex-1 flex-col overflow-auto p-6">
      {pages?.map((page) => {
        const pageSize = PAGE_SIZES[page.orientation ?? "portrait"];

        return (
          <div
            key={page.id}
            className={`print-stage relative m-auto shrink-0 ${
              page.id === selectedPageId ? "" : "hidden"
            }`}
            style={{
              width: pageSize.width * zoom,
              height: pageSize.height * zoom,
            }}
          >
            <div
              className="canvas-zoom absolute left-0 top-0 origin-top-left"
              style={{ transform: `scale(${zoom})` }}
            >
              <Page
                page={page}
                width={pageSize.width}
                height={pageSize.height}
              />
            </div>
          </div>
        );
      })}
    </main>
  );
}
