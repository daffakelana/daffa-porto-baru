"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/session-actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--background-color-default)] px-4">
      <form
        action={action}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border p-6 bg-[var(--background-color-white)] border-[var(--divider-color)]"
      >
        <h1 className="headline-2 text-[var(--text-color-default)]">Admin</h1>
        <label className="flex flex-col gap-1.5">
          <span className="label-3 text-[var(--text-color-secondary)]">Password</span>
          <input
            name="password"
            type="password"
            autoFocus
            className="w-full rounded-md border px-3 py-2 body-1 bg-[var(--background-color-white)] border-[var(--divider-color)] outline-none focus:border-[var(--primary-base)]"
          />
        </label>

        {state.error && <p className="body-1 text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--primary-base)] px-4 py-2 label-3 text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
        >
          {pending ? "Masuk…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}