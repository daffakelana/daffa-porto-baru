import "server-only";
import { admin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type MediaRow = Database["public"]["Tables"]["media_assets"]["Row"];

const BUCKET = "media";

export async function listMedia(): Promise<MediaRow[]> {
  const { data, error } = await admin
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMediaById(id: string): Promise<MediaRow | null> {
  const { data, error } = await admin
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

interface UploadInput {
  file: File;
  altEn: string | null;
  altId: string | null;
  width: number | null;
  height: number | null;
}

export async function uploadMedia(input: UploadInput): Promise<MediaRow> {
  const { file, altEn, altId, width, height } = input;

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  const storagePath = `${Date.now()}-${safeBase}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (upErr) throw new Error(`Upload gagal: ${upErr.message}`);

  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(storagePath);

  const { data, error } = await admin
    .from("media_assets")
    .insert({
      filename: file.name,
      storage_path: storagePath,
      public_url: pub.publicUrl,
      mime_type: file.type || null,
      size: file.size,
      alt_en: altEn,
      alt_id: altId,
      width,
      height,
    })
    .select("*")
    .single();

  if (error) {
    // Rollback file kalau insert baris gagal, supaya tidak ada file yatim.
    await admin.storage.from(BUCKET).remove([storagePath]);
    throw new Error(error.message);
  }

  return data;
}

export async function updateMediaAlt(
  id: string,
  altEn: string | null,
  altId: string | null,
): Promise<void> {
  const { error } = await admin
    .from("media_assets")
    .update({ alt_en: altEn, alt_id: altId })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** True kalau media masih dipakai project/block/collection. */
export async function isMediaInUse(id: string): Promise<boolean> {
  const [blocks, projCover, projThumb, colHero] = await Promise.all([
    admin.from("project_blocks").select("id").eq("media_id", id).limit(1),
    admin.from("projects").select("id").eq("cover_media_id", id).limit(1),
    admin.from("projects").select("id").eq("thumbnail_media_id", id).limit(1),
    admin.from("collections").select("id").eq("hero_media_id", id).limit(1),
  ]);

  return Boolean(
    blocks.data?.length ||
      projCover.data?.length ||
      projThumb.data?.length ||
      colHero.data?.length,
  );
}

export async function deleteMedia(id: string): Promise<void> {
  const media = await getMediaById(id);
  if (!media) return;

  // Hapus file dari storage dulu, lalu barisnya.
  const { error: rmErr } = await admin.storage
    .from(BUCKET)
    .remove([media.storage_path]);
  if (rmErr) throw new Error(`Hapus file gagal: ${rmErr.message}`);

  const { error } = await admin.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}