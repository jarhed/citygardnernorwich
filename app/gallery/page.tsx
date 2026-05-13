import GalleryLightbox from "@/components/GalleryLightbox";
import { readProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gallery — The City Gardener" };

export default async function GalleryPage() {
  const { projects } = await readProjects();
  const renderable = projects.filter((p) => p.before || p.after);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>I leaf it better than I found it</h1>
            <div className="leaf-divider">
              <img src="/images/leaf_outline_green.svg" alt="" />
            </div>
            <GalleryLightbox projects={renderable} />
          </div>
        </div>
      </div>
    </section>
  );
}
