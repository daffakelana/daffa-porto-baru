"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/admin/form";

export interface CollectionOption {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
}

interface Props {
  projectId: string;
  collections: CollectionOption[];
  initialIds: string[];
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}

export function ProjectCollections({
  projectId,
  collections,
  initialIds,
  action,
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(initialIds));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="project_id" value={projectId} />
      <input
        type="hidden"
        name="collection_ids"
        value={Array.from(selected).join(",")}
      />

      {collections.length === 0 ? (
        <p className="body-1 text-[var(--text-color-tertiary)]">
          Belum ada collection. Buat dulu di menu Collections.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {collections.map((c) => {
            const checked = selected.has(c.id);
            return (
              <label
                key={c.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]"
                style={
                  checked
                    ? { borderColor: "var(--primary-base)" }
                    : undefined
                }
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(c.id)}
                  />
                  <span className="body-1 text-[var(--text-color-default)]">
                    {c.name}
                    {c.is_default && (
                      <span className="label-3 text-[var(--text-color-tertiary)]">
                        {" "}
                        · default
                      </span>
                    )}
                  </span>
                </span>
                <span className="label-3 text-[var(--text-color-tertiary)]">
                  {c.is_default ? "/" : `/${c.slug}`}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {state.error && <p className="body-1 text-red-600">{state.error}</p>}
      {state.ok && (
        <p className="body-1 text-[var(--primary-base)]">Keanggotaan tersimpan.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
      >
        {pending ? "Menyimpan…" : "Simpan collection"}
      </button>
    </form>
  );
}

export default ProjectCollections;