import Link from "next/link";
import { listProjects } from "@/lib/admin/projects";
import { toggleStatusAction } from "@/lib/admin/project-actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="headline-2 text-[var(--text-color-default)]">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)]"
        >
          + Project baru
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--divider-color)] bg-[var(--background-color-white)]">
        {projects.length === 0 && (
          <p className="body-1 px-4 py-6 text-[var(--text-color-tertiary)]">
            Belum ada project.
          </p>
        )}

        {projects.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
            style={i > 0 ? { borderTop: "1px solid var(--divider-color)" } : undefined}
          >
            <div className="flex min-w-0 flex-col">
              <Link
                href={`/admin/projects/${p.id}`}
                className="body-1 truncate text-[var(--text-color-default)] hover:underline"
              >
                {p.title_en}
              </Link>
              <span className="label-3 text-[var(--text-color-tertiary)]">
                /{p.slug} · {p.year ?? "—"} {p.featured ? "· ★" : ""}
              </span>
            </div>

            <form action={toggleStatusAction}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="current" value={p.status} />
              <button
                type="submit"
                className="rounded-md border px-2 py-1 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)]"
              >
                {p.status}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}