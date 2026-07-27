import "server-only";
import { admin } from "@/lib/supabase/admin";

export type BlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "quote"
  | "video"
  | "embed";

export interface SectionInput {
  id?: string; // ada = update, tidak ada = insert baru
  title_en: string;
  title_id: string;
  blocks: BlockInput[];
}

export interface BlockInput {
  id?: string;
  type: BlockType;
  content_en: string | null;
  content_id: string | null;
  caption_en: string | null;
  caption_id: string | null;
  media_id: string | null;
  embed_url: string | null;
}

export interface SectionFull {
  id: string;
  title_en: string;
  title_id: string;
  sort_order: number;
  blocks: BlockFull[];
}

export interface BlockFull extends BlockInput {
  id: string;
  sort_order: number;
}

export async function getProjectSections(
  projectId: string,
): Promise<SectionFull[]> {
  const { data: sections, error } = await admin
    .from("project_sections")
    .select("id, title_en, title_id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  if (!sections || sections.length === 0) return [];

  const ids = sections.map((s) => s.id);
  const { data: blocks, error: bErr } = await admin
    .from("project_blocks")
    .select(
      "id, section_id, type, content_en, content_id, caption_en, caption_id, media_id, embed_url, sort_order",
    )
    .in("section_id", ids)
    .order("sort_order", { ascending: true });

  if (bErr) throw new Error(bErr.message);

  const bySection = new Map<string, BlockFull[]>();
  for (const b of blocks ?? []) {
    const list = bySection.get(b.section_id) ?? [];
    list.push({
      id: b.id,
      type: b.type as BlockType,
      content_en: b.content_en,
      content_id: b.content_id,
      caption_en: b.caption_en,
      caption_id: b.caption_id,
      media_id: b.media_id,
      embed_url: b.embed_url,
      sort_order: b.sort_order ?? 0,
    });
    bySection.set(b.section_id, list);
  }

  return sections.map((s) => ({
    id: s.id,
    title_en: s.title_en,
    title_id: s.title_id,
    sort_order: s.sort_order ?? 0,
    blocks: bySection.get(s.id) ?? [],
  }));
}

/**
 * Ganti seluruh section+block project dalam satu operasi.
 * Strategi "hapus lalu tulis ulang" — paling sederhana dan konsisten dengan
 * pola meta. Aman karena block tidak direferensikan tabel lain.
 */
export async function replaceProjectSections(
  projectId: string,
  sections: SectionInput[],
): Promise<void> {
  const { data: oldSections } = await admin
    .from("project_sections")
    .select("id")
    .eq("project_id", projectId);

  const oldIds = (oldSections ?? []).map((s) => s.id);
  if (oldIds.length > 0) {
    await admin.from("project_blocks").delete().in("section_id", oldIds);
    await admin.from("project_sections").delete().eq("project_id", projectId);
  }

  for (let si = 0; si < sections.length; si++) {
    const sec = sections[si];
    const { data: insertedSec, error } = await admin
      .from("project_sections")
      .insert({
        project_id: projectId,
        title_en: sec.title_en,
        title_id: sec.title_id,
        sort_order: si + 1,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    if (sec.blocks.length === 0) continue;

    const blockRows = sec.blocks.map((b, bi) => ({
      section_id: insertedSec.id,
      type: b.type,
      content_en: b.content_en,
      content_id: b.content_id,
      caption_en: b.caption_en,
      caption_id: b.caption_id,
      media_id: b.media_id,
      embed_url: b.embed_url,
      sort_order: bi + 1,
    }));

    const { error: bErr } = await admin
      .from("project_blocks")
      .insert(blockRows);
    if (bErr) throw new Error(bErr.message);
  }
}