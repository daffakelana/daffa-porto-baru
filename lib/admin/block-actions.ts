"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import type { FormState } from "@/lib/admin/form";
import { cleanRichText } from "@/lib/sanitize";
import {
  replaceProjectSections,
  type SectionInput,
  type BlockType,
} from "@/lib/admin/blocks";

const BLOCK_TYPES: BlockType[] = [
  "heading",
  "paragraph",
  "image",
  "quote",
  "video",
  "embed",
];

const RICH_TYPES = new Set<BlockType>(["paragraph", "quote"]);

function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export async function saveSectionsAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const projectId = String(fd.get("project_id") ?? "");
  if (!projectId) return { error: "ID project tidak ada." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(fd.get("payload") ?? "[]"));
  } catch {
    return { error: "Data tidak valid." };
  }
  if (!Array.isArray(parsed)) return { error: "Format salah." };

  const sections: SectionInput[] = [];

  for (const rawSec of parsed) {
    const s = rawSec as Record<string, unknown>;
    const title_en = clean(s.title_en);
    if (!title_en) continue; // section tanpa judul dibuang

    const rawBlocks = Array.isArray(s.blocks) ? s.blocks : [];
    const blocks = [];

    for (const rawBlock of rawBlocks) {
      const b = rawBlock as Record<string, unknown>;
      const type = b.type as BlockType;
      if (!BLOCK_TYPES.includes(type)) continue;

      // Sanitasi konten rich text di server sebelum simpan.
      const rawEn = clean(b.content_en);
      const rawId = clean(b.content_id);
      const content_en = RICH_TYPES.has(type)
        ? rawEn
          ? cleanRichText(rawEn) || null
          : null
        : rawEn;
      const content_id = RICH_TYPES.has(type)
        ? rawId
          ? cleanRichText(rawId) || null
          : null
        : rawId;

      // Lewati blok yang benar-benar kosong.
      const hasContent =
        content_en ||
        content_id ||
        clean(b.media_id) ||
        clean(b.embed_url);
      if (!hasContent && type !== "image") continue;

      blocks.push({
        type,
        content_en,
        content_id,
        caption_en: clean(b.caption_en),
        caption_id: clean(b.caption_id),
        media_id: clean(b.media_id),
        embed_url: clean(b.embed_url),
      });
    }

    sections.push({
      title_en,
      title_id: clean(s.title_id) ?? title_en,
      blocks,
    });
  }

  try {
    await replaceProjectSections(projectId, sections);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}