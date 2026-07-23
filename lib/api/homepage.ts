import { rpc } from "@/lib/supabase/rpc";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/collections";
import type { HomepageResponse } from "@/lib/types/homepage";

export async function getHomepage(
  collectionSlug: string = DEFAULT_COLLECTION_SLUG,
): Promise<HomepageResponse | null> {
  const data = await rpc<"get_homepage", HomepageResponse | null>(
    "get_homepage",
    { p_collection_slug: collectionSlug },
  );

  return data?.collection ? data : null;
}