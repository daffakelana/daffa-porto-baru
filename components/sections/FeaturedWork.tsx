"use client";

import { Fragment, useMemo } from "react";

import { ProjectCard } from "@/components/ProjectCard";
import { useLanguage } from "@/components/LanguageProvider";
import { mapProjectCards } from "@/lib/homepage";
import type { HomepageResponse } from "@/lib/types/homepage";

interface FeaturedWorkProps {
  data: HomepageResponse;
}

export function FeaturedWork({ data }: FeaturedWorkProps) {
  const { t, language } = useLanguage();

  const cards = useMemo(() => mapProjectCards(data, language), [data, language]);

  if (cards.length === 0) return null;

  return (
    <section id="work-section" className="w-full max-w-[1200px] py-16 md:py-24">
      <div className="mx-auto flex max-w-[995px] flex-col gap-16 md:gap-20">
        {cards.map((card, index) => (
          <Fragment key={card.id}>
            {index > 0 && (
              <div
                aria-hidden="true"
                className="mx-auto w-full max-w-[790px] border-t border-dashed border-(--divider-color)"
              />
            )}

            <ProjectCard
              company={card.company}
              type={card.type}
              year={card.year}
              title={card.title}
              description={card.description}
              image={card.image}
              href={card.href}
              readMoreLabel={t.work.readMore}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default FeaturedWork;