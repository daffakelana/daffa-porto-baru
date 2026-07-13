"use client";

import { ReactNode } from "react";

interface PreferenceRowProps {
  label: string;
  children: ReactNode;
}

export default function PreferenceRow({ label, children }: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between self-stretch">
      <span className="label-2" style={{ color: 'var(--text-color-default)' }}>{label}</span>
      {children}
    </div>
  );
}
