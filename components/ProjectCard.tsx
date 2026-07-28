"use client";

import { Button } from "@/components/Button";

interface ProjectCardProps {
  company: string;
  type: string;
  year: string;
  title: string;
  description: string;
  readMoreLabel: string;
  image?: string;
  href?: string;
}

export function ProjectCard({
  company,
  type,
  year,
  title,
  description,
  readMoreLabel,
  image,
  href,
}: ProjectCardProps) {
  const CardInner = (
    <article className="group flex flex-col md:flex-row items-stretch gap-6 md:gap-10 w-full max-w-[790px] mx-auto">
      {/* Content */}
      <div className="order-2 md:order-1 flex flex-1 flex-col justify-between gap-8">
        <div className="flex flex-col gap-4">
          {/* Meta */}
          <p className="label-2 flex flex-wrap items-center gap-2">
            <span className="text-[var(--primary-base)]">{company}</span>
            <span className="text-[var(--text-color-tertiary)]">•</span>
            <span className="text-[var(--text-color-tertiary)]">{type}</span>
            <span className="text-[var(--text-color-tertiary)]">•</span>
            <span className="text-[var(--text-color-tertiary)]">{year}</span>
          </p>

          <div className="title flex flex-col gap-2 ">
            {/* Title — underline menyapu kiri→kanan saat hover kartu */}
            <h3 className="headline-1 w-fit text-[var(--text-color-default)]">
              <span
                className="bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--primary-base), var(--primary-base))",
                }}
              >
                {title}
              </span>
            </h3>

            {/* Description */}
            <p className="body-1 hidden md:block text-[var(--text-color-secondary)]">
              {description}
            </p>
          </div>
        </div>

        <div className="w-fit">
          <Button>{readMoreLabel}</Button>
        </div>
      </div>

      {/* Image — zoom + lift + shadow + shine, semua saat hover kartu */}
      <div className="order-1 md:order-2 w-full md:max-w-[380px] h-[450px]">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[var(--background-color-default)] transition-all duration-500 ease-out group-hover:-translate-y-1 ">
          {image && (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

          {/* Shine sweep */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
            }}
          />
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {CardInner}
      </a>
    );
  }

  return CardInner;
}