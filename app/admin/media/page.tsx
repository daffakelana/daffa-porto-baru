import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaCard } from "@/components/admin/MediaCard";
import { listMedia } from "@/lib/admin/media";
import {
  uploadMediaAction,
  updateAltAction,
  deleteMediaAction,
} from "@/lib/admin/media-actions";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await listMedia();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="headline-2 text-[var(--text-color-default)]">Media</h1>

      <MediaUploader action={uploadMediaAction} />

      <div className="flex flex-col gap-3">
        <span className="label-2 text-[var(--text-color-secondary)]">
          Galeri ({media.length})
        </span>

        {media.length === 0 ? (
          <p className="body-1 text-[var(--text-color-tertiary)]">
            Belum ada media.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((m) => (
              <MediaCard
                key={m.id}
                media={{
                  id: m.id,
                  public_url: m.public_url,
                  filename: m.filename,
                  alt_en: m.alt_en,
                  alt_id: m.alt_id,
                  width: m.width,
                  height: m.height,
                }}
                updateAction={updateAltAction}
                deleteAction={deleteMediaAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}