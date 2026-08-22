import type { Locale } from "@/content/site-content";

export type FaqPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchButton: string;
  allCategories: string;
  resultsLabel: (count: number) => string;
  emptyTitle: string;
  emptyDescription: string;
  noResultsTitle: string;
  noResultsDescription: string;
  clearFilters: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactCta: string;
  contactHref: string;
};

export const faqPageContent: Record<Locale, FaqPageContent> = {
  id: {
    eyebrow: "PUSAT INFORMASI / FAQ",
    title: "Jawaban yang Anda butuhkan, lebih cepat.",
    description: "Telusuri pertanyaan umum berdasarkan topik atau gunakan pencarian untuk menemukan informasi yang relevan.",
    breadcrumbHome: "Beranda",
    breadcrumbCurrent: "FAQ",
    searchLabel: "Cari pertanyaan",
    searchPlaceholder: "Ketik kata kunci…",
    searchButton: "Cari",
    allCategories: "Semua topik",
    resultsLabel: (count) => `${count} jawaban ditemukan`,
    emptyTitle: "FAQ sedang disiapkan",
    emptyDescription: "Belum ada pertanyaan yang diterbitkan. Anda tetap dapat menghubungi tim Afana secara langsung.",
    noResultsTitle: "Belum menemukan jawaban",
    noResultsDescription: "Coba kata kunci atau kategori lain, lalu telusuri kembali daftar pertanyaan.",
    clearFilters: "Hapus filter",
    contactEyebrow: "PERLU BANTUAN LAIN?",
    contactTitle: "Sampaikan pertanyaan Anda kepada tim Afana.",
    contactDescription: "Gunakan halaman kontak untuk kebutuhan yang belum terjawab di daftar FAQ.",
    contactCta: "Hubungi Afana",
    contactHref: "/kontak",
  },
  en: {
    eyebrow: "INFORMATION DESK / FAQ",
    title: "The answers you need, without the detour.",
    description: "Browse common questions by topic or use search to find the information most relevant to you.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "FAQ",
    searchLabel: "Search questions",
    searchPlaceholder: "Enter a keyword…",
    searchButton: "Search",
    allCategories: "All topics",
    resultsLabel: (count) => `${count} answers found`,
    emptyTitle: "The FAQ is being prepared",
    emptyDescription: "No questions have been published yet. You can still contact the Afana team directly.",
    noResultsTitle: "No matching answer yet",
    noResultsDescription: "Try another keyword or category, then browse the question list again.",
    clearFilters: "Clear filters",
    contactEyebrow: "NEED SOMETHING ELSE?",
    contactTitle: "Bring your question to the Afana team.",
    contactDescription: "Use the contact page for anything not covered in the FAQ.",
    contactCta: "Contact Afana",
    contactHref: "/contact",
  },
};
