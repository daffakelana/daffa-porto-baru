"use client";

import Link from "next/link";
import { NavItem } from "./NavItem";
import { Moon, Sun, Menu, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import BottomSheet from "./BottomSheet";
import { useLanguage } from "./LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

function Logo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <img
        src="/images/logo.svg"
        alt="Daffa Putra logo"
        className="w-full h-full object-contain"
        style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}
      />
    </div>
  );
}

function Divider() {
  return <div className="w-px h-3 bg-[var(--divider-color)]" />;
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Sinkronisasi sekali dari localStorage setelah hydration (SSR-safe).
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <nav className="fixed w-full py-2 border-b border-[var(--divider-color)] bg-[var(--background-color-default)]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-0">
          {/* Desktop Navbar */}
          <div className="hidden md:flex flex-row justify-between items-center">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Link href="/" aria-label={t.nav.home} className="inline-flex items-center">
                <Logo theme={theme} />
              </Link>
              <div className="flex items-center gap-0.5">
                <NavItem href="/">{t.nav.home}</NavItem>
                <NavItem href="/resume">{t.nav.resume}</NavItem>
                <NavItem href="mailto:daffaputrapratamaa@gmail.com">{t.nav.email}</NavItem>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <NavItem href="/creative-space">{t.nav.creativeSpace}</NavItem>
                <NavItem href="/blog">{t.nav.blog}</NavItem>
              </div>
              <Divider />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={t.sheet.language}
                    className="inline-flex items-center justify-center gap-1 label-3 transition-colors py-1 px-2 rounded-md text-[var(--text-color-default)] hover:bg-[var(--background-color-hover)] data-[state=open]:bg-[var(--background-color-hover)]"
                  >
                    <Languages size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem active={language === 'en'} onSelect={() => setLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem active={language === 'id'} onSelect={() => setLanguage('id')}>
                    Indonesia
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Divider />
              <NavItem
                onClick={toggleTheme}
                leftIcon={theme === 'light' ? Moon : Sun}
              />
            </div>
          </div>

          {/* Mobile/Tablet Navbar */}
          <div className="flex md:hidden flex-row justify-between items-center">
            <Link href="/" aria-label={t.nav.home} className="inline-flex items-center">
              <Logo theme={theme} />
            </Link>
            <NavItem
              leftIcon={Menu}
              size={20}
              onClick={() => setIsBottomSheetOpen(true)}
            />
          </div>
        </div>
      </nav>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        theme={theme}
        onSelectTheme={setTheme}
      />
    </>
  );
}
