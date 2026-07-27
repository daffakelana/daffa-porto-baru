import Link from "next/link";
import { listCollections } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await listCollections();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="headline-2 text-[var(--text-color-default)]">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)]"
        >
          + Collection baru
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--divider-color)] bg-[var(--background-color-white)]">
        {collections.length === 0 && (
          <p className="body-1 px-4 py-6 text-[var(--text-color-tertiary)]">
            Belum ada collection.
          </p>
        )}
        {collections.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
            style={i > 0 ? { borderTop: "1px solid var(--divider-color)" } : undefined}
          >
            <div className="flex min-w-0 flex-col">
              <Link
                href={`/admin/collections/${c.id}`}
                className="body-1 truncate text-[var(--text-color-default)] hover:underline"
              >
                {c.name} {c.is_default && "· default"}
              </Link>
              <span className="label-3 text-[var(--text-color-tertiary)]">
                /{c.slug} · {c.project_count} project · {c.status}
              </span>
            </div>
            <Link
              href={c.is_default ? "/" : `/${c.slug}`}
              target="_blank"
              className="label-3 text-[var(--text-color-secondary)] hover:text-[var(--text-color-default)]"
            >
              Lihat ↗
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}