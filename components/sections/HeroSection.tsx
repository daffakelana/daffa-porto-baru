"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useLanguage } from "@/components/LanguageProvider";

type HeroWordKey = "landingPages" | "webApps" | "mobileApps" | "creativeDesign";

// Urutan auto-cycle. Ganti `image` per kata saat asetnya sudah siap.
const HERO_WORDS: HeroWordKey[] = [
  "landingPages",
  "webApps",
  "mobileApps",
  "creativeDesign",
];

const CYCLE_INTERVAL_MS = 2000;

const heroWordConfig: Record<
  HeroWordKey,
  { activeClass: string; image: string }
> = {
  landingPages: {
    activeClass: "text-emerald-700",
    image: "/images/hero-image.png",
  },
  webApps: {
    activeClass: "text-sky-700",
    image: "/images/dashboard.png",
  },
  mobileApps: {
    activeClass: "text-violet-700",
    image: "/images/hero-image.png",
  },
  creativeDesign: {
    activeClass: "text-amber-700",
    image: "/images/hero-image.png",
  },
};

export function HeroSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_WORDS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const activeWord = HERO_WORDS[activeIndex];
  const heroImage = heroWordConfig[activeWord].image;

  const wordProps = (word: HeroWordKey) => ({
    onMouseEnter: () => {
      setActiveIndex(HERO_WORDS.indexOf(word));
      setPaused(true);
    },
    onMouseLeave: () => setPaused(false),
    className: `cursor-default transition-colors duration-300 ${
      activeWord === word
        ? `underline ${heroWordConfig[word].activeClass}`
        : "text-[var(--text-color-tertiary)]"
    }`,
  });

  return (
    <section id="hero-section" className="w-full max-w-[1200px] pt-[90px] md:pt-[78px] border-b border-(--divider-color) border-dashed">
      <div className="content-hero flex flex-col md:flex-row items-center gap-8 max-w-[995px] mx-auto">
        {/* Headline */}
        <div className="headline flex flex-col gap-11 w-full md:w-auto max-w-[482px]">
          <div className="flex flex-col gap-6 w-full">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-2 py-1 rounded w-fit"
              style={{
                background: "var(--background-color-default)",
                border: "1px  solid var(--divider-color)",
              }}
            >
              <span className="label-3">
                {t.hero.badge}
              </span>
              <img src="/images/indonesia.svg" alt="" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-3 font-normal">
              <p className="display-3 text-[var(--text-color-tertiary)]">
                {t.hero.headingIntro}{" "}
                <span {...wordProps("landingPages")}>
                  {t.hero.landingPages}
                </span>
                ,{" "}
                <span {...wordProps("webApps")}>{t.hero.webApps}</span>
                ,{" "}
                <span {...wordProps("mobileApps")}>{t.hero.mobileApps}</span>
                , {t.hero.and}{" "}
                <span {...wordProps("creativeDesign")}>
                  {t.hero.creativeDesign}
                </span>
                .
              </p>
              <p className="body-1 text-[var(--text-color-secondary)] max-w-[482px]">
                {t.hero.subtitle}
              </p>
            </div>
          </div>

          <Button className="w-fit">{t.hero.cta}</Button>
        </div>

        {/* Hero Image */}
        <div className="hero-image relative h-[528px] w-full  md:w-[483px]">
          <img
            src={heroImage}
            alt="Preview of Daffa's work - two mobile app designs"
            className="absolute left-0 top-0 h-full w-auto max-w-none object-contain transition-opacity duration-300"
          />
        </div>
      </div>
    </section>
  );
}
