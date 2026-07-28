"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { SectionEditor as SectionEditorType } from "@/components/admin/SectionEditor";

const SectionEditor = dynamic(
  () => import("@/components/admin/SectionEditor").then((m) => m.SectionEditor),
  {
    ssr: false,
    loading: () => (
      <p className="body-1 text-[var(--text-color-tertiary)]">
        Memuat editor…
      </p>
    ),
  },
);

export default function SectionEditorClient(
  props: ComponentProps<typeof SectionEditorType>,
) {
  return <SectionEditor {...props} />;
}