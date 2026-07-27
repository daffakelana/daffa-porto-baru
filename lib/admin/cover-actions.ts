"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import type { FormState } from "@/lib/admin/form";
import { updateProject } from "@/lib/admin/projects";

export async function setCoverAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const projectId = String(fd.get("project_id") ?? "");
  if (!projectId) return { error: "ID project tidak ada." };

  const raw = String(fd.get("media_id") ?? "").trim();
  const mediaId = raw === "" ? null : raw;

  try {
    // thumbnail dipakai kartu homepage; set cover sama supaya konsisten.
    await updateProject(projectId, {
      thumbnail_media_id: mediaId,
      cover_media_id: mediaId,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal." };
  }
}