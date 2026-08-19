export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

export type SiteContent = {
  nav: NavigationItem[];
  utilityNav: Array<{ label: string; href: string }>;
  mobileFooterNav: Array<{ label: string; href: string }>;
  headerCtaLabel: string;
  headerCtaHref: string;
  languageLabel: string;
  menuLabel: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  slideLabel: string;
  heroTitle: string;
  heroDescription: string;
  slides: HeroSlide[];
};

const sharedImages = [
  "/hero/electrical-factory.jpg",
  "/hero/electrical-transformer.jpg",
];

export const siteContent: Record<Locale, SiteContent> = {
  id: {
    nav: [
      {
        label: "Tentang Kami",
        href: "/tentang-kami",
        children: [
          { label: "Profil Afana", href: "/tentang-kami#profil-afana" },
          { label: "Latar Belakang", href: "/tentang-kami#latar-belakang" },
          { label: "Visi & Misi", href: "/tentang-kami#visi-misi" },
          { label: "Fokus Solusi", href: "/tentang-kami#fokus-solusi" },
          { label: "Makna Logo", href: "/tentang-kami#peran-afana" },
        ],
      },
      { label: "Bisnis Afana", href: "/#hero" },
      { label: "Media & Informasi", href: "/media-informasi" },
      { label: "Keberlanjutan", href: "/#hero-copy" },
    ],
    utilityNav: [
      { label: "Karier", href: "/#hero-copy" },
      { label: "Kontak", href: "/#hero-copy" },
    ],
    mobileFooterNav: [
      { label: "Pengadaan", href: "/#hero-copy" },
      { label: "Karier", href: "/#hero-copy" },
      { label: "Hubungi Kami", href: "/#hero-copy" },
    ],
    headerCtaLabel: "Mulai berkenalan",
    headerCtaHref: "/#hero-copy",
    languageLabel: "Bahasa",
    menuLabel: "Buka menu",
    closeLabel: "Tutup menu",
    previousLabel: "Slide sebelumnya",
    nextLabel: "Slide berikutnya",
    slideLabel: "Pilih slide",
    heroTitle: "Solusi kelistrikan yang melindungi perangkat Anda",
    heroDescription: "Berfokus pada solusi kelistrikan untuk mengatasi masalah yang menjadi penyebab 80% kerusakan perangkat elektronik dan digital pelanggan.",
    slides: [
      {
        id: "direction",
        image: sharedImages[0],
        eyebrow: "AFANA / SOLUSI KELISTRIKAN",
      },
      {
        id: "possibility",
        image: sharedImages[1],
        eyebrow: "AFANA / DISTRIBUSI DAYA",
      },
    ],
  },
  en: {
    nav: [
      {
        label: "About Us",
        href: "/about",
        children: [
          { label: "Afana Profile", href: "/about#profil-afana" },
          { label: "Our Background", href: "/about#latar-belakang" },
          { label: "Vision & Mission", href: "/about#visi-misi" },
          { label: "Solution Focus", href: "/about#fokus-solusi" },
          { label: "Logo Meaning", href: "/about#peran-afana" },
        ],
      },
      { label: "Afana Business", href: "/#hero" },
      { label: "Media & Information", href: "/media-information" },
      { label: "Sustainability", href: "/#hero-copy" },
    ],
    utilityNav: [
      { label: "Careers", href: "/#hero-copy" },
      { label: "Contact", href: "/#hero-copy" },
    ],
    mobileFooterNav: [
      { label: "Procurement", href: "/#hero-copy" },
      { label: "Careers", href: "/#hero-copy" },
      { label: "Contact Us", href: "/#hero-copy" },
    ],
    headerCtaLabel: "Meet Afana",
    headerCtaHref: "/#hero-copy",
    languageLabel: "Language",
    menuLabel: "Open menu",
    closeLabel: "Close menu",
    previousLabel: "Previous slide",
    nextLabel: "Next slide",
    slideLabel: "Choose slide",
    heroTitle: "Electrical solutions that protect your devices",
    heroDescription: "Focused on electrical solutions for the issues behind 80% of damage to customers' electronic and digital devices.",
    slides: [
      {
        id: "direction",
        image: sharedImages[0],
        eyebrow: "AFANA / ELECTRICAL SOLUTIONS",
      },
      {
        id: "possibility",
        image: sharedImages[1],
        eyebrow: "AFANA / POWER DISTRIBUTION",
      },
    ],
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleHref(href: string, locale: Locale) {
  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export function getOtherLocaleHref(pathname: string, locale: Locale) {
  const otherLocale: Locale = locale === "id" ? "en" : "id";
  const localePath = pathname.replace(/^\/(id|en)(?=\/|$)/, "") || "/";
  const localizedPath = localePath.replace(
    /^\/media-(informasi|information)(?=\/|$)/,
    otherLocale === "id" ? "/media-informasi" : "/media-information",
  ).replace(
    /^\/(tentang-kami|about)(?=\/|$)/,
    otherLocale === "id" ? "/tentang-kami" : "/about",
  );

  return `/${otherLocale}${localizedPath === "/" ? "" : localizedPath}`;
}
