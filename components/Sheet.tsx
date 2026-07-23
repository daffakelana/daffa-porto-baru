"use client";

// Shell bottom-sheet yang bisa dipakai ulang: backdrop, panel yang bisa
// di-drag untuk menutup, DragHandle, tutup dengan Escape, dan kunci scroll body.
// Isi sheet dioper lewat `children` agar bebas dipakai untuk konten apa pun.

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import DragHandle from "./DragHandle";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Label aksesibilitas untuk dialog. */
  ariaLabel?: string;
}

export default function Sheet({
  isOpen,
  onClose,
  children,
  ariaLabel,
}: SheetProps) {
  // Tutup dengan Escape + kunci scroll body selama terbuka.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
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

          {/* Panel */}
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
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
