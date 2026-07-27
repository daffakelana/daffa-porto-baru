"use client";

import { useActionState, useRef, useState } from "react";
import type { FormState } from "@/lib/admin/form";

interface Props {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}

const inputClass =
  "w-full rounded-md border px-3 py-2 body-1 bg-[var(--background-color-white)] text-[var(--text-color-default)] border-[var(--divider-color)] outline-none focus:border-[var(--primary-base)]";

export function MediaUploader({ action }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setDims(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  };

  // Reset form setelah sukses.
  if (state.ok && formRef.current) {
    formRef.current.reset();
    // hapus preview di render berikutnya tanpa loop
    queueMicrotask(() => {
      setPreview(null);
      setDims(null);
    });
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border p-4 border-[var(--divider-color)] bg-[var(--background-color-white)]"
    >
      <span className="label-2 text-[var(--text-color-default)]">Upload media</span>

      <input
        name="file"
        type="file"
        accept="image/*"
        onChange={onFile}
        className="body-1 text-[var(--text-color-secondary)]"
      />

      {/* Dimensi diisi otomatis dari gambar */}
      <input type="hidden" name="width" value={dims?.w ?? ""} />
      <input type="hidden" name="height" value={dims?.h ?? ""} />

      {preview && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="h-20 w-20 rounded-md object-cover" />
          {dims && (
            <span className="label-3 text-[var(--text-color-tertiary)]">
              {dims.w} × {dims.h}px
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input name="alt_en" placeholder="Alt text (EN)" className={inputClass} />
        <input name="alt_id" placeholder="Alt text (ID)" className={inputClass} />
      </div>

      {state.error && <p className="body-1 text-red-600">{state.error}</p>}
      {state.ok && <p className="body-1 text-[var(--primary-base)]">Terupload.</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
      >
        {pending ? "Mengunggah…" : "Upload"}
      </button>
    </form>
  );
}

export default MediaUploader;