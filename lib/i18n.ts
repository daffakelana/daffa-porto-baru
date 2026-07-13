// Semua teks yang bisa diterjemahkan ada di sini (satu sumber kebenaran).
// Tambah bahasa baru = tambah satu entri di `translations` dengan bentuk yang sama.

export type Language = "en" | "id";

export interface Translation {
  nav: {
    home: string;
    resume: string;
    email: string;
    creativeSpace: string;
    blog: string;
  };
  sheet: {
    title: string;
    menu: string;
    preferences: string;
    theme: string;
    language: string;
    myResume: string;
    emailMe: string;
    creativeSpace: string;
    blog: string;
  };
  hero: {
    badge: string;
    headingIntro: string;
    landingPages: string;
    webApps: string;
    mobileApps: string;
    and: string;
    creativeDesign: string;
    subtitle: string;
    cta: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      home: "Home",
      resume: "Resume",
      email: "Email",
      creativeSpace: "Creative Space",
      blog: "Blog",
    },
    sheet: {
      title: "Where do you wanna go?",
      menu: "Menu",
      preferences: "Preferences",
      theme: "Theme",
      language: "Language",
      myResume: "My Resume",
      emailMe: "Email Me",
      creativeSpace: "Creative Space",
      blog: "Blog",
    },
    hero: {
      badge: "Daffa Putra, User Interface Designer",
      headingIntro: "Helping brands and businesses design",
      landingPages: "landing pages",
      webApps: "web apps",
      mobileApps: "mobile apps",
      and: "and",
      creativeDesign: "creative design",
      subtitle:
        "Crafting user-centered digital products that are simple to use, visually refined, and built to achieve business goals.",
      cta: "See My Best Work",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      resume: "Resume",
      email: "Email",
      creativeSpace: "Ruang Kreatif",
      blog: "Blog",
    },
    sheet: {
      title: "Mau ke mana?",
      menu: "Menu",
      preferences: "Preferensi",
      theme: "Tema",
      language: "Bahasa",
      myResume: "Resume Saya",
      emailMe: "Email Saya",
      creativeSpace: "Ruang Kreatif",
      blog: "Blog",
    },
    hero: {
      badge: "Daffa Putra, Desainer Antarmuka",
      headingIntro: "Membantu brand dan bisnis merancang",
      landingPages: "landing page",
      webApps: "aplikasi web",
      mobileApps: "aplikasi mobile",
      and: "dan",
      creativeDesign: "desain kreatif",
      subtitle:
        "Menciptakan produk digital yang berpusat pada pengguna—mudah digunakan, rapi secara visual, dan dibuat untuk mencapai tujuan bisnis.",
      cta: "Lihat Karya Terbaik Saya",
    },
  },
};
