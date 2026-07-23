"use client";

import { Fragment, useEffect, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { useLanguage } from "@/components/LanguageProvider";
import { getHomepage } from "@/lib/api/homepage";
import type { HomepageProject } from "@/lib/types/homepage";

export function FeaturedWork() {
  const { language, t } = useLanguage();

  const [projects, setProjects] = useState<HomepageProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHomepage();
        setProjects(data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section
      id="work-section"
      className="w-full max-w-[1200px] py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-[995px] flex-col gap-16 md:gap-20">
        {projects.map((project, index) => (
          <Fragment key={project.id}>
            {index > 0 && (
              <svg
                aria-hidden="true"
                className="mx-auto w-full max-w-[790px]"
                height="2"
              >
                <line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="var(--divider-color)"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
              </svg>
            )}

            <ProjectCard
              company={project.company}
              type={language === "id" ? project.type_id : project.type_en}
              year={String(project.year)}
              title={language === "id" ? project.title_id : project.title_en}
              description={
                language === "id"
                  ? project.description_id
                  : project.description_en
              }
              readMoreLabel={t.work.readMore}
              href={`/work/${project.slug}`}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
}