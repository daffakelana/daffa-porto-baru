import type { Language } from "@/lib/i18n";
import type {
  HomepageCollection,
  HomepageProject,
  HomepageResponse,
} from "@/lib/types/homepage";

export interface ProjectCardData {
  id: string;
  company: string;
  type: string;
  year: string;
  title: string;
  description: string;
  image?: string;
  href: string;
}

export interface CollectionIntro {
  name: string;
  description: string | null;
}

interface Sortable {
  sort_order?: number | null;
}

function byOrder(a: Sortable, b: Sortable): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}

function projectTitle(p: HomepageProject, language: Language): string {
  return language === "id" ? p.title_id : p.title_en;
}

function projectType(p: HomepageProject, language: Language): string {
  return (language === "id" ? p.type_id : p.type_en) ?? "";
}

function projectDescription(p: HomepageProject, language: Language): string {
  return (language === "id" ? p.description_id : p.description_en) ?? "";
}

export function mapProjectCards(
  data: HomepageResponse,
  language: Language,
): ProjectCardData[] {
  return [...data.projects].sort(byOrder).map((project) => ({
    id: project.id,
    company: project.company ?? "",
    type: projectType(project, language),
    year: project.year ? String(project.year) : "",
    title: projectTitle(project, language),
    description: projectDescription(project, language),
    image: project.cover?.public_url,
    href: `/work/${project.slug}`,
  }));
}

export function mapCollectionIntro(
  collection: HomepageCollection,
  language: Language,
): CollectionIntro {
  return {
    name: collection.name,
    description:
      (language === "id"
        ? collection.description_id
        : collection.description_en) ?? null,
  };
}