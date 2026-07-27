"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/admin/form";

export interface PickerMedia {
  id: string;
  public_url: string;
  filename: string;
  alt_en: string | null;
}

interface Props {
  projectId: string;
  media: PickerMedia[];
  currentId: string | null;
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}

export function CoverPicker({ projectId, media, currentId, action }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );
  const [selected, setSelected] = useState<string | null>(currentId);
  const [open, setOpen] = useState(false);

  const current = media.find((m) => m.id === selected) ?? null;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="media_id" value={selected ?? ""} />

      <div className="flex items-center gap-4">
        <div className="h-24 w-32 overflow-hidden rounded-lg border border-[var(--divider-color)] bg-[var(--background-color-default)]">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.public_url} alt={current.alt_en ?? ""}
              className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center label-3 text-[var(--text-color-tertiary)]">
              Belum ada
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => setOpen((o) => !o)}
            className="w-fit rounded-md border px-3 py-1.5 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)]">
            {open ? "Tutup galeri" : "Pilih dari galeri"}
          </button>
          {selected && (
            <button type="button" onClick={() => setSelected(null)}
              className="w-fit label-3 text-red-600 hover:underline">
              Hapus cover
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-3 gap-2 rounded-lg border p-2 border-[var(--divider-color)] sm:grid-cols-4 md:grid-cols-6">
          {media.length === 0 && (
            <p className="body-1 col-span-full p-2 text-[var(--text-color-tertiary)]">
              Belum ada media. Upload dulu di menu Media.
            </p>
          )}
          {media.map((m) => (
            <button key={m.id} type="button"
              onClick={() => { setSelected(m.id); setOpen(false); }}
              className="aspect-square overflow-hidden rounded-md border-2 transition-colors"
              style={{ borderColor: selected === m.id ? "var(--primary-base)" : "transparent" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.public_url} alt={m.alt_en ?? m.filename}
                className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {state.error && <p className="body-1 text-red-600">{state.error}</p>}
      {state.ok && <p className="body-1 text-[var(--primary-base)]">Cover tersimpan.</p>}

      <button type="submit" disabled={pending}
        className="w-fit rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50">
        {pending ? "Menyimpan…" : "Simpan cover"}
      </button>
    </form>
  );
}

export default CoverPicker;