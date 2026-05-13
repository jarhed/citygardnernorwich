"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/lib/projects";

type Props = { adminKey: string };

type Status = { message: string; tone: "info" | "error" | "success" } | null;

export default function AdminUploader({ adminKey }: Props) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setStatus({ message: "Loading…", tone: "info" });
    const res = await fetch(`/api/projects?key=${encodeURIComponent(adminKey)}`, { cache: "no-store" });
    if (!res.ok) {
      setStatus({ message: "Failed to load projects.", tone: "error" });
      return;
    }
    const data = (await res.json()) as { projects: Project[] };
    setProjects(data.projects || []);
    setStatus(null);
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  function setProject(slug: string, patch: Partial<Project>) {
    setProjects((prev) => (prev ? prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)) : prev));
  }

  async function save(next?: Project[]) {
    setBusy(true);
    const body = JSON.stringify({ projects: next ?? projects ?? [] });
    const res = await fetch(`/api/projects?key=${encodeURIComponent(adminKey)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body,
    });
    setBusy(false);
    if (!res.ok) {
      setStatus({ message: "Save failed.", tone: "error" });
      return false;
    }
    setStatus({ message: "Saved.", tone: "success" });
    return true;
  }

  async function uploadImage(slug: string, which: "before" | "after", file: File) {
    setBusy(true);
    setStatus({ message: `Uploading ${which}…`, tone: "info" });
    const params = new URLSearchParams({ key: adminKey, project: slug, which, filename: file.name });
    const res = await fetch(`/api/upload?${params}`, {
      method: "POST",
      headers: { "content-type": file.type },
      body: file,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus({ message: err.error || "Upload failed.", tone: "error" });
      setBusy(false);
      return;
    }
    const { url } = (await res.json()) as { url: string };
    const current = projects ?? [];
    const existing = current.find((p) => p.slug === slug);
    const oldUrl = existing ? existing[which] : null;
    const updated = current.map((p) => (p.slug === slug ? { ...p, [which]: url } : p));
    setProjects(updated);
    await save(updated);
    if (oldUrl) {
      void fetch(`/api/projects?key=${encodeURIComponent(adminKey)}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: oldUrl }),
      });
    }
    setBusy(false);
  }

  async function addProject() {
    const title = window.prompt("Project title (e.g. NR3 1NZ)");
    if (!title) return;
    const slug = slugifyClient(title);
    const current = projects ?? [];
    if (current.some((p) => p.slug === slug)) {
      setStatus({ message: "A project with that slug already exists.", tone: "error" });
      return;
    }
    const next = [...current, { slug, title: title.trim(), before: null, after: null }];
    setProjects(next);
    await save(next);
  }

  async function removeProject(slug: string) {
    if (!window.confirm("Delete this project and its images?")) return;
    const current = projects ?? [];
    const target = current.find((p) => p.slug === slug);
    const next = current.filter((p) => p.slug !== slug);
    setProjects(next);
    await save(next);
    if (target?.before) {
      void fetch(`/api/projects?key=${encodeURIComponent(adminKey)}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: target.before }),
      });
    }
    if (target?.after) {
      void fetch(`/api/projects?key=${encodeURIComponent(adminKey)}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: target.after }),
      });
    }
  }

  async function renameProject(slug: string) {
    const current = projects ?? [];
    const target = current.find((p) => p.slug === slug);
    if (!target) return;
    const title = window.prompt("New title", target.title);
    if (!title || title === target.title) return;
    const next = current.map((p) => (p.slug === slug ? { ...p, title } : p));
    setProjects(next);
    await save(next);
  }

  if (projects === null) {
    return <p className="admin-status">{status?.message ?? "Loading…"}</p>;
  }

  return (
    <div>
      {projects.length === 0 ? (
        <p style={{ color: "white", marginBottom: 20 }}>No projects yet. Add one to get started.</p>
      ) : null}

      {projects.map((p) => (
        <div key={p.slug} className="admin-project">
          <div className="admin-project-row">
            <strong style={{ color: "var(--secondary-color)", flex: 1, minWidth: 200, fontSize: "1.1rem" }}>
              {p.title}
            </strong>
            <button type="button" className="admin-btn" onClick={() => renameProject(p.slug)} disabled={busy}>
              RENAME
            </button>
            <button
              type="button"
              className="admin-btn danger"
              onClick={() => removeProject(p.slug)}
              disabled={busy}
            >
              DELETE
            </button>
          </div>
          <div className="admin-slots">
            <ImageSlot
              label="BEFORE"
              url={p.before}
              busy={busy}
              onFile={(file) => uploadImage(p.slug, "before", file)}
            />
            <ImageSlot
              label="AFTER"
              url={p.after}
              busy={busy}
              onFile={(file) => uploadImage(p.slug, "after", file)}
            />
          </div>
        </div>
      ))}

      <div className="admin-actions">
        <button type="button" className="admin-btn" onClick={addProject} disabled={busy}>
          + ADD PROJECT
        </button>
      </div>

      {status ? (
        <p
          className="admin-status"
          style={{
            color: status.tone === "error" ? "#ff8080" : status.tone === "success" ? "#c4d600" : "white",
          }}
        >
          {status.message}
        </p>
      ) : (
        <p className="admin-status" />
      )}
    </div>
  );
}

function ImageSlot({
  label,
  url,
  busy,
  onFile,
}: {
  label: string;
  url: string | null;
  busy: boolean;
  onFile: (file: File) => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      className={`admin-slot${url ? " has-image" : ""}${drag ? " dragover" : ""}`}
      style={url ? { backgroundImage: `url(${url})` } : undefined}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
    >
      <span className="admin-slot-label">
        {label}
        <br />
        {url ? "Drag a new image to replace" : "Drag image here or click"}
      </span>
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function slugifyClient(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "project"
  );
}
