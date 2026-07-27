import "server-only";
import { admin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];
type CollectionInsert = Database["public"]["Tables"]["collections"]["Insert"];
type CollectionUpdate = Database["public"]["Tables"]["collections"]["Update"];

export interface CollectionWithCount extends CollectionRow {
  project_count: number;
}

export interface CollectionMember {
  project_id: string;
  sort_order: number;
  title_en: string;
  slug: string;
  status: string;
}

export async function listCollections(): Promise<CollectionWithCount[]> {
  const { data, error } = await admin
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = data ?? [];

  // Hitung jumlah project per collection lewat query terpisah (aman lintas versi).
  const counts = new Map<string, number>();
  const { data: links, error: linkErr } = await admin
    .from("collection_projects")
    .select("collection_id");

  if (linkErr) throw new Error(linkErr.message);

  for (const link of links ?? []) {
    const key = link.collection_id;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return rows.map((c) => ({
    ...c,
    project_count: counts.get(c.id) ?? 0,
  }));
}

export async function getCollectionById(
  id: string,
): Promise<CollectionRow | null> {
  const { data, error } = await admin
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createCollection(
  input: CollectionInsert,
): Promise<CollectionRow> {
  const { data, error } = await admin
    .from("collections")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCollection(
  id: string,
  input: CollectionUpdate,
): Promise<void> {
  const { error } = await admin.from("collections").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCollection(id: string): Promise<void> {
  const { error } = await admin.from("collections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getCollectionMembers(
  collectionId: string,
): Promise<CollectionMember[]> {
  const { data, error } = await admin
    .from("collection_projects")
    .select("project_id, sort_order, projects(title_en, slug, status)")
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const p = row.projects as unknown as {
      title_en: string;
      slug: string;
      status: string;
    } | null;

    return {
      project_id: row.project_id,
      sort_order: row.sort_order,
      title_en: p?.title_en ?? "(tanpa judul)",
      slug: p?.slug ?? "",
      status: p?.status ?? "draft",
    };
  });
}

export async function setCollectionMembers(
  collectionId: string,
  projectIds: string[],
): Promise<void> {
  const { error: delErr } = await admin
    .from("collection_projects")
    .delete()
    .eq("collection_id", collectionId);
  if (delErr) throw new Error(delErr.message);

  if (projectIds.length === 0) return;

  const rows = projectIds.map((project_id, index) => ({
    collection_id: collectionId,
    project_id,
    sort_order: index + 1,
  }));

  const { error: insErr } = await admin
    .from("collection_projects")
    .insert(rows);
  if (insErr) throw new Error(insErr.message);
}

/** Koleksi mana saja yang memuat project ini. */
export async function getProjectCollectionIds(
  projectId: string,
): Promise<string[]> {
  const { data, error } = await admin
    .from("collection_projects")
    .select("collection_id")
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.collection_id);
}

/**
 * Set keanggotaan dari sisi project: tentukan project ini ada di koleksi mana saja.
 * Project ditambahkan ke akhir urutan tiap koleksi yang dipilih, dan dilepas
 * dari koleksi yang tidak dipilih — tanpa mengganggu anggota lain.
 */
export async function setProjectCollections(
  projectId: string,
  collectionIds: string[],
): Promise<void> {
  const current = await getProjectCollectionIds(projectId);
  const target = new Set(collectionIds);
  const currentSet = new Set(current);

  const toAdd = collectionIds.filter((id) => !currentSet.has(id));
  const toRemove = current.filter((id) => !target.has(id));

  // Lepas dari koleksi yang tidak lagi dipilih.
  if (toRemove.length > 0) {
    const { error } = await admin
      .from("collection_projects")
      .delete()
      .eq("project_id", projectId)
      .in("collection_id", toRemove);
    if (error) throw new Error(error.message);
  }

  // Tambahkan ke koleksi baru, di urutan paling akhir masing-masing.
  for (const collectionId of toAdd) {
    const { data: last } = await admin
      .from("collection_projects")
      .select("sort_order")
      .eq("collection_id", collectionId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (last?.sort_order ?? 0) + 1;

    const { error } = await admin.from("collection_projects").insert({
      collection_id: collectionId,
      project_id: projectId,
      sort_order: nextOrder,
    });
    if (error) throw new Error(error.message);
  }
}