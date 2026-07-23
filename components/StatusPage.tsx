"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useLanguage } from "@/components/LanguageProvider";

type StatusVariant = "not-found" | "coming-soon";

const illustration: Record<StatusVariant, string> = {
  "not-found": "/images/illust-not-found.svg",
  "coming-soon": "/images/illust-coming-soon.svg",
};

export function StatusPage({ variant }: { variant: StatusVariant }) {
  const { t } = useLanguage();
  const content = variant === "not-found" ? t.status.notFound : t.status.comingSoon;

  return (
    <section className="flex flex-1  pt flex-col w-full h-screen items-center justify-center gap-8 px-6 py-24 text-center bg-(--background-color-white)">
      <div className="container flex flex-col justify-center items-center gap-6">
        <img
          src={illustration[variant]}
          alt=""
          className="w-full max-w-[260px]"
        />
        <div className="bottom-section flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 max-w-[420px]">
            <h1 className="headline-1 text-[var(--text-color-default)]">
              {content.title}
            </h1>
            <p className="body-1 text-[var(--text-color-secondary)]">
              {content.description}
            </p>
          </div>

          <Link href="/">
            <Button>{t.status.backToHome}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
