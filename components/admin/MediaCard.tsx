"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/admin/form";

export interface MediaItem {
  id: string;
  public_url: string;
  filename: string;
  alt_en: string | null;
  alt_id: string | null;
  width: number | null;
  height: number | null;
}

interface Props {
  media: MediaItem;
  updateAction: (prev: FormState, fd: FormData) => Promise<FormState>;
  deleteAction: (fd: FormData) => Promise<void>;
}

const inputClass =
  "w-full rounded border px-2 py-1 label-3 bg-[var(--background-color-white)] text-[var(--text-color-default)] border-[var(--divider-color)] outline-none focus:border-[var(--primary-base)]";

export function MediaCard({ media, updateAction, deleteAction }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    updateAction,
    {},
  );
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(media.public_url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3 border-[var(--divider-color)] bg-[var(--background-color-white)]">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-[var(--background-color-default)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.public_url}
          alt={media.alt_en ?? media.filename}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="label-3 truncate text-[var(--text-color-tertiary)]">
          {media.filename}
          {media.width && media.height ? ` · ${media.width}×${media.height}` : ""}
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded border px-2 py-0.5 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)]"
        >
          {copied ? "Tersalin" : "Salin URL"}
        </button>
      </div>

      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={media.id} />
        <input
          name="alt_en"
          defaultValue={media.alt_en ?? ""}
          placeholder="Alt (EN)"
          className={inputClass}
        />
        <input
          name="alt_id"
          defaultValue={media.alt_id ?? ""}
          placeholder="Alt (ID)"
          className={inputClass}
        />
        <div className="flex items-center justify-between gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded border px-2 py-1 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)] disabled:opacity-50"
          >
            {pending ? "…" : "Simpan alt"}
          </button>
          {state.ok && (
            <span className="label-3 text-[var(--primary-base)]">✓</span>
          )}
          {state.error && (
            <span className="label-3 text-red-600">{state.error}</span>
          )}
        </div>
      </form>

      <form action={deleteAction}>
        <input type="hidden" name="id" value={media.id} />
        <button
          type="submit"
          className="w-full rounded border px-2 py-1 label-3 border-red-300 text-red-600 hover:bg-red-50"
        >
          Hapus
        </button>
      </form>
    </div>
  );
}

export default MediaCard;