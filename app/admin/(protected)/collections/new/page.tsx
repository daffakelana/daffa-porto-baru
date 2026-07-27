import { CollectionForm } from "@/components/admin/CollectionForm";
import { createCollectionAction } from "@/lib/admin/collection-actions";

export default function NewCollectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="headline-2 text-[var(--text-color-default)]">
        Collection baru
      </h1>
      <CollectionForm action={createCollectionAction} submitLabel="Buat collection" />
    </div>
  );
}