"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, Translation, translations } from "@/lib/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation; // teks untuk bahasa yang sedang aktif
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Muat pilihan yang tersimpan saat pertama kali render (sinkronisasi sekali
  // dari localStorage setelah hydration — aman, tidak menyebabkan mismatch).
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "id") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(saved);
    }
  }, []);

  // Simpan pilihan + set atribut lang di <html>
  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
