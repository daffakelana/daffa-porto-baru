"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin/form";

type CollectionValues = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  is_default?: boolean | null;
  status?: string | null;
  sort_order?: number | null;
  description_en?: string | null;
  description_id?: string | null;
  seo_title_en?: string | null;
  seo_title_id?: string | null;
  seo_description_en?: string | null;
  seo_description_id?: string | null;
};

interface Props {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: CollectionValues;
  submitLabel: string;
}

const inputClass =
  "w-full rounded-md border px-3 py-2 body-1 bg-[var(--background-color-white)] text-[var(--text-color-default)] border-[var(--divider-color)] outline-none focus:border-[var(--primary-base)]";
const labelClass = "label-3 text-[var(--text-color-secondary)]";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <textarea
        name={name}
        rows={2}
        defaultValue={defaultValue ?? ""}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

export function CollectionForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Nama *" name="name" defaultValue={initial?.name} />
        <Field label="Slug (kosong = auto)" name="slug" defaultValue={initial?.slug} />
        <Field label="Urutan" name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} />
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Status</span>
          <select name="status" defaultValue={initial?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <TextArea label="Deskripsi (EN)" name="description_en" defaultValue={initial?.description_en} />
      <TextArea label="Deskripsi (ID)" name="description_id" defaultValue={initial?.description_id} />

      <details className="rounded-md border border-[var(--divider-color)] p-3">
        <summary className="label-3 cursor-pointer text-[var(--text-color-secondary)]">
          SEO (opsional)
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="SEO Title (EN)" name="seo_title_en" defaultValue={initial?.seo_title_en} />
          <Field label="SEO Title (ID)" name="seo_title_id" defaultValue={initial?.seo_title_id} />
          <TextArea label="SEO Description (EN)" name="seo_description_en" defaultValue={initial?.seo_description_en} />
          <TextArea label="SEO Description (ID)" name="seo_description_id" defaultValue={initial?.seo_description_id} />
        </div>
      </details>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_default" defaultChecked={Boolean(initial?.is_default)} />
        <span className="body-1 text-[var(--text-color-default)]">
          Jadikan koleksi default (tampil di homepage <code>/</code>)
        </span>
      </label>

      {state.error && <p className="body-1 text-red-600">{state.error}</p>}
      {state.ok && <p className="body-1 text-[var(--primary-base)]">Tersimpan.</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
      >
        {pending ? "Menyimpan…" : submitLabel}
      </button>
    </form>
  );
}

export default CollectionForm;