import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProject } from "@/lib/api/project";
import { ProjectDetailView } from "@/components/ProjectDetailView";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) return { title: "Not Found" };

  return {
    title: data.project.title_en,
    description: data.project.description_en,
  };
}
export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProject(slug);

  console.log("SECTIONS:", data?.sections?.length);
  console.dir(data?.sections?.[0], { depth: null });

  if (!data) notFound();

  return <ProjectDetailView data={data} />;
}