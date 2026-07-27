"use client";

import { useActionState, useMemo, useState } from "react";
import type { FormState } from "@/lib/admin/form";

export interface MemberProject {
  id: string;
  title_en: string;
  slug: string;
  status: string;
}

interface Props {
  collectionId: string;
  allProjects: MemberProject[];
  initialMemberIds: string[];
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}

export function MemberEditor({
  collectionId,
  allProjects,
  initialMemberIds,
  action,
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  // Urutan terpilih (array id). Sisanya jadi kandidat.
  const [selected, setSelected] = useState<string[]>(initialMemberIds);

  const byId = useMemo(
    () => new Map(allProjects.map((p) => [p.id, p])),
    [allProjects],
  );

  const available = allProjects.filter((p) => !selected.includes(p.id));

  const add = (id: string) => setSelected((s) => [...s, id]);
  const remove = (id: string) =>
    setSelected((s) => s.filter((x) => x !== id));

  const move = (index: number, dir: -1 | 1) =>
    setSelected((s) => {
      const next = [...s];
      const target = index + dir;
      if (target < 0 || target >= next.length) return s;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="collection_id" value={collectionId} />
      <input type="hidden" name="order" value={selected.join(",")} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Terpilih */}
        <div className="flex flex-col gap-2">
          <span className="label-3 text-[var(--text-color-secondary)]">
            Dalam koleksi ({selected.length})
          </span>
          <div className="flex flex-col gap-1.5">
            {selected.length === 0 && (
              <p className="body-1 text-[var(--text-color-tertiary)]">
                Belum ada project.
              </p>
            )}
            {selected.map((id, i) => {
              const p = byId.get(id);
              if (!p) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 border-[var(--divider-color)] bg-[var(--background-color-white)]"
                >
                  <span className="body-1 truncate text-[var(--text-color-default)]">
                    <span className="label-3 text-[var(--text-color-tertiary)]">
                      {i + 1}.
                    </span>{" "}
                    {p.title_en}
                    {p.status !== "published" && (
                      <span className="label-3 text-[var(--text-color-tertiary)]">
                        {" "}
                        ({p.status})
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      className="rounded border px-1.5 label-3 border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      className="rounded border px-1.5 label-3 border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(id)}
                      className="rounded border px-1.5 label-3 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      ×
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tersedia */}
        <div className="flex flex-col gap-2">
          <span className="label-3 text-[var(--text-color-secondary)]">
            Tersedia ({available.length})
          </span>
          <div className="flex flex-col gap-1.5">
            {available.length === 0 && (
              <p className="body-1 text-[var(--text-color-tertiary)]">
                Semua project sudah masuk.
              </p>
            )}
            {available.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p.id)}
                className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]"
              >
                <span className="body-1 truncate text-[var(--text-color-default)]">
                  {p.title_en}
                  {p.status !== "published" && (
                    <span className="label-3 text-[var(--text-color-tertiary)]">
                      {" "}
                      ({p.status})
                    </span>
                  )}
                </span>
                <span className="label-3 text-[var(--primary-base)]">+ tambah</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.error && <p className="body-1 text-red-600">{state.error}</p>}
      {state.ok && (
        <p className="body-1 text-[var(--primary-base)]">Keanggotaan tersimpan.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
      >
        {pending ? "Menyimpan…" : "Simpan keanggotaan"}
      </button>
    </form>
  );
}

export default MemberEditor;