"use client";

import { Button } from "@/components/Button";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-(--background-color-white)">
      <section id="hero-section" className="w-full max-w-[1200px] pt-7">
        <div className="content-hero flex flex-col md:flex-row items-center gap-8">
          {/* Headline */}
          <div className="headline flex flex-col gap-11 w-full md:w-auto">
            <div className="flex flex-col gap-6 w-full">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-2 py-1 rounded"
                style={{
                  background: "var(--background-color-default)",
                  border: "1px solid var(--divider-color)",
                }}
              >
                <span className="label-3">
                  {t.hero.badge}
                </span>
                <span className="text-sm">🇮🇩</span>
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-3">
                <p className="display-3 text-[var(--text-color-tertiary)]">
                  {t.hero.headingIntro}{" "}
                  <span className="text-[var(--primary-base)]">
                    {t.hero.landingPages}
                  </span>
                  ,{" "}
                  <span className="text-[var(--text-color-default)]">
                    {t.hero.webApps}
                  </span>
                  ,{" "}
                  <span className="underline text-[var(--primary-base)]">
                    {t.hero.mobileApps}
                  </span>
                  , <span className="text-[var(--primary-base)]">{t.hero.and}</span>{" "}
                  <span className="text-[var(--text-color-default)]">
                    {t.hero.creativeDesign}
                  </span>
                  .
                </p>
                <p className="body-1 text-[var(--text-color-secondary)] max-w-[482px]">
                  {t.hero.subtitle}
                </p>
              </div>
            </div>

            <Button>{t.hero.cta}</Button>
          </div>

          {/* Hero Image */}
          <div className="hero-image w-full md:w-[483px] h-[528px] flex items-center justify-center">
            <img
              src="/images/hero-image.png"
              alt="Preview of Daffa's work - two mobile app designs"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
