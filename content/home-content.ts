import type { Locale } from "@/content/site-content";

export type HomePageContent = {
  about: {
    label: string;
    title: string;
    body: string;
    linkLabel: string;
    imageAlt: string;
  };
  solutions: {
    label: string;
    title: string;
    description: string;
    linkLabel: string;
    showDetailsLabel: string;
    hideDetailsLabel: string;
    tabs: Array<{
      id: string;
      label: string;
      cards: Array<{
        title: string;
        body: string;
        image: string;
        imageAlt: string;
      }>;
    }>;
  };
  focus: {
    label: string;
    title: string;
    description: string;
    linkLabel: string;
    steps: Array<{
      number: string;
      title: string;
      body: string;
    }>;
  };
  sustainability: {
    label: string;
    title: string;
    body: string;
    linkLabel: string;
    imageAlt: string;
  };
  media: {
    label: string;
    title: string;
    description: string;
    allLabel: string;
    readMoreLabel: string;
    emptyLabel: string;
    loadingLabel: string;
  };
  contact: {
    label: string;
    title: string;
    body: string;
    linkLabel: string;
  };
};

export const homePageContent: Record<Locale, HomePageContent> = {
  id: {
    about: {
      label: "Tentang Afana",
      title: "Kelistrikan yang dipahami dari kebutuhan operasional.",
      body: "Afana menyatukan pengalaman teknis, pemahaman operasional, dan komunikasi terbuka untuk menghadirkan solusi kelistrikan yang terintegrasi bagi pelanggan.",
      linkLabel: "Lebih dekat dengan Afana",
      imageAlt: "Dua teknisi Afana memeriksa panel kelistrikan di lingkungan industri",
    },
    solutions: {
      label: "Bisnis Afana",
      title: "Solusi yang bergerak dari kebutuhan nyata.",
      description: "Setiap sistem memiliki kondisi, beban, dan prioritas yang berbeda. Pilih sudut pandang untuk melihat fokus solusi dan cara Afana mendampingi kebutuhan kelistrikan.",
      linkLabel: "Pelajari solusi Afana",
      showDetailsLabel: "Tampilkan ringkasan",
      hideDetailsLabel: "Kembali ke gambar",
      tabs: [
        {
          id: "system-focus",
          label: "Fokus Sistem",
          cards: [
            {
              title: "Kualitas daya",
              body: "Memahami kestabilan daya sebagai fondasi kerja perangkat elektronik dan digital.",
              image: "/images/sustainability/power-quality-inspection.png",
              imageAlt: "Pemeriksaan kualitas daya pada panel kelistrikan industri",
            },
            {
              title: "Distribusi beban",
              body: "Membaca hubungan antara sumber, beban, dan kebutuhan operasional secara menyeluruh.",
              image: "/images/media/power-distribution.jpg",
              imageAlt: "Jaringan distribusi listrik menuju area operasional",
            },
            {
              title: "Perlindungan perangkat",
              body: "Menyusun perlindungan yang sesuai dengan karakter perangkat dan kondisi sistem.",
              image: "/images/media/electrical-inspection.jpg",
              imageAlt: "Teknisi melakukan pemeriksaan pada perangkat elektronik",
            },
            {
              title: "Kesiapan operasional",
              body: "Menjaga sistem tetap terbaca, mudah dipelihara, dan siap mengikuti perkembangan kebutuhan.",
              image: "/images/sustainability/maintained-infrastructure.png",
              imageAlt: "Infrastruktur kelistrikan industri yang tertata dan terawat",
            },
            {
              title: "Peralatan listrik Afana",
              body: "Afana memproduksi peralatan listrik yang dirancang untuk menjaga daya tetap stabil, bekerja tahan lama, dan mendukung kebutuhan operasional secara konsisten.",
              image: "/images/home/afana-electrical-equipment.png",
              imageAlt: "Ilustrasi perangkat pengondisi daya listrik industrial dengan konstruksi logam",
            },
          ],
        },
        {
          id: "working-approach",
          label: "Pendekatan Kerja",
          cards: [
            {
              title: "Pemetaan kondisi",
              body: "Memulai dari kondisi lapangan, pola penggunaan, dan perangkat yang perlu dijaga.",
              image: "/images/about/afana-technicians.jpg",
              imageAlt: "Teknisi Afana memetakan kondisi panel kelistrikan",
            },
            {
              title: "Identifikasi risiko",
              body: "Mengenali titik gangguan dan dampaknya sebelum menentukan prioritas tindakan.",
              image: "/images/media/industrial-control-panel.jpg",
              imageAlt: "Panel kontrol industri untuk identifikasi risiko kelistrikan",
            },
            {
              title: "Rekomendasi terukur",
              body: "Menghubungkan temuan teknis dengan langkah yang relevan bagi kebutuhan operasi.",
              image: "/images/media/integrated-engineering.jpg",
              imageAlt: "Teknisi menyusun rekomendasi di lingkungan industri",
            },
            {
              title: "Tindak lanjut",
              body: "Menjaga komunikasi dan pengamatan agar keputusan tetap relevan setelah penerapan.",
              image: "/images/sustainability/maintained-infrastructure.png",
              imageAlt: "Pemeriksaan lanjutan pada infrastruktur kelistrikan yang terawat",
            },
          ],
        },
      ],
    },
    focus: {
      label: "Cara kerja",
      title: "Dari kondisi lapangan menuju sistem yang lebih terlindungi.",
      description: "Afana menerjemahkan kebutuhan kelistrikan ke dalam keputusan yang terukur, dapat dipantau, dan siap dipelihara.",
      linkLabel: "Pelajari fokus solusi",
      steps: [
        { number: "01", title: "Pahami kondisi", body: "Membaca kebutuhan, beban, risiko, dan karakter perangkat sebelum menentukan arah." },
        { number: "02", title: "Stabilkan daya", body: "Menyusun kualitas daya yang sesuai agar sistem bekerja lebih tenang dan konsisten." },
        { number: "03", title: "Lindungi perangkat", body: "Mengurangi tekanan pada perangkat melalui perlindungan dan rancangan yang tepat." },
        { number: "04", title: "Perpanjang nilai aset", body: "Menjaga investasi teknologi melalui pemeliharaan dan pengembangan bertahap." },
      ],
    },
    sustainability: {
      label: "Keberlanjutan",
      title: "Menjaga energi bekerja lebih baik, lebih lama.",
      body: "Keberlanjutan bagi Afana dimulai dari sistem kelistrikan yang dipahami, dirancang dengan tepat, dan dirawat untuk menjaga nilai perangkat serta kesinambungan operasi.",
      linkLabel: "Lihat pendekatan keberlanjutan",
      imageAlt: "Pemeriksaan kualitas daya pada panel kelistrikan industri",
    },
    media: {
      label: "Media & Informasi",
      title: "Wawasan untuk keputusan kelistrikan yang lebih siap.",
      description: "Ikuti gagasan, perkembangan, dan sudut pandang Afana dalam membangun fondasi kelistrikan yang mendukung teknologi dan operasional.",
      allLabel: "Lihat semua media",
      readMoreLabel: "Baca selengkapnya",
      emptyLabel: "Belum ada artikel yang dipublikasikan.",
      loadingLabel: "Memuat media terbaru",
    },
    contact: {
      label: "Mulai bersama Afana",
      title: "Mari mulai percakapan.",
      body: "Sampaikan pertanyaan, kebutuhan solusi kelistrikan, atau peluang kerja sama kepada tim Afana.",
      linkLabel: "Hubungi Afana",
    },
  },
  en: {
    about: {
      label: "About Afana",
      title: "Electrical systems understood through operational needs.",
      body: "Afana brings together technical experience, operational understanding, and open communication to provide integrated electrical solutions for customers.",
      linkLabel: "Get to know Afana",
      imageAlt: "Two Afana technicians inspecting an electrical panel in an industrial environment",
    },
    solutions: {
      label: "Afana Business",
      title: "Solutions shaped by real needs.",
      description: "Every system has different conditions, loads, and priorities. Choose a perspective to explore Afana's solution focus and the way we support electrical needs.",
      linkLabel: "Explore Afana's solutions",
      showDetailsLabel: "Show overview",
      hideDetailsLabel: "Return to image",
      tabs: [
        {
          id: "system-focus",
          label: "System Focus",
          cards: [
            {
              title: "Power quality",
              body: "Understanding power stability as the foundation for electronic and digital devices.",
              image: "/images/sustainability/power-quality-inspection.png",
              imageAlt: "Power-quality inspection on an industrial electrical panel",
            },
            {
              title: "Load distribution",
              body: "Reading the relationship between sources, loads, and operational needs as a whole.",
              image: "/images/media/power-distribution.jpg",
              imageAlt: "Electrical distribution network leading towards an operational area",
            },
            {
              title: "Device protection",
              body: "Shaping protection around device characteristics and actual system conditions.",
              image: "/images/media/electrical-inspection.jpg",
              imageAlt: "Technician inspecting an electronic device",
            },
            {
              title: "Operational readiness",
              body: "Keeping systems readable, maintainable, and ready for changing requirements.",
              image: "/images/sustainability/maintained-infrastructure.png",
              imageAlt: "Orderly and well-maintained industrial electrical infrastructure",
            },
            {
              title: "Afana electrical equipment",
              body: "Afana manufactures electrical equipment designed to deliver stable power, durable performance, and consistent support for operational needs.",
              image: "/images/home/afana-electrical-equipment.png",
              imageAlt: "Illustration of an industrial power-conditioning unit with a metal enclosure",
            },
          ],
        },
        {
          id: "working-approach",
          label: "Working Approach",
          cards: [
            {
              title: "Condition mapping",
              body: "Starting with field conditions, usage patterns, and the devices that need protection.",
              image: "/images/about/afana-technicians.jpg",
              imageAlt: "Afana technicians mapping electrical panel conditions",
            },
            {
              title: "Risk identification",
              body: "Recognising potential disruption and its impact before prioritising action.",
              image: "/images/media/industrial-control-panel.jpg",
              imageAlt: "Industrial control panel used to identify electrical risks",
            },
            {
              title: "Measured recommendations",
              body: "Connecting technical findings with steps relevant to operational needs.",
              image: "/images/media/integrated-engineering.jpg",
              imageAlt: "Technician preparing recommendations in an industrial environment",
            },
            {
              title: "Follow-through",
              body: "Maintaining communication and observation so decisions remain relevant after implementation.",
              image: "/images/sustainability/maintained-infrastructure.png",
              imageAlt: "Follow-up inspection of maintained electrical infrastructure",
            },
          ],
        },
      ],
    },
    focus: {
      label: "How we work",
      title: "From field conditions to better-protected systems.",
      description: "Afana translates electrical needs into decisions that are measured, observable, and ready to maintain.",
      linkLabel: "Explore our solution focus",
      steps: [
        { number: "01", title: "Understand conditions", body: "Read the needs, loads, risks, and device characteristics before setting a direction." },
        { number: "02", title: "Stabilise power", body: "Shape power quality around what the system needs to work calmly and consistently." },
        { number: "03", title: "Protect devices", body: "Reduce stress on equipment through the right protection and system design." },
        { number: "04", title: "Extend asset value", body: "Protect technology investments through maintenance and considered development." },
      ],
    },
    sustainability: {
      label: "Sustainability",
      title: "Keeping energy working better, for longer.",
      body: "For Afana, sustainability begins with electrical systems that are understood, precisely designed, and maintained to protect asset value and operational continuity.",
      linkLabel: "See our sustainability approach",
      imageAlt: "Power-quality inspection on an industrial electrical panel",
    },
    media: {
      label: "Media & Information",
      title: "Insights for better-prepared electrical decisions.",
      description: "Explore Afana's ideas, developments, and perspectives on building an electrical foundation that supports technology and operations.",
      allLabel: "View all media",
      readMoreLabel: "Read more",
      emptyLabel: "No articles have been published yet.",
      loadingLabel: "Loading the latest media",
    },
    contact: {
      label: "Start with Afana",
      title: "Let’s start a conversation.",
      body: "Share a question, an electrical solution need, or a collaboration opportunity with the Afana team.",
      linkLabel: "Contact Afana",
    },
  },
};
