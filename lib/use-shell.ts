"use client";

import { usePathname } from "next/navigation";

/** Route yang memakai shell 1400px (selain ini full-width). */
const SHELL_PREFIXES = ["/work", "/resume", "/blog", "/creative-space"];

export function useShellEnabled(): boolean {
  const pathname = usePathname();

  return SHELL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const SHELL_MAX_WIDTH = 1400;