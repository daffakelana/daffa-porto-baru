import { notFound } from "next/navigation";

import { getHomepage } from "@/lib/api/homepage";
import { DEFAULT_COLLECTION_SLUG } from "@/lib/collections";
import { HomeView } from "@/components/HomeView";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomepage(DEFAULT_COLLECTION_SLUG);

  if (!data) notFound();

  return <HomeView data={data} />;
}