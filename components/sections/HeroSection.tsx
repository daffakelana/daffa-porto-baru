"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wand2 } from "lucide-react";

import { Button } from "@/components/Button";
import { ButtonSecondary } from "@/components/ButtonSecondary";
import { useLanguage } from "@/components/LanguageProvider";

type HeroWordKey = "landingPages" | "webApps" | "mobileApps" | "creativeDesign";

// Urutan kata yang bergantian di headline.
const HERO_WORDS: HeroWordKey[] = [
  "landingPages",
  "webApps",
  "mobileApps",
  "creativeDesign",
];

const CYCLE_INTERVAL_MS = 2000;

export function HeroSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_WORDS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const activeWord = HERO_WORDS[activeIndex];

  return (
    <section
      id="hero-section"
      className="w-full border-b border-(--divider-color)"
    >
      {/* Jarak ke navbar: tinggi navbar + 96px */}
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-[calc(var(--navbar-height)+96px)] md:px-0">
        {/* ============ HEADLINE ============ */}
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex max-w-[720px] flex-col items-center gap-6">
            {/* Badge */}
            <div
              className="inline-flex w-fit items-center gap-2 rounded px-2 py-1"
              style={{
                background: "var(--background-color-default)",
                border: "1px solid var(--divider-color)",
              }}
            >
              <span className="label-3">{t.hero.badge}</span>
              <img src="/images/indonesia.svg" alt="" />
            </div>

            {/* Teks */}
            <div className="flex flex-col gap-4 font-normal">
              <h1 className="display-hero text-[var(--text-color-default)]">
              {/* baris statis */}
              <span className="block">{t.hero.headingIntro}</span>

              {/* baris kata bergantian — tinggi selalu tetap */}
              <span className="block overflow-hidden pb-2 -mb-2">
                <span
                  key={activeWord}
                  className="inline-block underline text-[var(--primary-base)] animate-[hero-word-swipe_400ms_cubic-bezier(0.22,1,0.36,1)]"
                >
                  {t.hero[activeWord]}
                </span>
              </span>
              </h1>
              <p className="body-1 mx-auto max-w-[520px] text-[var(--text-color-secondary)]">
                {t.hero.subtitle}
              </p>
            </div>
          </div>

          {/* ============ ACTIONS ============ */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#work-section">
              <Button>{t.hero.cta}</Button>
            </a>
            <Link href="/creative-space">
              <ButtonSecondary leftIcon={Wand2}>
                {t.nav.creativeSpace}
              </ButtonSecondary>
            </Link>
          </div>
        </div>

        {/* ============ HERO IMAGE ============ */}
        {/* Jarak ke konten atas 86px. Padding 64px atas/kiri/kanan, bawah 0. */}
        <div
          className="mt-[86px] w-full rounded-t-2xl border border-b-0 px-4 pt-8 md:px-16 md:pt-16"
          style={{
            backgroundColor: "var(--background-color-default)",
            borderColor: "var(--divider-color)",
          }}
        >
          <img
            src="/images/hero-image.png"
            alt="Preview of Daffa's work"
            className="h-auto w-full rounded-t-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}