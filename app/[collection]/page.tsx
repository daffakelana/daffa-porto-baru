import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHomepage } from "@/lib/api/homepage";
import { isReservedSlug } from "@/lib/collections";
import { HomeView } from "@/components/HomeView";

export const revalidate = 60;

interface Props {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;

  if (isReservedSlug(collection)) return {};

  const data = await getHomepage(collection);
  if (!data) return {};

  const c = data.collection;

  return {
    title: c.seo_title_en ?? `${c.name} — Daffa Putra Pratama`,
    description: c.seo_description_en ?? c.description_en ?? undefined,
    // Halaman koleksi bersifat personal — jangan diindeks mesin pencari.
    robots: { index: false, follow: false },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;

  // Jangan sampai segmen dinamis menelan route statis seperti /resume, /blog.
  if (isReservedSlug(collection)) notFound();

  const data = await getHomepage(collection);

  if (!data) notFound();

  return <HomeView data={data} />;
}