"use client";

import { Fragment, useMemo } from "react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { DetailHeader } from "@/components/DetailHeader";
import { DetailSidebar } from "@/components/DetailSidebar";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { groupSections, mapMetaRows, mapSidebar } from "@/lib/project-detail";
import type { ProjectDetailResponse } from "@/lib/types/project";

interface ProjectDetailViewProps {
  data: ProjectDetailResponse;
}

function SectionDivider() {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className="flex items-center justify-center gap-4"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-[3px] rounded-full bg-[var(--text-color-tertiary)]"
        />
      ))}
    </div>
  );
}

export function ProjectDetailView({ data }: ProjectDetailViewProps) {
  const { language } = useLanguage();

  const meta = useMemo(() => mapMetaRows(data, language), [data, language]);

  const sections = useMemo(
    () => groupSections(data, language),
    [data, language],
  );

  const sidebarSections = useMemo(() => mapSidebar(sections), [sections]);

  const title =
    language === "id" ? data.project.title_id : data.project.title_en;

  return (
    <main className="min-h-screen w-full bg-(--background-color-white) pt-12">
      <div className="flex w-full flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-full shrink-0 md:w-[195px] md:border-r border-(--divider-color) bg-(--background-color-default)",
          )}
        >
          <div className="fixed w-full border-y border-(--divider-color) bg-(--background-color-default) px-3 py-2 md:sticky md:top-[48px] md:border-b-0 md:pt-3 md:pb-8">
            <DetailSidebar sections={sidebarSections} />
          </div>
        </aside>

        {/* Content */}
        <div className="w-full py-8 pt-[93px] md:pt-[56px]">
          <div className="container mx-auto flex max-w-[595px] flex-col gap-12 px-4 md:px-0">
            <DetailHeader title={title} meta={meta} />

            <div
              aria-hidden="true"
              className="h-px w-full bg-(--divider-color)"
            />

            <div className="flex flex-col gap-12">
              {sections.map((section, index) => (
                <Fragment key={section.id}>
                  {index > 0 && <SectionDivider />}

                  <section
                    id={section.id}
                    className="flex scroll-mt-28 flex-col gap-8"
                  >
                    <h2 className="headline-2-5 text-[var(--text-color-tertiary)]">
                      {section.title}
                    </h2>

                    <div className="flex flex-col gap-8">
                      {section.items.map((item) => (
                        <article
                          key={item.id}
                          id={item.id}
                          className="flex scroll-mt-28 flex-col gap-6"
                        >
                          {item.label && (
                            <h3 className="headline-2 text-[var(--text-color-default)]">
                              {item.label}
                            </h3>
                          )}

                          {item.blocks.map((block) => (
                            <BlockRenderer
                              key={block.id}
                              block={block}
                              language={language}
                            />
                          ))}
                        </article>
                      ))}
                    </div>
                  </section>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProjectDetailView;