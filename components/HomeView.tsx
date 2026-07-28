"use client";

import { useMemo } from "react";

import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { useLanguage } from "@/components/LanguageProvider";
import { mapCollectionIntro } from "@/lib/homepage";
import type { HomepageResponse } from "@/lib/types/homepage";

interface HomeViewProps {
  data: HomepageResponse;
}

export function HomeView({ data }: HomeViewProps) {
  const { language } = useLanguage();

  const intro = useMemo(
    () => mapCollectionIntro(data.collection, language),
    [data.collection, language],
  );

  const isCustom = !data.collection.is_default;

  return (
    <main className="flex w-full flex-col items-center bg-(--background-color-white) overflow-hidden ">
      <div className="sub-container flex flex-col md:w-[1200px] px-4 md:border-x border-[var(--divider-color)] border-dashed">


      <HeroSection />

      {/* {isCustom && intro.description && (
        <section className="w-full max-w-[1200px] px-4 pt-8 md:px-0">
          <div className="mx-auto flex max-w-[995px] flex-col gap-2">
            <span className="label-2 text-[var(--text-color-tertiary)]">
              {intro.name}
            </span>
            <p className="body-1 max-w-[640px] text-[var(--text-color-secondary)]">
              {intro.description}
            </p>
          </div>
        </section>
      )} */}

      <FeaturedWork data={data} />
      </div>
    </main>
  );
}

export default HomeView;