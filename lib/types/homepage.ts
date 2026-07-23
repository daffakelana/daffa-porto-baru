export interface HomepageCover {
  public_url: string;
  alt_en: string | null;
  alt_id: string | null;
}

export interface HomepageProject {
  id: string;
  slug: string;
  company: string | null;
  year: number | null;

  title_en: string;
  title_id: string;

  type_en: string | null;
  type_id: string | null;

  description_en: string | null;
  description_id: string | null;

  featured: boolean | null;
  sort_order: number | null;

  cover: HomepageCover | null;
}

export interface HomepageCollection {
  id: string;
  slug: string;
  name: string;
  is_default: boolean;

  description_en: string | null;
  description_id: string | null;

  seo_title_en: string | null;
  seo_title_id: string | null;
  seo_description_en: string | null;
  seo_description_id: string | null;
}

export interface HomepageResponse {
  collection: HomepageCollection;
  projects: HomepageProject[];
}