import { Search, PenTool, type LucideIcon } from "lucide-react";
import type { MetaRow } from "@/components/DetailHeader";
import type { SidebarSection, SidebarLink } from "@/components/DetailSidebar";
import type { Language } from "@/lib/i18n";
import type {
  ProjectBlock,
  ProjectDetailResponse,
  ProjectMeta,
  ProjectSection,
} from "@/lib/types/project";

const ICONS: Record<string, LucideIcon> = { PenTool, Search };

interface Sortable {
  sort_order: number | null;
}

function byOrder(a: Sortable, b: Sortable): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}

// Helper bilingual — eksplisit, bukan akses dinamis.
function metaLabel(row: ProjectMeta, language: Language): string {
  return language === "id" ? row.label_id : row.label_en;
}

function metaValue(row: ProjectMeta, language: Language): string {
  return (language === "id" ? row.value_id : row.value_en) ?? "";
}

function sectionTitle(section: ProjectSection, language: Language): string {
  return language === "id" ? section.title_id : section.title_en;
}

function blockContent(block: ProjectBlock, language: Language): string {
  return (language === "id" ? block.content_id : block.content_en) ?? "";
}

// ======================================================
//  META
// ======================================================

export function mapMetaRows(
  data: ProjectDetailResponse,
  language: Language,
): MetaRow[] {
  return [...data.meta].sort(byOrder).map((row) => ({
    label: metaLabel(row, language),
    value: row.badges.length === 0 ? metaValue(row, language) : undefined,
    badges:
      row.badges.length > 0
        ? [...row.badges].sort(byOrder).map((badge) => ({
            label: badge.label,
            icon: badge.icon ? ICONS[badge.icon] : undefined,
            iconColor: badge.icon_color ?? undefined,
          }))
        : undefined,
  }));
}

// ======================================================
//  SECTIONS
// ======================================================

export interface GroupedItem {
  id: string;
  /** `null` = blok pembuka sebelum heading pertama (tanpa judul). */
  label: string | null;
  blocks: ProjectBlock[];
}

export interface GroupedSection {
  id: string;
  title: string;
  items: GroupedItem[];
}

export function groupSections(
  data: ProjectDetailResponse,
  language: Language,
): GroupedSection[] {
  return [...data.sections].sort(byOrder).map((section) => {
    const items: GroupedItem[] = [];
    let current: GroupedItem | null = null;

    for (const block of [...section.blocks].sort(byOrder)) {
      if (block.type === "heading") {
        current = {
          id: block.id,
          label: blockContent(block, language),
          blocks: [],
        };
        items.push(current);
        continue;
      }

      if (current === null) {
        current = {
          id: `${section.id}-intro`,
          label: null,
          blocks: [],
        };
        items.push(current);
      }

      current.blocks.push(block);
    }

    return {
      id: section.id,
      title: sectionTitle(section, language),
      items,
    };
  });
}

// ======================================================
//  SIDEBAR
// ======================================================

export function mapSidebar(sections: GroupedSection[]): SidebarSection[] {
  return sections.map((section) => {
    const items: SidebarLink[] = [];

    for (const item of section.items) {
      if (!item.label) continue;
      items.push({ id: item.id, label: item.label });
    }

    return {
      id: section.id,
      label: section.title,
      defaultOpen: true,
      items,
    };
  });
}