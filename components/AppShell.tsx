import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[var(--background-color-default)] ">
      <div
        className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col md:px-0 px-4
                   bg-[var(--background-color-white)]
                   border-x border-[var(--divider-color)]"
      >
        {children}
      </div>
    </div>
  );
}

export default AppShell;