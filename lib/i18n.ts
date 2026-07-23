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
  work: {
    readMore: string;
    featured: {
      company: string;
      type: string;
      year: string;
      title: string;
      description: string;
    };
  };
  status: {
    backToHome: string;
    notFound: {
      title: string;
      description: string;
    };
    comingSoon: {
      title: string;
      description: string;
    };
  };
  detail: {
    content: string;
    collapseSidebar: string;
    expandSidebar: string;
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
    work: {
      readMore: "Read More",
      featured: {
        company: "Opticore",
        type: "Web App",
        year: "2026",
        title:
          "Briton StudyUK: Unlock the Potential of Studying in Great Britain",
        description:
          "When a broken content management platform frustrated social media managers and risked retail partner relationships.",
      },
    },
    status: {
      backToHome: "Back to Home",
      notFound: {
        title: "Page Not Found",
        description:
          "The page you're looking for doesn't exist or may have been moved.",
      },
      comingSoon: {
        title: "Coming Soon",
        description:
          "I am working on something exciting. This page isn't available yet, but it'll be ready soon.",
      },
    },
    detail: {
      content: "Content",
      collapseSidebar: "Collapse sidebar",
      expandSidebar: "Expand sidebar",
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
    work: {
      readMore: "Selengkapnya",
      featured: {
        company: "Opticore",
        type: "Aplikasi Web",
        year: "2026",
        title:
          "Briton StudyUK: Membuka Potensi Belajar di Britania Raya",
        description:
          "Ketika platform manajemen konten yang rusak membuat manajer media sosial frustrasi dan mempertaruhkan hubungan dengan mitra ritel.",
      },
    },
    status: {
      backToHome: "Kembali ke Beranda",
      notFound: {
        title: "Halaman Tidak Ditemukan",
        description:
          "Halaman yang kamu cari tidak ada atau mungkin telah dipindahkan.",
      },
      comingSoon: {
        title: "Segera Hadir",
        description:
          "Saya sedang menyiapkan sesuatu yang menarik. Halaman ini belum tersedia, tapi akan segera siap.",
      },
    },
    detail: {
      content: "Konten",
      collapseSidebar: "Tutup sidebar",
      expandSidebar: "Buka sidebar",
    },
  },
};
