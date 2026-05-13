import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { slugify } from "@/lib/projects";

export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function authorized(req: Request): boolean {
  const key = new URL(req.url).searchParams.get("key");
  const expected = process.env.ADMIN_KEY;
  return Boolean(expected && key && key === expected);
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const projectSlug = slugify(url.searchParams.get("project") || "project");
  const which = url.searchParams.get("which") === "after" ? "after" : "before";
  const filenameHint = url.searchParams.get("filename") || "image";

  const contentType = req.headers.get("content-type") || "application/octet-stream";
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ error: "unsupported file type" }, { status: 415 });
  }

  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.byteLength === 0) {
    return NextResponse.json({ error: "empty body" }, { status: 400 });
  }
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "file too large (max 10MB)" }, { status: 413 });
  }

  const ext = extFromFilename(filenameHint) || extFromMime(contentType);
  const pathname = `projects/${projectSlug}/${which}.${ext}`;

  const result = await put(pathname, buf, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: result.url, pathname: result.pathname });
}

function extFromFilename(name: string): string | null {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name);
  return m ? m[1].toLowerCase() : null;
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}
