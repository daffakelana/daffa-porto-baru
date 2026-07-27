"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/admin/form";
import { AVAILABLE_ICONS } from "@/lib/admin/icons";

interface Badge {
  label: string;
  icon: string | null;
  icon_color: string | null;
}
interface Row {
  label_en: string;
  label_id: string;
  value_en: string | null;
  value_id: string | null;
  badges: Badge[];
}

interface Props {
  projectId: string;
  initial: Row[];
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}

const inputClass =
  "w-full rounded-md border px-2 py-1.5 label-3 bg-[var(--background-color-white)] text-[var(--text-color-default)] border-[var(--divider-color)] outline-none focus:border-[var(--primary-base)]";

const emptyRow = (): Row => ({
  label_en: "",
  label_id: "",
  value_en: "",
  value_id: "",
  badges: [],
});

export function MetaEditor({ projectId, initial, action }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );
  const [rows, setRows] = useState<Row[]>(
    initial.length > 0 ? initial : [emptyRow()],
  );

  const patchRow = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const moveRow = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const next = [...rs];
      const t = i + dir;
      if (t < 0 || t >= next.length) return rs;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });

  const removeRow = (i: number) =>
    setRows((rs) => rs.filter((_, idx) => idx !== i));

  const addRow = () => setRows((rs) => [...rs, emptyRow()]);

  const addBadge = (i: number) =>
    patchRow(i, {
      badges: [
        ...rows[i].badges,
        { label: "", icon: null, icon_color: "#8B5CF6" },
      ],
    });

  const patchBadge = (ri: number, bi: number, patch: Partial<Badge>) =>
    patchRow(ri, {
      badges: rows[ri].badges.map((b, idx) =>
        idx === bi ? { ...b, ...patch } : b,
      ),
    });

  const removeBadge = (ri: number, bi: number) =>
    patchRow(ri, {
      badges: rows[ri].badges.filter((_, idx) => idx !== bi),
    });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="payload" value={JSON.stringify(rows)} />

      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-lg border p-3 border-[var(--divider-color)] bg-[var(--background-color-white)]"
          >
            <div className="flex items-center justify-between">
              <span className="label-3 text-[var(--text-color-tertiary)]">
                Baris {i + 1}
              </span>
              <span className="flex items-center gap-1">
                <button type="button" onClick={() => moveRow(i, -1)}
                  className="rounded border px-1.5 label-3 border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]">↑</button>
                <button type="button" onClick={() => moveRow(i, 1)}
                  className="rounded border px-1.5 label-3 border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]">↓</button>
                <button type="button" onClick={() => removeRow(i)}
                  className="rounded border px-1.5 label-3 border-red-300 text-red-600 hover:bg-red-50">×</button>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input className={inputClass} placeholder="Label (EN) — mis. Year"
                value={row.label_en}
                onChange={(e) => patchRow(i, { label_en: e.target.value })} />
              <input className={inputClass} placeholder="Label (ID) — mis. Tahun"
                value={row.label_id}
                onChange={(e) => patchRow(i, { label_id: e.target.value })} />
            </div>

            {row.badges.length === 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} placeholder="Nilai (EN)"
                  value={row.value_en ?? ""}
                  onChange={(e) => patchRow(i, { value_en: e.target.value })} />
                <input className={inputClass} placeholder="Nilai (ID)"
                  value={row.value_id ?? ""}
                  onChange={(e) => patchRow(i, { value_id: e.target.value })} />
              </div>
            ) : (
              <p className="label-3 text-[var(--text-color-tertiary)]">
                Baris ini pakai badge (nilai teks diabaikan).
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-col gap-2">
              {row.badges.map((b, bi) => (
                <div key={bi} className="flex items-center gap-2">
                  <input className={inputClass} placeholder="Label badge"
                    value={b.label}
                    onChange={(e) => patchBadge(i, bi, { label: e.target.value })} />
                  <select className={inputClass} value={b.icon ?? ""}
                    onChange={(e) => patchBadge(i, bi, { icon: e.target.value || null })}>
                    <option value="">(tanpa ikon)</option>
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                  <input type="color" value={b.icon_color ?? "#8B5CF6"}
                    onChange={(e) => patchBadge(i, bi, { icon_color: e.target.value })}
                    className="h-8 w-10 shrink-0 rounded border border-[var(--divider-color)]" />
                  <button type="button" onClick={() => removeBadge(i, bi)}
                    className="rounded border px-1.5 label-3 border-red-300 text-red-600 hover:bg-red-50">×</button>
                </div>
              ))}
              <button type="button" onClick={() => addBadge(i)}
                className="w-fit label-3 text-[var(--primary-base)] hover:underline">
                + tambah badge
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addRow}
        className="w-fit rounded-md border px-3 py-1.5 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)]">
        + tambah baris meta
      </button>

      {state.error && <p className="body-1 text-red-600">{state.error}</p>}
      {state.ok && <p className="body-1 text-[var(--primary-base)]">Meta tersimpan.</p>}

      <button type="submit" disabled={pending}
        className="w-fit rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50">
        {pending ? "Menyimpan…" : "Simpan meta"}
      </button>
    </form>
  );
}

export default MetaEditor;