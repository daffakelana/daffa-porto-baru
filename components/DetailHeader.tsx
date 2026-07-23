// Header halaman detail (case study / blog): judul + tabel metadata.
// Data-driven—cukup oper `title` dan `meta`. Tiap baris meta bisa berupa
// teks biasa atau daftar badge (mis. role).

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ======================================================
//  TYPES
// ======================================================

export interface MetaBadge {
  label: string;
  icon?: LucideIcon;
  /** Warna ikon; default mengikuti warna teks. */
  iconColor?: string;
}

export interface MetaRow {
  label: string;
  /** Nilai teks sederhana. */
  value?: string;
  /** Atau daftar badge (dipakai bila `value` tidak diisi). */
  badges?: MetaBadge[];
}

interface DetailHeaderProps {
  title: string;
  meta: MetaRow[];
  className?: string;
}

// ======================================================
//  BADGE
// ======================================================

function Badge({ label, icon: Icon, iconColor }: MetaBadge) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm border px-1 py-[2px] label-3 text-[var(--text-color-default)] bg-(--background-color-hover)"
      style={{
        borderColor: "var(--divider-color)",
        backgroundColor: "var(--background-color-hover)",
      }}
    >
      {Icon && <Icon size={14} color={iconColor ?? "currentColor"} />}
      {label}
    </span>
  );
}

// ======================================================
//  COMPONENT
// ======================================================

export function DetailHeader({ title, meta, className }: DetailHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col gap-8", className)}>
      <h1 className="display-2 text-[var(--text-color-default)]">{title}</h1>

      <dl
        className="overflow-hidden rounded-lg border"
        style={{
          borderColor: "var(--divider-color)",
          backgroundColor: "var(--background-color-white)",
        }}
      >
        {meta.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between gap-4 px-4 py-3 bg-(--background-color-default)",
              i > 0 && "border-t",
            )}
            style={i > 0 ? { borderColor: "var(--divider-color)" } : undefined}
          >
            <dt className="paragraph- text-[var(--text-color-tertiary)]">
              {row.label}
            </dt>
            <dd className="flex flex-wrap items-center justify-end gap-2">
              {row.badges && row.badges.length > 0 ? (
                row.badges.map((badge) => (
                  <Badge key={badge.label} {...badge} />
                ))
              ) : (
                <span className="label-3 text-[var(--text-color-default)]">
                  {row.value}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
