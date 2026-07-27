import { notFound } from "next/navigation";
import Link from "next/link";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/admin/projects";
import {
  updateProjectAction,
  deleteProjectAction,
} from "@/lib/admin/project-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="headline-2 text-[var(--text-color-default)]">
          {project.title_en}
        </h1>
        <Link
          href={`/work/${project.slug}`}
          target="_blank"
          className="label-3 text-[var(--text-color-secondary)] hover:text-[var(--text-color-default)]"
        >
          Lihat halaman ↗
        </Link>
      </div>

      <ProjectForm
        action={updateProjectAction}
        initial={project}
        submitLabel="Simpan perubahan"
      />

      <form
        action={deleteProjectAction}
        className="border-t pt-6 border-[var(--divider-color)]"
      >
        <input type="hidden" name="id" value={project.id} />
        <button
          type="submit"
          className="rounded-md border px-3 py-2 label-3 border-red-300 text-red-600 hover:bg-red-50"
        >
          Hapus project
        </button>
      </form>
    </div>
  );
}