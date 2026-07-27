import { notFound } from "next/navigation";
import Link from "next/link";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { MetaEditor } from "@/components/admin/MetaEditor";
import { CoverPicker } from "@/components/admin/CoverPicker";

import { getProjectById } from "@/lib/admin/projects";
import { getProjectMeta } from "@/lib/admin/meta";
import { listMedia } from "@/lib/admin/media";

import {
  updateProjectAction,
  deleteProjectAction,
} from "@/lib/admin/project-actions";
import { saveMetaAction } from "@/lib/admin/meta-actions";
import { setCoverAction } from "@/lib/admin/cover-actions";
import { ProjectCollections } from "@/components/admin/ProjectCollections";
import {
  listCollections,
  getProjectCollectionIds,
} from "@/lib/admin/collections";
import { saveProjectCollectionsAction } from "@/lib/admin/project-collection-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  const project = await getProjectById(id);
  if (!project) notFound();

  const [meta, media, allCollections, projectCollectionIds] = await Promise.all([
    getProjectMeta(id),
    listMedia(),
    listCollections(),
    getProjectCollectionIds(id),
  ]);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="headline-2 text-[var(--text-color-default)]">
            {project.title_en}
          </h1>
          <div className="flex items-center gap-4">
          <Link href={`/admin/projects/${project.id}/content`}
              className="rounded-md border px-3 py-1.5 label-3 border-[var(--divider-color)] text-[var(--text-color-default)] hover:bg-[var(--background-color-hover)]">
              Edit konten →
            </Link>
            <Link href={`/work/${project.slug}`} target="_blank"
              className="label-3 text-[var(--text-color-secondary)] hover:text-[var(--text-color-default)]">
              Lihat halaman ↗
            </Link>
          </div>
        </div>
        <ProjectForm action={updateProjectAction} initial={project} submitLabel="Simpan perubahan" />
      </div>

      {/* Cover */}
      <div className="flex flex-col gap-4 border-t pt-8 border-[var(--divider-color)]">
        <h2 className="headline-2-5 text-[var(--text-color-default)]">Cover</h2>
        <CoverPicker
          projectId={project.id}
          currentId={project.thumbnail_media_id ?? project.cover_media_id ?? null}
          media={media.map((m) => ({
            id: m.id,
            public_url: m.public_url,
            filename: m.filename,
            alt_en: m.alt_en,
          }))}
          action={setCoverAction}
        />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-4 border-t pt-8 border-[var(--divider-color)]">
        <div className="flex flex-col gap-1">
          <h2 className="headline-2-5 text-[var(--text-color-default)]">
            Meta (Year, Role, Industry, …)
          </h2>
          <p className="body-1 text-[var(--text-color-secondary)]">
            Baris tanpa badge tampil sebagai teks. Baris dengan badge tampil sebagai tag.
          </p>
        </div>
        <MetaEditor projectId={project.id} initial={meta} action={saveMetaAction} />
      </div>

      {/* Collections */}
      <div className="flex flex-col gap-4 border-t pt-8 border-[var(--divider-color)]">
        <div className="flex flex-col gap-1">
          <h2 className="headline-2-5 text-[var(--text-color-default)]">
            Muncul di collection
          </h2>
          <p className="body-1 text-[var(--text-color-secondary)]">
            Centang koleksi tempat project ini ditampilkan. Urutan detail per
            koleksi tetap diatur dari halaman collection.
          </p>
        </div>
        <ProjectCollections
          projectId={project.id}
          collections={allCollections.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            is_default: c.is_default,
          }))}
          initialIds={projectCollectionIds}
          action={saveProjectCollectionsAction}
        />
      </div>

      {/* Danger */}
      <form action={deleteProjectAction} className="border-t pt-6 border-[var(--divider-color)]">
        <input type="hidden" name="id" value={project.id} />
        <button type="submit"
          className="rounded-md border px-3 py-2 label-3 border-red-300 text-red-600 hover:bg-red-50">
          Hapus project
        </button>
      </form>
    </div>
  );
}