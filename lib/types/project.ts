export type ProjectBlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "quote"
  | "video"
  | "embed";

export interface ProjectBadge {
  icon: string | null;
  icon_color: string | null;
  label: string;
  sort_order: number;
}

export interface ProjectMeta {
  id: string;
  label_en: string;
  label_id: string;
  value_en: string | null;
  value_id: string | null;
  sort_order: number;
  badges: ProjectBadge[];
}

export interface ProjectMedia {
  id: string;
  public_url: string;
  alt_en: string | null;
  alt_id: string | null;
  width: number | null;
  height: number | null;
}

export interface ProjectBlock {
  id: string;
  type: ProjectBlockType;
  content_en: string | null;
  content_id: string | null;
  caption_en: string | null;
  caption_id: string | null;
  media_id: string | null;
  embed_url: string | null;
  sort_order: number;
  media?: ProjectMedia | null;
}

export interface ProjectSection {
  id: string;
  title_en: string;
  title_id: string;
  sort_order: number;
  blocks: ProjectBlock[];
}

export interface ProjectDetail {
  id: string;
  slug: string;
  company: string;
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  type_en: string;
  type_id: string;
  year: number;
}

export interface ProjectDetailResponse {
  project: ProjectDetail;
  meta: ProjectMeta[];
  sections: ProjectSection[];
}