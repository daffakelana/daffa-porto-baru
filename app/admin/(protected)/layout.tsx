import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { logout } from "@/lib/admin/session-actions";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen w-full bg-[var(--background-color-default)]">
      <header className="border-b border-[var(--divider-color)] bg-[var(--background-color-white)]">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="label-3 text-[var(--text-color-default)]">
              Projects
            </Link>
            <Link href="/admin/collections" className="label-3 text-[var(--text-color-default)]">
            Collections
            </Link>
            <Link href="/admin/media" className="label-3 text-[var(--text-color-default)]">
              Media
            </Link>
          </nav>
          <form action={logout}>
            <button
              type="submit"
              className="label-3 text-[var(--text-color-secondary)] hover:text-[var(--text-color-default)]"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-4 py-8">{children}</main>
    </div>
  );
}