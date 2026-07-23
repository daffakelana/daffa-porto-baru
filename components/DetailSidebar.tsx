"use client";

// Sidebar navigasi untuk halaman detail (case study).
// Fully data-driven: cukup oper `sections` dari API—komponen ini tidak
// menyimpan konten apa pun secara hardcode selain default mock untuk preview.
// Dropdown tiap section dianimasikan dengan Framer Motion (paket `motion`).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { House, ChevronDown, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import Sheet from "@/components/Sheet";

// ======================================================
//  TYPES (bentuk data yang diharapkan dari API)
// ======================================================

export interface SidebarLink {
  id: string;
  label: string;
  /** Anchor tujuan; default `#${id}` bila tidak diisi. */
  href?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarLink[];
  /** Buka otomatis saat pertama render. */
  defaultOpen?: boolean;
}

interface DetailSidebarProps {
  /** Sumber data. Bila kosong, memakai mock default untuk preview. */
  sections?: SidebarSection[];
  /** Item aktif (controlled). Bila diisi, mengalahkan scroll-spy internal. */
  activeItemId?: string;
  onItemSelect?: (item: SidebarLink, section: SidebarSection) => void;
  backHref?: string;
  className?: string;
  /** Status lipat sidebar (controlled). Bila diisi, dikontrol parent. */
  collapsed?: boolean;
  /** Dipanggil saat tombol lipat/buka ditekan. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

// ======================================================
//  DEFAULT MOCK — dipakai hanya sebelum API tersedia
// ======================================================

const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    id: "design-process",
    label: "Design Process",
    defaultOpen: true,
    items: [
      { id: "emphatize", label: "Emphatize" },
      { id: "define", label: "Define" },
      { id: "prototype", label: "Prototype" },
    ],
  },
  {
    id: "challenges",
    label: "Challanges",
    items: [
      { id: "problem", label: "Problem" },
      { id: "solution", label: "Solution" },
    ],
  },
  {
    id: "resume",
    label: "Resume",
    items: [
      { id: "summary", label: "Summary" },
      { id: "impact", label: "Impact" },
    ],
  },
];

const resolveHref = (item: SidebarLink) => item.href ?? `#${item.id}`;

// ======================================================
//  COMPONENT
// ======================================================

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

  // Status lipat sidebar: controlled bila `collapsed` diisi, selain itu internal.
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const toggleCollapsed = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const firstItemId = useMemo(
    () => data.find((s) => s.items.length > 0)?.items[0]?.id,
    [data],
  );

  // Section mana yang terbuka.
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(data.map((s) => [s.id, s.defaultOpen ?? false])),
  );
  // Item aktif saat uncontrolled.
  const [internalActive, setInternalActive] = useState<string | undefined>(
    firstItemId,
  );
  // Bottom sheet konten untuk tampilan mobile.
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeId = activeItemId ?? internalActive;

  const toggleSection = (id: string) =>
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const scrollToItem = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const handleSelect = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: SidebarLink,
    section: SidebarSection,
  ) => {
    if (activeItemId === undefined) setInternalActive(item.id);
    onItemSelect?.(item, section);

    // Hanya intercept anchor dalam halaman (#id) untuk smooth scroll.
    const isAnchor = resolveHref(item).startsWith("#");
    if (!isAnchor || !document.getElementById(item.id)) return;
    e.preventDefault();

    if (sheetOpen) {
      // Tutup sheet dulu, lalu gulir setelah scroll-lock body lepas.
      setSheetOpen(false);
      window.setTimeout(() => scrollToItem(item.id), 320);
    } else {
      scrollToItem(item.id);
    }
  };

  // Scroll-spy: sorot item sesuai section yang sedang terlihat di layar.
  // Non-aktif saat komponen dikontrol dari luar (activeItemId diisi).
  useEffect(() => {
    if (activeItemId !== undefined || typeof window === "undefined") return;

    const ids = data.flatMap((s) => s.items.map((i) => i.id));
    const targets = ids
      .map((id) => document.getElementById(id))
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

  // Pohon section — dipakai ulang oleh sidebar desktop & bottom sheet mobile.
  const sectionTree = (
    <ul className="flex flex-col gap-0.5">
      {data.map((section) => {
        const open = openMap[section.id] ?? false;
        // "Active" (sorotan seperti hover) mengikuti bagian yang sedang
        // dibaca—bukan sekadar section yang sedang dibuka.
        const sectionActive = section.items.some((i) => i.id === activeId);
        return (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              aria-expanded={open}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1 label-3 text-[var(--text-color-default)] transition-colors hover:bg-[var(--background-color-hover)]",
                sectionActive && "bg-[var(--background-color-hover)]",
              )}
            >
              <span>{section.label}</span>
              <motion.span
                aria-hidden="true"
                className="inline-flex"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown
                  size={16}
                  className="text-[var(--text-color-tertiary)]"
                />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && section.items.length > 0 && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-0.5 pt-1">
                    {section.items.map((item) => {
                      const isActive = item.id === activeId;
                      return (
                        <li key={item.id}>
                          <a
                            href={resolveHref(item)}
                            aria-current={isActive ? "true" : undefined}
                            onClick={(e) => handleSelect(e, item, section)}
                            className={cn(
                              "block rounded-sm py-1 pl-4 pr-2 label-3 transition-colors",
                              isActive
                                ? "text-[var(--primary-base)]"
                                : "text-[var(--text-color-tertiary)] hover:text-[var(--text-color-default)]",
                            )}
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* ====================================================
          MOBILE — toolbar ringkas; pohon konten tampil di sheet.
      ==================================================== */}
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
        <nav
          aria-label={t.detail.content}
          className="w-full flex flex-col gap-3"
        >
          <span className="label-2 text-[var(--text-color-tertiary)]">
            {t.detail.content}
          </span>
          {sectionTree}
        </nav>
      </Sheet>

      {/* ====================================================
          DESKTOP — sidebar rail (bisa dilipat).
      ==================================================== */}
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
          {/* Back to Home */}
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

          {/* Content header */}
          <div className="content-mapping flex flex-col gap-2">
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
