import { notFound } from "next/navigation";

import { CollectionForm } from "@/components/admin/CollectionForm";
import { MemberEditor } from "@/components/admin/MemberEditor";
import {
  getCollectionById,
  getCollectionMembers,
} from "@/lib/admin/collections";
import { listProjects } from "@/lib/admin/projects";
import {
  updateCollectionAction,
  deleteCollectionAction,
  saveMembersAction,
} from "@/lib/admin/collection-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;

  const collection = await getCollectionById(id);
  if (!collection) notFound();

  const [members, allProjects] = await Promise.all([
    getCollectionMembers(id),
    listProjects(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="headline-2 text-[var(--text-color-default)]">
          {collection.name}
        </h1>
        <CollectionForm
          action={updateCollectionAction}
          initial={collection}
          submitLabel="Simpan perubahan"
        />
      </div>

      <div className="flex flex-col gap-4 border-t pt-8 border-[var(--divider-color)]">
        <div className="flex flex-col gap-1">
          <h2 className="headline-2-5 text-[var(--text-color-default)]">
            Project dalam koleksi
          </h2>
          <p className="body-1 text-[var(--text-color-secondary)]">
            Klik untuk menambah, atur urutan dengan panah, lalu simpan.
          </p>
        </div>

        <MemberEditor
          collectionId={collection.id}
          allProjects={allProjects.map((p) => ({
            id: p.id,
            title_en: p.title_en,
            slug: p.slug,
            status: p.status,
          }))}
          initialMemberIds={members.map((m) => m.project_id)}
          action={saveMembersAction}
        />
      </div>

      <form
        action={deleteCollectionAction}
        className="border-t pt-6 border-[var(--divider-color)]"
      >
        <input type="hidden" name="id" value={collection.id} />
        <button
          type="submit"
          className="rounded-md border px-3 py-2 label-3 border-red-300 text-red-600 hover:bg-red-50"
        >
          Hapus collection
        </button>
      </form>
    </div>
  );
}