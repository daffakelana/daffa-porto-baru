import { notFound } from "next/navigation";
import Link from "next/link";

import { getProjectById } from "@/lib/admin/projects";
import { getProjectSections } from "@/lib/admin/blocks";
import { listMedia } from "@/lib/admin/media";
import { saveSectionsAction } from "@/lib/admin/block-actions";
import { SectionEditor } from "@/components/admin/SectionEditor";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectContentPage({ params }: Props) {
  const { id } = await params;

  const project = await getProjectById(id);
  if (!project) notFound();

  const [sections, media] = await Promise.all([
    getProjectSections(id),
    listMedia(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link href={`/admin/projects/${id}`}
            className="label-3 text-[var(--text-color-secondary)] hover:text-[var(--text-color-default)]">
            ← Kembali ke project
          </Link>
          <h1 className="headline-2 text-[var(--text-color-default)]">
            Konten — {project.title_en}
          </h1>
        </div>
        <Link href={`/work/${project.slug}`} target="_blank"
          className="label-3 text-[var(--text-color-secondary)] hover:text-[var(--text-color-default)]">
          Lihat halaman ↗
        </Link>
      </div>

      <SectionEditor
        projectId={project.id}
        initial={sections.map((s) => ({
          title_en: s.title_en,
          title_id: s.title_id,
          blocks: s.blocks.map((b) => ({
            type: b.type,
            content_en: b.content_en,
            content_id: b.content_id,
            caption_en: b.caption_en,
            caption_id: b.caption_id,
            media_id: b.media_id,
            embed_url: b.embed_url,
          })),
        }))}
        media={media.map((m) => ({
          id: m.id,
          public_url: m.public_url,
          alt_en: m.alt_en,
        }))}
        action={saveSectionsAction}
      />
    </div>
  );
}