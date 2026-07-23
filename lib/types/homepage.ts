export interface HomepageProject {
  id: string;
  slug: string;
  company: string;
  year: number;

  title_en: string;
  title_id: string;

  type_en: string;
  type_id: string;

  description_en: string;
  description_id: string;

  featured: boolean;

  cover_media_id: string | null;
  thumbnail_media_id: string | null;
}

export interface HomepageResponse {
  collection: unknown;
  projects: HomepageProject[];
}