"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface MenuItemProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function MenuItem({ href, icon: Icon, label, onClick }: MenuItemProps) {
  const content = (
    <div className="flex items-center justify-between self-stretch">
      <div className="flex items-center gap-[7px]">
        <div
          className="inline-flex items-center gap-[9px] p-2 rounded-lg"
          style={{
            border: '0.9px solid var(--divider-color)'
          }}
        >
          <Icon size={20} style={{ color: 'var(--primary-base)' }} />
        </div>
        <span className="label-2" style={{ color: 'var(--text-color-default)' }}>{label}</span>
      </div>
      <ExternalLink size={20} style={{ color: 'var(--text-color-tertiary)' }} />
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="block"
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button 
      className="block w-full text-left"
      onClick={onClick}
    >
      {content}
    </button>
  );
}
