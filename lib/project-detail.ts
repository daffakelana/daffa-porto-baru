import { Search, PenTool, type LucideIcon } from "lucide-react";
import type { MetaRow } from "@/components/DetailHeader";
import type {
  SidebarSection,
  SidebarLink,
} from "@/components/DetailSidebar";
import type { ProjectDetailResponse } from "@/lib/types/project";

const ICONS: Record<string, LucideIcon> = {
  PenTool,
  Search,
};

export function mapMetaRows(
  data: ProjectDetailResponse,
  language: "en" | "id"
): MetaRow[] {
  return data.meta.map((row) => ({
    label: language === "id" ? row.label_id : row.label_en,

    value:
      row.badges.length === 0
        ? language === "id"
          ? row.value_id ?? ""
          : row.value_en ?? ""
        : undefined,

    badges:
      row.badges.length > 0
        ? row.badges.map((badge:any) => ({
            label: badge.label,
            icon: badge.icon ? ICONS[badge.icon] : undefined,
            iconColor: badge.icon_color,
          }))
        : undefined,
  }));
}

type ProjectBlock = ProjectDetailResponse["sections"][number]["blocks"][number];

export interface GroupedSection {
  id: string;
  title: string;

  items: {
    id: string;
    label: string;
    blocks: ProjectBlock[];
  }[];
}

export function groupSections(
  data: ProjectDetailResponse,
  language: "en" | "id"
): GroupedSection[] {
  return data.sections.map((section) => {
    const groups: GroupedSection["items"] = [];

    let current: GroupedSection["items"][number] | null = null;

    section.blocks.forEach((block:any) => {
      if (block.type === "heading") {
        current = {
          id: block.id,
          label:
            language === "id"
              ? block.content_id ?? ""
              : block.content_en ?? "",
          blocks: [],
        };

        groups.push(current);
        return;
      }

      current?.blocks.push(block);
    });

    return {
      id: section.id,
      title:
        language === "id"
          ? section.title_id
          : section.title_en,
      items: groups,
    };
  });
}

export function mapSidebar(
  sections: GroupedSection[]
): SidebarSection[] {
  return sections.map((section) => ({
    id: section.id,
    label: section.title,
    defaultOpen: true,

    items: section.items.map(
      (item): SidebarLink => ({
        id: item.id,
        label: item.label,
      })
    ),
  }));
}