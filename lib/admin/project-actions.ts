"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { isReservedSlug } from "@/lib/collections";
import type { FormState } from "@/lib/admin/form";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/admin/projects";

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

function num(fd: FormData, key: string): number | null {
  const v = fd.get(key);
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function statusOf(fd: FormData): Status {
  const s = String(fd.get("status") ?? "draft");
  return (STATUSES as readonly string[]).includes(s) ? (s as Status) : "draft";
}

function message(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan.";
}

function revalidateSite(): void {
  revalidatePath("/", "layout"); // busts homepage, koleksi, dan /work/[slug]
}

export async function createProjectAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const title_en = String(fd.get("title_en") ?? "").trim();
  if (!title_en) return { error: "Judul (EN) wajib diisi." };

  const rawSlug = String(fd.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || title_en);
  if (isReservedSlug(slug)) return { error: `Slug "${slug}" dipakai route lain.` };

  let id: string;
  try {
    const project = await createProject({
      slug,
      title_en,
      title_id: str(fd, "title_id") ?? title_en,
      company: str(fd, "company"),
      year: num(fd, "year"),
      type_en: str(fd, "type_en"),
      type_id: str(fd, "type_id"),
      description_en: str(fd, "description_en"),
      description_id: str(fd, "description_id"),
      status: statusOf(fd),
      featured: fd.get("featured") === "on",
      sort_order: num(fd, "sort_order") ?? 0,
    });
    id = project.id;
    revalidateSite();
  } catch (e) {
    return { error: message(e) };
  }

  redirect(`/admin/projects/${id}`); // di luar try — redirect melempar NEXT_REDIRECT
}

export async function updateProjectAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(fd.get("id") ?? "");
  if (!id) return { error: "ID project tidak ditemukan." };

  const title_en = String(fd.get("title_en") ?? "").trim();
  if (!title_en) return { error: "Judul (EN) wajib diisi." };

  const rawSlug = String(fd.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || title_en);
  if (isReservedSlug(slug)) return { error: `Slug "${slug}" dipakai route lain.` };

  try {
    await updateProject(id, {
      slug,
      title_en,
      title_id: str(fd, "title_id") ?? title_en,
      company: str(fd, "company"),
      year: num(fd, "year"),
      type_en: str(fd, "type_en"),
      type_id: str(fd, "type_id"),
      description_en: str(fd, "description_en"),
      description_id: str(fd, "description_id"),
      status: statusOf(fd),
      featured: fd.get("featured") === "on",
      sort_order: num(fd, "sort_order") ?? 0,
    });
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}

export async function deleteProjectAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (id) {
    await deleteProject(id);
    revalidateSite();
  }
  redirect("/admin");
}

export async function toggleStatusAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const current = String(fd.get("current") ?? "");
  const next: Status = current === "published" ? "draft" : "published";
  if (id) {
    await updateProject(id, { status: next });
    revalidateSite();
  }
  revalidatePath("/admin");
}