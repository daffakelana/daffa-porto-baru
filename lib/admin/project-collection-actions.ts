"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import type { FormState } from "@/lib/admin/form";
import { setProjectCollections } from "@/lib/admin/collections";

export async function saveProjectCollectionsAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const projectId = String(fd.get("project_id") ?? "");
  if (!projectId) return { error: "ID project tidak ada." };

  const ids = String(fd.get("collection_ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await setProjectCollections(projectId, ids);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal." };
  }
}