"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { isReservedSlug } from "@/lib/collections";
import type { FormState } from "@/lib/admin/form";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  setCollectionMembers,
} from "@/lib/admin/collections";

const STATUSES = ["draft", "published", "archived"] as const;
type Status = (typeof STATUSES)[number];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
}

function statusOf(fd: FormData): Status {
  const s = String(fd.get("status") ?? "draft");
  return (STATUSES as readonly string[]).includes(s) ? (s as Status) : "draft";
}

function message(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan.";
}

function revalidateSite(): void {
  revalidatePath("/", "layout");
}

export async function createCollectionAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { error: "Nama wajib diisi." };

  const slug = slugify(String(fd.get("slug") ?? "").trim() || name);
  if (isReservedSlug(slug)) return { error: `Slug "${slug}" dipakai route lain.` };

  let id: string;
  try {
    const c = await createCollection({
      name,
      slug,
      is_default: fd.get("is_default") === "on",
      status: statusOf(fd),
      sort_order: Number(fd.get("sort_order") ?? 0) || 0,
      description_en: str(fd, "description_en"),
      description_id: str(fd, "description_id"),
      seo_title_en: str(fd, "seo_title_en"),
      seo_title_id: str(fd, "seo_title_id"),
      seo_description_en: str(fd, "seo_description_en"),
      seo_description_id: str(fd, "seo_description_id"),
    });
    id = c.id;
    revalidateSite();
  } catch (e) {
    return { error: message(e) };
  }

  redirect(`/admin/collections/${id}`);
}

export async function updateCollectionAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(fd.get("id") ?? "");
  if (!id) return { error: "ID collection tidak ada." };

  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { error: "Nama wajib diisi." };

  const slug = slugify(String(fd.get("slug") ?? "").trim() || name);
  if (isReservedSlug(slug)) return { error: `Slug "${slug}" dipakai route lain.` };

  try {
    await updateCollection(id, {
      name,
      slug,
      is_default: fd.get("is_default") === "on",
      status: statusOf(fd),
      sort_order: Number(fd.get("sort_order") ?? 0) || 0,
      description_en: str(fd, "description_en"),
      description_id: str(fd, "description_id"),
      seo_title_en: str(fd, "seo_title_en"),
      seo_title_id: str(fd, "seo_title_id"),
      seo_description_en: str(fd, "seo_description_en"),
      seo_description_id: str(fd, "seo_description_id"),
    });
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}

export async function deleteCollectionAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) {
    await deleteCollection(id);
    revalidateSite();
  }
  redirect("/admin/collections");
}

/** Simpan keanggotaan. `order` = string id dipisah koma, urut. */
export async function saveMembersAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(fd.get("collection_id") ?? "");
  if (!id) return { error: "ID collection tidak ada." };

  const order = String(fd.get("order") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await setCollectionMembers(id, order);
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}