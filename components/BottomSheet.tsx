"use client";

import Sheet from "./Sheet";
import MenuItem from "./MenuItem";
import PreferenceRow from "./PreferenceRow";
import { FileText, Mail, Sparkles, BookOpen, Sun, Moon } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onSelectTheme: (theme: 'light' | 'dark') => void;
}

export default function BottomSheet({ isOpen, onClose, theme, onSelectTheme }: BottomSheetProps) {
  const { language, setLanguage, t } = useLanguage();

  // Warna teks/ikon untuk opsi yang aktif vs tidak aktif
  const activeColor = (isActive: boolean) =>
    isActive ? 'var(--primary-strong)' : 'var(--text-color-default)';

  return (
    <Sheet isOpen={isOpen} onClose={onClose} ariaLabel={t.sheet.title}>
      <div className="w-full flex flex-col items-stretch gap-4">
        {/* Header */}
        <h2
          className="headline-2 w-full"
          style={{ color: 'var(--text-color-default)' }}
        >
          {t.sheet.title}
        </h2>

        {/* Menu Section */}
        <div className="flex flex-col items-stretch gap-5">
          <div className="flex flex-col items-stretch gap-4">
            <span
              className="label-2"
              style={{ color: 'var(--text-color-tertiary)' }}
            >
              {t.sheet.menu}
            </span>
            <div className="flex flex-col items-stretch gap-2">
              <MenuItem
                href="/resume"
                icon={FileText}
                label={t.sheet.myResume}
                onClick={onClose}
              />
              <MenuItem
                href="mailto:daffaputrapratamaa@gmail.com"
                icon={Mail}
                label={t.sheet.emailMe}
                onClick={onClose}
              />
              <MenuItem
                href="/creative-space"
                icon={Sparkles}
                label={t.sheet.creativeSpace}
                onClick={onClose}
              />
              <MenuItem
                href="/blog"
                icon={BookOpen}
                label={t.sheet.blog}
                onClick={onClose}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px border-b border-dashed" style={{ borderColor: 'var(--divider-color)' }} />

          {/* Preferences Section */}
          <div className="flex flex-col items-stretch gap-4">
            <span
              className="label-2"
              style={{ color: 'var(--text-color-tertiary)' }}
            >
              {t.sheet.preferences}
            </span>
            <div className="flex flex-col items-stretch gap-1">
              {/* Theme toggle */}
              <PreferenceRow label={t.sheet.theme}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTheme('light')}
                    aria-pressed={theme === 'light'}
                    className="inline-flex items-center justify-center p-1.5 rounded-md transition-colors"
                    style={{ backgroundColor: theme === 'light' ? 'var(--background-color-hover)' : 'transparent' }}
                  >
                    <Sun size={16} style={{ color: activeColor(theme === 'light') }} />
                  </button>
                  <div className="w-px h-3" style={{ backgroundColor: 'var(--divider-color)' }} />
                  <button
                    type="button"
                    onClick={() => onSelectTheme('dark')}
                    aria-pressed={theme === 'dark'}
                    className="inline-flex items-center justify-center p-1.5 rounded-md transition-colors"
                    style={{ backgroundColor: theme === 'dark' ? 'var(--background-color-hover)' : 'transparent' }}
                  >
                    <Moon size={16} style={{ color: activeColor(theme === 'dark') }} />
                  </button>
                </div>
              </PreferenceRow>

              {/* Language toggle */}
              <PreferenceRow label={t.sheet.language}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    className="body-2 transition-colors"
                    style={{ color: activeColor(language === 'en') }}
                  >
                    English
                  </button>
                  <div className="w-px h-3" style={{ backgroundColor: 'var(--divider-color)' }} />
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    aria-pressed={language === 'id'}
                    className="body-2 transition-colors"
                    style={{ color: activeColor(language === 'id') }}
                  >
                    Indonesia
                  </button>
                </div>
              </PreferenceRow>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
