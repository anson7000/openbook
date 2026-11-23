import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { db } from "./db";
import { type Cheatsheet, type Image, type Page } from "./types";

type ExportManifest = {
  format: "openbook";
  version: 1;
  exportedAt: string;
  files: {
    cheatsheets: string;
    pages: string;
    images: string;
  };
};

type ArchiveRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ArchiveRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isId = (value: unknown) =>
  typeof value === "string" || typeof value === "number";

const isBspNode = (value: unknown): boolean => {
  if (!isRecord(value) || !isId(value.id)) {
    return false;
  }

  if (value.type === "leaf") {
    return typeof value.name === "string" && isRecord(value.value);
  }

  return (
    value.type === "split" &&
    (value.axis === "x" || value.axis === "y") &&
    typeof value.ratio === "number" &&
    isBspNode(value.first) &&
    isBspNode(value.second)
  );
};

const isCheatsheet = (value: unknown): value is Cheatsheet =>
  isRecord(value) && isId(value.id) && typeof value.name === "string";

const isPage = (value: unknown): value is Page =>
  isRecord(value) &&
  isId(value.id) &&
  typeof value.name === "string" &&
  typeof value.order === "number" &&
  isBspNode(value.bspTree) &&
  isId(value.cheatsheetId) &&
  (value.orientation === undefined ||
    value.orientation === "portrait" ||
    value.orientation === "landscape");

const imageMimeTypes: Record<string, string> = {
  bin: "application/octet-stream",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const parseJson = (archive: Record<string, Uint8Array>, path: string) => {
  const entry = archive[path];
  if (!entry) throw new Error(`Missing archive entry: ${path}`);

  try {
    return JSON.parse(strFromU8(entry)) as unknown;
  } catch {
    throw new Error(`Invalid JSON in archive entry: ${path}`);
  }
};

const getImageExtension = (mimeType: string) => {
  const extension = mimeType.split("/")[1]?.split(";")[0];
  return extension || "bin";
};

const getExportName = () => {
  const date = new Date().toISOString().slice(0, 10);
  return `openbook-${date}.openbook`;
};

export async function exportSaveFile() {
  const [cheatsheets, pages, images] = await Promise.all([
    db.cheatsheets.toArray(),
    db.pages.toArray(),
    db.images.toArray(),
  ]);

  const imageEntries = await Promise.all(
    images.map(async (image: Image) => {
      const imagePath = `images/${image.id}.${getImageExtension(image.mimeType)}`;
      const imageBytes = new Uint8Array(await image.blob.arrayBuffer());
      return [imagePath, imageBytes] as const;
    }),
  );

  const manifest: ExportManifest = {
    format: "openbook",
    version: 1,
    exportedAt: new Date().toISOString(),
    files: {
      cheatsheets: "cheatsheets.json",
      pages: "pages.json",
      images: "images/*",
    },
  };

  const archive = zipSync({
    "manifest.json": strToU8(JSON.stringify(manifest, null, 2)),
    "cheatsheets.json": strToU8(
      JSON.stringify(cheatsheets satisfies Cheatsheet[], null, 2),
    ),
    "pages.json": strToU8(JSON.stringify(pages satisfies Page[], null, 2)),
    ...Object.fromEntries(imageEntries),
  });

  const downloadUrl = URL.createObjectURL(
    new Blob([archive], { type: "application/vnd.openbook+zip" }),
  );
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = getExportName();
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
}

export async function importSaveFile(file: File) {
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const manifestValue = parseJson(archive, "manifest.json");

  if (
    !isRecord(manifestValue) ||
    manifestValue.format !== "openbook" ||
    manifestValue.version !== 1 ||
    !isRecord(manifestValue.files) ||
    typeof manifestValue.files.cheatsheets !== "string" ||
    typeof manifestValue.files.pages !== "string"
  ) {
    throw new Error("Unsupported or invalid OpenBook save file");
  }

  const cheatsheetsValue = parseJson(archive, manifestValue.files.cheatsheets);
  const pagesValue = parseJson(archive, manifestValue.files.pages);

  if (
    !Array.isArray(cheatsheetsValue) ||
    !cheatsheetsValue.every(isCheatsheet) ||
    !Array.isArray(pagesValue) ||
    !pagesValue.every(isPage)
  ) {
    throw new Error("Invalid records in OpenBook save file");
  }

  const cheatsheetIds = new Set<string | number>();
  for (const cheatsheet of cheatsheetsValue) {
    if (cheatsheetIds.has(cheatsheet.id)) {
      throw new Error("OpenBook save file contains duplicate IDs");
    }
    cheatsheetIds.add(cheatsheet.id);
  }

  const pageIds = new Set<string | number>();
  for (const page of pagesValue) {
    if (!cheatsheetIds.has(page.cheatsheetId) || pageIds.has(page.id)) {
      throw new Error("OpenBook save file contains invalid or duplicate IDs");
    }
    pageIds.add(page.id);
  }

  const images: Image[] = [];
  const imageIds = new Set<string>();
  for (const [path, bytes] of Object.entries(archive)) {
    const match = /^images\/([^/]+)\.([a-z0-9]+)$/i.exec(path);
    if (!match) continue;

    const [, id, extension] = match;
    const mimeType = imageMimeTypes[extension.toLowerCase()];
    if (!mimeType || imageIds.has(id)) {
      throw new Error(`Invalid image entry: ${path}`);
    }

    imageIds.add(id);
    images.push({
      id,
      blob: new Blob([bytes], { type: mimeType }),
      mimeType,
    });
  }

  await db.transaction("rw", db.cheatsheets, db.pages, db.images, async () => {
    await db.cheatsheets.clear();
    await db.pages.clear();
    await db.images.clear();
    await db.cheatsheets.bulkAdd(cheatsheetsValue as Cheatsheet[]);
    await db.pages.bulkAdd(pagesValue as Page[]);
    await db.images.bulkAdd(images);
  });
}
