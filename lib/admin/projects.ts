import "server-only";
import { admin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export async function listProjects(): Promise<ProjectRow[]> {
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createProject(input: ProjectInsert): Promise<ProjectRow> {
  const { data, error } = await admin
    .from("projects")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(id: string, input: ProjectUpdate): Promise<void> {
  const { error } = await admin.from("projects").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await admin.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}