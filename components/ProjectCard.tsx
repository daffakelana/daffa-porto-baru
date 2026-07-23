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
  return (
    <article className="flex flex-col md:flex-row items-stretch gap-6 md:gap-10 w-full max-w-[790px] mx-auto">
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
          
          <div className="title flex flex-col gap-2">
            {/* Title */}
            <h3 className="headline-1  text-[var(--text-color-default)]">{title}</h3>

            {/* Description */}
            <p className="body-1 text-[var(--text-color-secondary)]">
              {description}
            </p>
          </div>
        </div>

        {href ? (
          <a href={href} className="w-fit">
            <Button>{readMoreLabel}</Button>
          </a>
        ) : (
          <Button className="w-fit">{readMoreLabel}</Button>
        )}
      </div>

      {/* Image */}
      <div className="order-1 md:order-2 w-full md:max-w-[380px] h-[450px] overflow-hidden rounded-2xl bg-[var(--background-color-default)]">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </article>
  );
}
