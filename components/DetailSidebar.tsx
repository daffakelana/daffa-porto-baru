"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { House, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import Sheet from "@/components/Sheet";

export interface SidebarLink {
  id: string;
  label: string;
  href?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarLink[];
  defaultOpen?: boolean;
}

interface DetailSidebarProps {
  sections?: SidebarSection[];
  activeItemId?: string;
  onItemSelect?: (section: SidebarSection) => void;
  backHref?: string;
  className?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const DEFAULT_SECTIONS: SidebarSection[] = [
  { id: "design-process", label: "Design Process", items: [] },
  { id: "challenges", label: "Challenges", items: [] },
  { id: "resume", label: "Resume", items: [] },
];

export function DetailSidebar({
  sections,
  activeItemId,
  onItemSelect,
  backHref = "/",
  className,
  collapsed,
  onCollapsedChange,
}: DetailSidebarProps) {
  const { t } = useLanguage();
  const data = sections && sections.length > 0 ? sections : DEFAULT_SECTIONS;

  const isCollapsed = collapsed ?? false;
  const toggleCollapsed = () => onCollapsedChange?.(!isCollapsed);

  const firstId = useMemo(() => data[0]?.id, [data]);

  const [internalActive, setInternalActive] = useState<string | undefined>(
    firstId,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeId = activeItemId ?? internalActive;

  const scrollToId = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const handleSelect = (
    e: React.MouseEvent<HTMLAnchorElement>,
    section: SidebarSection,
  ) => {
    if (activeItemId === undefined) setInternalActive(section.id);
    onItemSelect?.(section);

    if (!document.getElementById(section.id)) return;
    e.preventDefault();

    if (sheetOpen) {
      setSheetOpen(false);
      window.setTimeout(() => scrollToId(section.id), 320);
    } else {
      scrollToId(section.id);
    }
  };

  useEffect(() => {
    if (activeItemId !== undefined || typeof window === "undefined") return;

    const targets = data
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setInternalActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data, activeItemId]);

const sectionTree = (
  <ul className="flex flex-col gap-0.5">
    {data.map((section) => {
      const isActive = section.id === activeId;
      return (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            onClick={(e) => handleSelect(e, section)}
            className={cn(
              "block truncate rounded-sm px-2 py-1.5 text-left label-3 transition-colors",
              isActive
                ? "bg-[var(--background-color-hover)]"
                : "text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)] hover:text-[var(--text-color-default)]",
            )}
          >
            {section.label}
          </a>
        </li>
      );
    })}
  </ul>
);
  return (
    <>
      <div className="flex md:hidden items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label={t.detail.content}
          title={t.detail.content}
          className="grid place-items-center rounded-sm border p-1.5 text-[var(--text-color-secondary)] transition-colors hover:bg-[var(--background-color-hover)]"
          style={{
            borderColor: "var(--divider-color)",
            backgroundColor: "var(--background-color-white)",
          }}
        >
          <PanelLeft size={18} />
        </button>
        <Link
          href={backHref}
          aria-label={t.status.backToHome}
          title={t.status.backToHome}
          className="grid place-items-center rounded-sm border px-2 py-1 transition-colors hover:bg-[var(--background-color-hover)]"
          style={{
            borderColor: "var(--divider-color)",
            backgroundColor: "var(--background-color-white)",
          }}
        >
          <House size={18} color="var(--primary-base)" />
        </Link>
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        ariaLabel={t.detail.content}
      >
        <nav aria-label={t.detail.content} className="w-full flex flex-col gap-3">
          <span className="label-2 text-[var(--text-color-tertiary)]">
            {t.detail.content}
          </span>
          {sectionTree}
        </nav>
      </Sheet>

      {isCollapsed ? (
        <nav
          aria-label={t.detail.content}
          className={cn("hidden md:flex w-full flex-col", className)}
        >
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={false}
            aria-label={t.detail.expandSidebar}
            title={t.detail.expandSidebar}
            className="grid place-items-center rounded-sm border p-1 text-[var(--text-color-secondary)] transition-colors hover:bg-[var(--background-color-hover)]"
            style={{ borderColor: "var(--divider-color)" }}
          >
            <PanelLeft size={16} />
          </button>
        </nav>
      ) : (
        <nav
          aria-label={t.detail.content}
          className={cn("hidden md:flex w-full flex-col gap-4", className)}
        >
          <Link
            href={backHref}
            className="inline-flex w-full justify-center items-center gap-1.5 rounded-sm border px-2 py-1.5 label-3 text-[var(--text-color-default)] transition-colors hover:bg-[var(--background-color-hover)]"
            style={{
              borderColor: "var(--divider-color)",
              backgroundColor: "var(--background-color-white)",
            }}
          >
            <House size={14} color="var(--primary-base)" />
            {t.status.backToHome}
          </Link>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="label-3 text-[var(--text-color-secondary)]">
                {t.detail.content}
              </span>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-expanded={true}
                aria-label={t.detail.collapseSidebar}
                title={t.detail.collapseSidebar}
                className="grid place-items-center rounded-sm border p-1 text-[var(--text-color-secondary)] transition-colors hover:bg-[var(--background-color-hover)]"
                style={{ borderColor: "var(--divider-color)" }}
              >
                <PanelLeft size={16} />
              </button>
            </div>

            {sectionTree}
          </div>
        </nav>
      )}
    </>
  );
}

export default DetailSidebar;