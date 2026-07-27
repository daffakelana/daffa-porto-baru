import "server-only";
import { admin } from "@/lib/supabase/admin";

export interface MetaBadgeInput {
  label: string;
  icon: string | null;
  icon_color: string | null;
}

export interface MetaRowInput {
  label_en: string;
  label_id: string;
  value_en: string | null;
  value_id: string | null;
  badges: MetaBadgeInput[];
}

export interface MetaRowFull extends MetaRowInput {
  id: string;
  sort_order: number;
}

export async function getProjectMeta(projectId: string): Promise<MetaRowFull[]> {
  const { data: rows, error } = await admin
    .from("project_meta_rows")
    .select("id, label_en, label_id, value_en, value_id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const { data: badges, error: bErr } = await admin
    .from("project_meta_badges")
    .select("meta_row_id, label, icon, icon_color, sort_order")
    .in("meta_row_id", ids)
    .order("sort_order", { ascending: true });

  if (bErr) throw new Error(bErr.message);

  const byRow = new Map<string, MetaBadgeInput[]>();
  for (const b of badges ?? []) {
    const list = byRow.get(b.meta_row_id) ?? [];
    list.push({ label: b.label, icon: b.icon, icon_color: b.icon_color });
    byRow.set(b.meta_row_id, list);
  }

  return rows.map((r) => ({
    id: r.id,
    label_en: r.label_en,
    label_id: r.label_id,
    value_en: r.value_en,
    value_id: r.value_id,
    sort_order: r.sort_order,
    badges: byRow.get(r.id) ?? [],
  }));
}

/** Ganti seluruh meta project: hapus lama, tulis ulang dari input. */
export async function replaceProjectMeta(
  projectId: string,
  rows: MetaRowInput[],
): Promise<void> {
  // Hapus semua baris lama (badge ikut terhapus via FK cascade jika ada,
  // kalau tidak, hapus manual dulu).
  const { data: oldRows } = await admin
    .from("project_meta_rows")
    .select("id")
    .eq("project_id", projectId);

  const oldIds = (oldRows ?? []).map((r) => r.id);
  if (oldIds.length > 0) {
    await admin.from("project_meta_badges").delete().in("meta_row_id", oldIds);
    await admin.from("project_meta_rows").delete().eq("project_id", projectId);
  }

  if (rows.length === 0) return;

  // Insert baris baru satu per satu supaya dapat id untuk badge-nya.
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const { data: inserted, error } = await admin
      .from("project_meta_rows")
      .insert({
        project_id: projectId,
        label_en: row.label_en,
        label_id: row.label_id,
        value_en: row.value_en,
        value_id: row.value_id,
        sort_order: i + 1,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    if (row.badges.length > 0) {
      const badgeRows = row.badges.map((b, j) => ({
        meta_row_id: inserted.id,
        label: b.label,
        icon: b.icon,
        icon_color: b.icon_color,
        sort_order: j + 1,
      }));
      const { error: bErr } = await admin
        .from("project_meta_badges")
        .insert(badgeRows);
      if (bErr) throw new Error(bErr.message);
    }
  }
}