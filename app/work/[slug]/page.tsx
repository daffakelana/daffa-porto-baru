import { Fragment } from "react";
import { notFound } from "next/navigation";

import { cn } from "@/lib/utils";

import { DetailHeader } from "@/components/DetailHeader";
import { DetailSidebar } from "@/components/DetailSidebar";

import { getProject } from "@/lib/api/project";
import {
  groupSections,
  mapMetaRows,
  mapSidebar,
} from "@/lib/project-detail";

export const dynamic = "force-dynamic";

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

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const project = await getProject(slug);

  console.log("===== PROJECT DETAIL =====");
  console.dir(project, { depth: null });

  if (!project.project) {
    notFound();
  }

  const meta = mapMetaRows(project, "en");

  const groupedSections = groupSections(project, "en");

  const sidebarSections = mapSidebar(groupedSections);

  return (
  <main className="min-h-screen w-full bg-(--background-color-white) pt-12">
  <div className="flex w-full flex-col md:flex-row">

    {/* Sidebar */}
    <aside
      className={cn(
        "w-full shrink-0 md:w-[195px] md:border-r border-(--divider-color) bg-(--background-color-default)"
      )}
    >
      <div className="fixed w-full border-y border-(--divider-color) bg-(--background-color-default) px-3 py-2 md:sticky md:top-[48px] md:border-b-0 md:pt-3 md:pb-8">
        <DetailSidebar sections={sidebarSections} />
      </div>
    </aside>

    {/* Content */}
    <div className="w-full pt-[93px] md:pt-[56px] py-8">

      <div className="container mx-auto flex max-w-[595px] flex-col gap-12 px-4 md:px-0">

        <DetailHeader
          title={project.project.title_en}
          meta={meta}
        />

        <svg
          aria-hidden="true"
          className="w-full"
          height="2"
        >
          <line
            x1="0"
            y1="1"
            x2="100%"
            y2="1"
            stroke="var(--divider-color)"
            strokeWidth="1"
          />
        </svg>

        <div className="flex flex-col gap-12">

          {groupedSections.map((section, index) => (
            <Fragment key={section.id}>

              {index > 0 && <SectionDivider />}

              <section
                id={section.id}
                className="flex flex-col gap-8 scroll-mt-28"
              >

                <h2 className="headline-2-5 text-[var(--text-color-tertiary)]">
                  {section.title}
                </h2>

                <div className="flex flex-col gap-8">

                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      id={item.id}
                      className="flex flex-col gap-6 scroll-mt-28"
                    >

                      <h3 className="headline-2 text-[var(--text-color-default)]">
                        {item.label}
                      </h3>

                      {/* BLOCKS */}
                        {item.blocks.map((block) => {
                            if (block.type === "paragraph") {
                              return (
                                <p
                                  key={block.id}
                                  className="body-1 text-[var(--text-color-secondary)]"
                                >
                                  {block.content_en}
                                </p>
                              );
                            }
                            if (block.type === "image") {
                              return (
                                <figure
                                  key={block.id}
                                  className="flex flex-col gap-3"
                                >
                                  {block.media?.public_url ? (
                                    <img
                                        src={block.media.public_url}
                                        alt={block.media.alt_en ?? ""}
                                        className="w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="h-[320px] w-full rounded-2xl bg-[var(--background-color-default)]" />
                                )}
                                  {block.caption_en && (
                                    <figcaption className="label-3 text-[var(--text-color-tertiary)]">
                                      {block.caption_en}
                                    </figcaption>
                                  )}
                                </figure>
                              );
                            }
                            return null;
                        })}
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