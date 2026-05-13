import AdminUploader from "@/components/AdminUploader";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const provided = params.key;
  const expected = process.env.ADMIN_KEY;
  const authorized = Boolean(expected && provided && provided === expected);

  return (
    <section className="admin-section">
      <div className="container">
        <h1 className="admin-title">Gallery admin</h1>

        {authorized ? (
          <>
            <p className="admin-intro">
              Drag a photo onto a BEFORE or AFTER slot to upload it. Changes are saved automatically and
              appear on the public gallery within a few seconds.
            </p>
            <AdminUploader adminKey={provided!} />
          </>
        ) : (
          <div className="admin-locked">
            <p>This page requires an access key. Append <code>?key=...</code> to the URL.</p>
          </div>
        )}
      </div>
    </section>
  );
}
