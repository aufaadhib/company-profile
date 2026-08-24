import type { Locale } from "@/content/site-content";

export type BusinessFocus = {
  number: string;
  label: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

export type BusinessStep = {
  number: string;
  title: string;
  body: string;
};

export type BusinessPageContent = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  introductionLabel: string;
  introductionTitle: string;
  introductionBody: string[];
  introductionHighlight: string;
  introductionHighlightLabel: string;
  focusLabel: string;
  focusTitle: string;
  focusDescription: string;
  focusPreviousLabel: string;
  focusNextLabel: string;
  focusSlideLabel: string;
  focuses: BusinessFocus[];
  equipmentLabel: string;
  equipmentTitle: string;
  equipmentBody: string[];
  equipmentImageAlt: string;
  approachLabel: string;
  approachTitle: string;
  approachDescription: string;
  steps: BusinessStep[];
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
};

const sharedImages = {
  hero: "/images/home/afana-electrical-equipment.png",
  powerQuality: "/images/sustainability/power-quality-inspection.png",
  distribution: "/images/media/power-distribution.jpg",
  protection: "/images/media/electrical-inspection.jpg",
  readiness: "/images/sustainability/maintained-infrastructure.png",
};

export const businessPageContent: Record<Locale, BusinessPageContent> = {
  id: {
    breadcrumbHome: "Beranda",
    breadcrumbCurrent: "Bisnis Afana",
    eyebrow: "AFANA / BISNIS",
    title: "Solusi kelistrikan yang berangkat dari kondisi nyata.",
    description:
      "Afana memadukan pemahaman sistem, peralatan listrik, dan pendampingan teknis untuk membantu menjaga daya, perangkat, dan kesiapan operasi.",
    heroImage: sharedImages.hero,
    heroImageAlt: "Peralatan listrik Afana dengan konstruksi logam hitam dan aksen oranye",
    introductionLabel: "Ruang bisnis",
    introductionTitle: "Satu kebutuhan, dibaca sebagai satu sistem.",
    introductionBody: [
      "Setiap operasi memiliki karakter beban, perangkat, dan risiko yang berbeda. Afana memulai dari kondisi tersebut untuk menyusun arah kelistrikan yang relevan dan dapat dipelihara.",
      "Ruang bisnis Afana menghubungkan fokus sistem dengan pendekatan kerja yang terukur, sehingga keputusan teknis tidak berhenti pada pemasangan, tetapi tetap mendukung kebutuhan operasi berikutnya.",
    ],
    introductionHighlight: "80%",
    introductionHighlightLabel: "kerusakan perangkat disebabkan oleh kualitas daya yang tidak terjaga",
    focusLabel: "Fokus sistem",
    focusTitle: "Empat ruang yang saling terhubung.",
    focusDescription:
      "Fokus solusi dibaca sebagai bagian dari sistem yang sama—dari kualitas daya hingga kesiapan operasional.",
    focusPreviousLabel: "Fokus sistem sebelumnya",
    focusNextLabel: "Fokus sistem berikutnya",
    focusSlideLabel: "Fokus sistem",
    focuses: [
      {
        number: "01",
        label: "Kualitas daya",
        title: "Daya yang lebih stabil",
        body: "Memahami kestabilan daya sebagai fondasi kerja perangkat elektronik dan digital.",
        image: sharedImages.powerQuality,
        imageAlt: "Pemeriksaan kualitas daya pada panel kelistrikan industri",
      },
      {
        number: "02",
        label: "Distribusi beban",
        title: "Hubungan sumber dan beban",
        body: "Membaca hubungan antara sumber, beban, dan kebutuhan operasional secara menyeluruh.",
        image: sharedImages.distribution,
        imageAlt: "Jaringan distribusi listrik menuju area operasional",
      },
      {
        number: "03",
        label: "Perlindungan perangkat",
        title: "Perlindungan yang sesuai",
        body: "Menyusun perlindungan berdasarkan karakter perangkat dan kondisi sistem yang sebenarnya.",
        image: sharedImages.protection,
        imageAlt: "Teknisi melakukan pemeriksaan pada perangkat elektronik",
      },
      {
        number: "04",
        label: "Kesiapan operasional",
        title: "Sistem yang siap dipelihara",
        body: "Menjaga sistem tetap terbaca, mudah dipelihara, dan siap mengikuti perkembangan kebutuhan.",
        image: sharedImages.readiness,
        imageAlt: "Infrastruktur kelistrikan industri yang tertata dan terawat",
      },
    ],
    equipmentLabel: "Peralatan listrik Afana",
    equipmentTitle: "Dirancang untuk mendukung kestabilan dan kesinambungan kerja.",
    equipmentBody: [
      "Afana memproduksi peralatan listrik yang diarahkan untuk menjaga daya tetap stabil, bekerja tahan lama, dan mendukung kebutuhan operasional secara konsisten.",
      "Kebutuhan perangkat ditempatkan dalam konteks sistem secara menyeluruh agar pilihan teknis tetap relevan dengan kondisi penggunaannya.",
    ],
    equipmentImageAlt: "Peralatan pengondisi daya Afana di lingkungan industrial",
    approachLabel: "Pendekatan kerja",
    approachTitle: "Jalur yang jelas dari temuan menuju tindak lanjut.",
    approachDescription:
      "Empat tahap menjaga pembahasan teknis tetap terhubung dengan kondisi lapangan dan kebutuhan operasi.",
    steps: [
      { number: "01", title: "Pemetaan kondisi", body: "Membaca kondisi lapangan, pola penggunaan, dan perangkat yang perlu dijaga." },
      { number: "02", title: "Identifikasi risiko", body: "Mengenali titik gangguan dan dampaknya sebelum menentukan prioritas tindakan." },
      { number: "03", title: "Rekomendasi terukur", body: "Menghubungkan temuan teknis dengan langkah yang relevan bagi kebutuhan operasi." },
      { number: "04", title: "Tindak lanjut", body: "Menjaga komunikasi dan pengamatan agar keputusan tetap relevan setelah penerapan." },
    ],
    ctaTitle: "Mulai dari kebutuhan sistem Anda.",
    ctaBody: "Sampaikan kondisi, pertanyaan, atau peluang kerja sama kepada tim Afana.",
    ctaLabel: "Hubungi Afana",
    ctaHref: "/kontak",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Afana Business",
    eyebrow: "AFANA / BUSINESS",
    title: "Electrical solutions shaped by real conditions.",
    description:
      "Afana combines system understanding, electrical equipment, and technical support to help protect power, devices, and operational readiness.",
    heroImage: sharedImages.hero,
    heroImageAlt: "Afana electrical equipment with a black metal enclosure and orange accent",
    introductionLabel: "Business scope",
    introductionTitle: "One need, understood as one system.",
    introductionBody: [
      "Every operation has different load characteristics, devices, and risks. Afana starts with those conditions to shape an electrical direction that is relevant and maintainable.",
      "Afana's business scope connects system focus with a measured working approach, so technical decisions continue beyond installation and support what the operation needs next.",
    ],
    introductionHighlight: "80%",
    introductionHighlightLabel: "of device damage is caused by unmanaged power quality",
    focusLabel: "System focus",
    focusTitle: "Four connected areas.",
    focusDescription:
      "Each solution focus is understood as part of the same system—from power quality to operational readiness.",
    focusPreviousLabel: "Previous system focus",
    focusNextLabel: "Next system focus",
    focusSlideLabel: "System focus",
    focuses: [
      {
        number: "01",
        label: "Power quality",
        title: "More stable power",
        body: "Understanding power stability as the foundation for electronic and digital devices.",
        image: sharedImages.powerQuality,
        imageAlt: "Power-quality inspection on an industrial electrical panel",
      },
      {
        number: "02",
        label: "Load distribution",
        title: "Source and load in context",
        body: "Reading the relationship between sources, loads, and operational needs as a whole.",
        image: sharedImages.distribution,
        imageAlt: "Electrical distribution network leading towards an operational area",
      },
      {
        number: "03",
        label: "Device protection",
        title: "Protection that fits",
        body: "Shaping protection around device characteristics and actual system conditions.",
        image: sharedImages.protection,
        imageAlt: "Technician inspecting an electronic device",
      },
      {
        number: "04",
        label: "Operational readiness",
        title: "A system ready to maintain",
        body: "Keeping systems readable, maintainable, and ready for changing requirements.",
        image: sharedImages.readiness,
        imageAlt: "Orderly and well-maintained industrial electrical infrastructure",
      },
    ],
    equipmentLabel: "Afana electrical equipment",
    equipmentTitle: "Designed to support stability and operational continuity.",
    equipmentBody: [
      "Afana manufactures electrical equipment designed to deliver stable power, durable performance, and consistent support for operational needs.",
      "Equipment needs are considered within the wider system so technical choices remain relevant to how they will be used.",
    ],
    equipmentImageAlt: "Afana power-conditioning equipment in an industrial setting",
    approachLabel: "Working approach",
    approachTitle: "A clear path from findings to follow-through.",
    approachDescription:
      "Four stages keep technical discussions connected to field conditions and operational needs.",
    steps: [
      { number: "01", title: "Condition mapping", body: "Read field conditions, usage patterns, and the devices that need protection." },
      { number: "02", title: "Risk identification", body: "Recognise potential disruption and its impact before prioritising action." },
      { number: "03", title: "Measured recommendations", body: "Connect technical findings with steps that are relevant to operational needs." },
      { number: "04", title: "Follow-through", body: "Maintain communication and observation so decisions remain relevant after implementation." },
    ],
    ctaTitle: "Start with what your system needs.",
    ctaBody: "Share a condition, question, or collaboration opportunity with the Afana team.",
    ctaLabel: "Contact Afana",
    ctaHref: "/contact",
  },
};
