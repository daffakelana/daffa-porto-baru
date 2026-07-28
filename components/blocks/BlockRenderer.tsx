"use client";

import type { Language } from "@/lib/i18n";
import type { ProjectBlock } from "@/lib/types/project";

interface BlockProps {
  block: ProjectBlock;
  language: Language;
}

function contentOf(block: ProjectBlock, language: Language): string {
  const raw = language === "id" ? block.content_id : block.content_en;
  return raw?.trim() ?? "";
}

function captionOf(block: ProjectBlock, language: Language): string {
  const raw = language === "id" ? block.caption_id : block.caption_en;
  return raw?.trim() ?? "";
}

function altOf(block: ProjectBlock, language: Language): string {
  if (!block.media) return "";
  const raw = language === "id" ? block.media.alt_id : block.media.alt_en;
  return raw ?? "";
}

function Caption({ text }: { text: string }) {
  if (!text) return null;
  return (
    <figcaption className="label-3 text-[var(--text-color-tertiary)]">
      {text}
    </figcaption>
  );
}

function ParagraphBlock({ block, language }: BlockProps) {
  const html = contentOf(block, language);
  if (!html) return null;
  return (
    <div
      className="body-1 rich-text text-[var(--text-color-secondary)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function QuoteBlock({ block, language }: BlockProps) {
  const html = contentOf(block, language);
  if (!html) return null;

  return (
    <figure
      className="flex flex-col gap-2 border-l-2 pl-4"
      style={{ borderColor: "var(--primary-base)" }}
    >
      <blockquote
        className="body-1 rich-text text-[var(--text-color-default)]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Caption text={captionOf(block, language)} />
    </figure>
  );
}

function ImageBlock({ block, language }: BlockProps) {
  const media = block.media;

  return (
    <figure className="flex flex-col gap-3">
      {media?.public_url ? (
        <img
          src={media.public_url}
          alt={altOf(block, language)}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          loading="lazy"
          className="w-full rounded-xl border object-cover border border-[#BFBFBC]"
        />
      ) : (
        <div className="h-[320px] w-full rounded-2xl bg-[var(--background-color-default)]" />
      )}
      <Caption text={captionOf(block, language)} />
    </figure>
  );
}

function EmbedBlock({ block, language }: BlockProps) {
  if (!block.embed_url) return null;
  const caption = captionOf(block, language);

  return (
    <figure className="flex flex-col gap-3">
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-[var(--background-color-default)]">
        <iframe
          src={block.embed_url}
          title={caption || "Embedded content"}
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
      <Caption text={caption} />
    </figure>
  );
}

export function BlockRenderer({ block, language }: BlockProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block} language={language} />;

    case "image":
      return <ImageBlock block={block} language={language} />;

    case "quote":
      return <QuoteBlock block={block} language={language} />;

    case "video":
    case "embed":
      return <EmbedBlock block={block} language={language} />;

    // `heading` sudah dikonsumsi mapper jadi judul item.
    case "heading":
      return null;

    default:
      return null;
  }
}

export default BlockRenderer;