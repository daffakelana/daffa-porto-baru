"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin/form";

type ProjectValues = {
  id?: string;
  slug?: string | null;
  title_en?: string | null;
  title_id?: string | null;
  company?: string | null;
  year?: number | null;
  type_en?: string | null;
  type_id?: string | null;
  description_en?: string | null;
  description_id?: string | null;
  status?: string | null;
  featured?: boolean | null;
  sort_order?: number | null;
};

interface ProjectFormProps {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: ProjectValues;
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
        rows={3}
        defaultValue={defaultValue ?? ""}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

export function ProjectForm({ action, initial, submitLabel }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Judul (EN) *" name="title_en" defaultValue={initial?.title_en} />
        <Field label="Judul (ID)" name="title_id" defaultValue={initial?.title_id} />
        <Field label="Slug (kosong = auto)" name="slug" defaultValue={initial?.slug} />
        <Field label="Company" name="company" defaultValue={initial?.company} />
        <Field label="Type (EN)" name="type_en" defaultValue={initial?.type_en} />
        <Field label="Type (ID)" name="type_id" defaultValue={initial?.type_id} />
        <Field label="Tahun" name="year" type="number" defaultValue={initial?.year} />
        <Field label="Urutan" name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} />
      </div>

      <TextArea label="Deskripsi (EN)" name="description_en" defaultValue={initial?.description_en} />
      <TextArea label="Deskripsi (ID)" name="description_id" defaultValue={initial?.description_id} />

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Status</span>
          <select
            name="status"
            defaultValue={initial?.status ?? "draft"}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={Boolean(initial?.featured)}
          />
          <span className="body-1 text-[var(--text-color-default)]">Featured</span>
        </label>
      </div>

      {state.error && (
        <p className="body-1 text-red-600">{state.error}</p>
      )}
      {state.ok && (
        <p className="body-1 text-[var(--primary-base)]">Tersimpan.</p>
      )}

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

export default ProjectForm;