import { createClient } from "@/lib/supabase/client";
import type { HomepageResponse } from "@/lib/types/homepage";

export async function getHomepage() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_homepage", {
    p_collection_slug: "general",
  });

  console.log("RPC DATA:", data);
  console.log("RPC ERROR:", error);

  if (error) throw error;

  return data as unknown as HomepageResponse;
}