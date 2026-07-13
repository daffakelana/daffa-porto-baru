"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import DragHandle from "./DragHandle";
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

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Warna teks/ikon untuk opsi yang aktif vs tidak aktif
  const activeColor = (isActive: boolean) =>
    isActive ? 'var(--primary-strong)' : 'var(--text-color-default)';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="relative w-full pt-2 px-4 pb-8 bg-[var(--background-color-white)] rounded-t-3xl flex flex-col items-center gap-3"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.9 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) onClose();
            }}
          >
            <DragHandle />

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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
