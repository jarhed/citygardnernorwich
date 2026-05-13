import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { readProjects, writeProjects, type Project } from "@/lib/projects";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const key = new URL(req.url).searchParams.get("key");
  const expected = process.env.ADMIN_KEY;
  return Boolean(expected && key && key === expected);
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const doc = await readProjects();
  return NextResponse.json(doc);
}

export async function PUT(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { projects: Project[] };
  if (!Array.isArray(body.projects)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  await writeProjects({ projects: body.projects, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { url } = (await req.json()) as { url: string };
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }
  try {
    await del(url);
  } catch {
    // Ignore — the blob may already be gone.
  }
  return NextResponse.json({ ok: true });
}
