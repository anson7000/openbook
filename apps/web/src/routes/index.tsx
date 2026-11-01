import { createFileRoute } from "@tanstack/react-router";
import Canvas from "../components/Canvas";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import { useEditorStore } from "../store/useEditorStore";
import { db } from "../lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { selectedCheatsheetId, setSelectedCheatsheetId } = useEditorStore();
  const cheatsheets = useLiveQuery(() => db.cheatsheets.toArray());

  useEffect(() => {
    const firstCheatsheetId = cheatsheets?.[0]?.id;
    if (firstCheatsheetId && firstCheatsheetId !== selectedCheatsheetId) {
      setSelectedCheatsheetId(firstCheatsheetId);
    }
  }, [cheatsheets, selectedCheatsheetId, setSelectedCheatsheetId]);

  if (!cheatsheets) return null;

  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <LeftPanel />
      <Canvas />
      <RightPanel />
    </div>
  );
}
