"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import type { FormState } from "@/lib/admin/form";
import {
  uploadMedia,
  updateMediaAlt,
  deleteMedia,
  isMediaInUse,
} from "@/lib/admin/media";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
}

function num(fd: FormData, key: string): number | null {
  const v = fd.get(key);
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function message(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan.";
}

export async function uploadMediaAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Pilih file dulu." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Ukuran maksimal 8 MB." };
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return { error: `Tipe tidak didukung: ${file.type}` };
  }

  try {
    await uploadMedia({
      file,
      altEn: str(fd, "alt_en"),
      altId: str(fd, "alt_id"),
      width: num(fd, "width"),
      height: num(fd, "height"),
    });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}

export async function updateAltAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(fd.get("id") ?? "");
  if (!id) return { error: "ID tidak ada." };

  try {
    await updateMediaAlt(id, str(fd, "alt_en"), str(fd, "alt_id"));
    revalidatePath("/admin/media");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}

export async function deleteMediaAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (!id) return;

  // Cegah hapus media yang masih dipakai — kalau tidak, gambar jadi rusak.
  if (await isMediaInUse(id)) {
    // Tidak melempar; halaman punya varian pesan lewat query param.
    revalidatePath("/admin/media");
    return;
  }

  await deleteMedia(id);
  revalidatePath("/admin/media");
}