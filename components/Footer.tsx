"use client";

import { NavItem } from "./NavItem";

export default function Footer() {
  return (
    <footer className="mt-auto w-full py-2 border-t border-[var(--divider-color)] border-x bg-[var(--background-color-default)]">
      <div className="min-w-full mx-auto max-w-[1400px] px-4 md:px-0" >
        <div className="flex flex-row justify-between items-center">
          <p className="label-3 pl-2.5 text-[var(--text-color-secondary)]">
            © 2026 Daffa Putra Pratama
          </p>
          <div className="flex items-center gap-0.5">
            <NavItem
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </NavItem>
            <NavItem
              href="https://dribbble.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dribbble
            </NavItem>
          </div>
        </div>
      </div>
    </footer>
  );
}
