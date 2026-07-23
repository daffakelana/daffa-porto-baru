import { rpc } from "@/lib/supabase/rpc";
import type { ProjectDetailResponse } from "@/lib/types/project";

export async function getProject(slug: string) {
  return rpc<"get_project_detail", ProjectDetailResponse>(
    "get_project_detail",
    {
      p_slug: slug,
    }
  );
}