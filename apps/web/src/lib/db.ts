import { Dexie, type EntityTable } from "dexie";
import { type Cheatsheet, type Image, type Page } from "./types";

const db = new Dexie("OpenBookDatabase") as Dexie & {
  cheatsheets: EntityTable<Cheatsheet, "id">;
  pages: EntityTable<Page, "id">;
  images: EntityTable<Image, "id">;
};

db.version(1).stores({
  cheatsheets: "++id, name",
  pages: "++id, name, bspTreeId, cheatsheetId",
  images: "id, blob, mimeType",
});

db.on("populate", () => {
  db.cheatsheets.add({ name: "Default Cheatsheet" });
});

export { db };
