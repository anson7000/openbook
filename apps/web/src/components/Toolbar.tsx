const tools = [
  { label: "Text", active: true },
  { label: "Image", active: false },
  { label: "Formula", active: false },
];

export default function Toolbar() {
  return (
    <nav
      aria-label="Canvas tools"
      className="sticky bottom-4 flex justify-center"
    >
      <div className="flex gap-2 border rounded bg-background p-2 shadow">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            disabled={!tool.active}
            className="rounded px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            aria-pressed={tool.active}
          >
            {tool.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
