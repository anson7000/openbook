import { createFileRoute } from "@tanstack/react-router";
import Page from "../components/Page";
import Toolbar from "../components/Toolbar";
import { useEditorStore } from "../store/useEditorStore";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { pages, selectedPageId } = useEditorStore();

  return (
    <div className="relative min-h-screen bg-muted p-2 print:min-h-0 print:bg-transparent print:p-0">
      {pages.map(
        (page) =>
          page.id === selectedPageId && <Page key={page.id} page={page} />,
      )}
      <Toolbar />
    </div>
  );
}
