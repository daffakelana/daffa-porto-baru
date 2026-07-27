"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import type { FormState } from "@/lib/admin/form";
import { replaceProjectMeta, type MetaRowInput } from "@/lib/admin/meta";

function message(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan.";
}

function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export async function saveMetaAction(
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
    return { error: "Data meta tidak valid." };
  }

  if (!Array.isArray(parsed)) return { error: "Format meta salah." };

  const rows: MetaRowInput[] = [];
  for (const raw of parsed) {
    const r = raw as Record<string, unknown>;
    const label_en = clean(r.label_en);
    if (!label_en) continue; // baris tanpa label diabaikan

    const badges = Array.isArray(r.badges) ? r.badges : [];

    rows.push({
      label_en,
      label_id: clean(r.label_id) ?? label_en,
      value_en: clean(r.value_en),
      value_id: clean(r.value_id),
      badges: badges
        .map((b) => {
          const bb = b as Record<string, unknown>;
          const label = clean(bb.label);
          if (!label) return null;
          return {
            label,
            icon: clean(bb.icon),
            icon_color: clean(bb.icon_color),
          };
        })
        .filter((b): b is NonNullable<typeof b> => b !== null),
    });
  }

  try {
    await replaceProjectMeta(projectId, rows);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}