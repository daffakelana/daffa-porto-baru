import { rpc } from "@/lib/supabase/rpc";
import type { ProjectDetailResponse } from "@/lib/types/project";

export async function getProject(
  slug: string,
): Promise<ProjectDetailResponse | null> {
  const data = await rpc<"get_project_detail", ProjectDetailResponse | null>(
    "get_project_detail",
    { p_slug: slug },
  );

  return data?.project ? data : null;
}