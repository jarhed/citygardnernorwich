"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

export default function GalleryLightbox({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const open = useCallback((i: number) => {
    setIndex(i);
    setSliderPct(50);
  }, []);

  const close = useCallback(() => setIndex(null), []);

  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % projects.length));
    setSliderPct(50);
  }, [projects.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + projects.length) % projects.length));
    setSliderPct(50);
  }, [projects.length]);

  useEffect(() => {
    document.body.style.overflow = index !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, close, next, prev]);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }

  function onPointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }
  function onPointerUp() {
    draggingRef.current = false;
  }

  const current = index !== null ? projects[index] : null;

  return (
    <>
      <div className="gallery-grid">
        {projects.length === 0 ? (
          <div className="gallery-empty">
            <p>No projects yet. Check back soon for before-and-after photos.</p>
          </div>
        ) : (
          projects.map((p, i) => (
            <button
              type="button"
              key={p.slug}
              className="gallery-item"
              style={{ backgroundImage: `url(${p.before ?? p.after ?? ""})` }}
              aria-label={`Open ${p.title}`}
              onClick={() => open(i)}
            >
              <div className="gallery-overlay">
                <h4 className="gallery-item-title">{p.title}</h4>
              </div>
            </button>
          ))
        )}
      </div>

      <div
        className={`gallery-lightbox ${index !== null ? "active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current ? (
          <div className="lightbox-content">
            <div className="lightbox-caption">{current.title}</div>
            <button type="button" className="lightbox-close" aria-label="Close" onClick={close}>
              &times;
            </button>

            <div
              className="img-comp-container"
              ref={containerRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="img-comp-after">
                {current.after ? (
                  <img src={current.after} alt={`${current.title} after`} />
                ) : null}
                <span className="img-comp-label">AFTER</span>
              </div>
              <div className="img-comp-before" style={{ width: `${sliderPct}%` }}>
                {current.before ? (
                  <img
                    src={current.before}
                    alt={`${current.title} before`}
                    style={{ width: `${(100 / sliderPct) * 100}%`, maxWidth: "none" }}
                  />
                ) : null}
                <span className="img-comp-label">BEFORE</span>
              </div>
              <div className="img-comp-slider" style={{ left: `${sliderPct}%` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>

            {projects.length > 1 ? (
              <>
                <button type="button" className="lightbox-nav prev" aria-label="Previous" onClick={prev}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button type="button" className="lightbox-nav next" aria-label="Next" onClick={next}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
