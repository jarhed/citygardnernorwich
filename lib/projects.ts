import { head, put } from "@vercel/blob";

export type Project = {
  slug: string;
  title: string;
  before: string | null;
  after: string | null;
};

export type ProjectsDoc = {
  projects: Project[];
  updatedAt: string;
};

const INDEX_PATH = "projects/index.json";

const EMPTY: ProjectsDoc = { projects: [], updatedAt: new Date(0).toISOString() };

export async function readProjects(): Promise<ProjectsDoc> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;
  try {
    const meta = await head(INDEX_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return EMPTY;
    return (await res.json()) as ProjectsDoc;
  } catch {
    return EMPTY;
  }
}

export async function writeProjects(doc: ProjectsDoc): Promise<void> {
  const body = JSON.stringify({ ...doc, updatedAt: new Date().toISOString() });
  await put(INDEX_PATH, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "project";
}

