import type { Locale } from "@/content/site-content";

export const mediaCategories = ["news", "insight", "technology"] as const;

export type MediaCategory = (typeof mediaCategories)[number];

export type MediaItem = {
  id: string;
  slug: string;
  category: MediaCategory;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
};

export type MediaPageContent = {
  heroImage: string;
  eyebrow: string;
  title: string;
  description: string;
  featuredLabel: string;
  latestLabel: string;
  allLabel: string;
  categoryLabels: Record<MediaCategory, string>;
  readMoreLabel: string;
  backLabel: string;
  relatedLabel: string;
  items: MediaItem[];
};

export const mediaPageContent: Record<Locale, MediaPageContent> = {
  id: {
    heroImage: "/images/media/power-distribution.jpg",
    eyebrow: "AFANA / MEDIA & INFORMASI",
    title: "Wawasan untuk kelistrikan yang lebih andal",
    description:
      "Ikuti gagasan, perkembangan, dan sudut pandang Afana dalam membangun fondasi kelistrikan yang siap mendukung teknologi serta operasional pelanggan.",
    featuredLabel: "Sorotan",
    latestLabel: "Media terbaru",
    allLabel: "Semua",
    categoryLabels: {
      news: "Berita Afana",
      insight: "Insight Kelistrikan",
      technology: "Teknologi & Operasional",
    },
    readMoreLabel: "Baca selengkapnya",
    backLabel: "Kembali ke Media & Informasi",
    relatedLabel: "Bacaan terkait",
    items: [
      {
        id: "power-quality-foundation",
        slug: "kualitas-daya-fondasi-keandalan-perangkat",
        category: "insight",
        title: "Kualitas Daya: Fondasi Keandalan Perangkat Digital",
        excerpt:
          "Memahami kualitas daya membantu perusahaan mengambil langkah yang lebih tepat untuk melindungi perangkat dan menjaga operasional.",
        body: [
          "Perangkat elektronik dan digital bekerja sebagai bagian dari sistem operasional yang saling terhubung. Ketika kualitas daya tidak stabil, dampaknya dapat muncul dalam bentuk gangguan performa, usia perangkat yang lebih pendek, atau terhentinya aktivitas yang bergantung pada teknologi.",
          "Karena itu, pemeriksaan kelistrikan perlu dimulai dari pemahaman terhadap kondisi nyata di lapangan. Tegangan, distribusi beban, perlindungan, dan pola penggunaan perlu dilihat sebagai satu kesatuan agar sumber risiko dapat dipetakan secara lebih menyeluruh.",
          "Pendekatan yang terukur membantu pelanggan menentukan prioritas perbaikan dan perlindungan sesuai kebutuhan. Solusi tidak hanya ditujukan untuk merespons gangguan, tetapi juga membangun fondasi yang lebih siap untuk perkembangan perangkat di masa mendatang.",
        ],
        publishedAt: "2026-06-12",
        image: "/images/media/data-center-power.jpg",
        imageAlt: "Rak server dan kabel jaringan dalam ruang pusat data",
        featured: true,
      },
      {
        id: "integrated-electrical-approach",
        slug: "pendekatan-terintegrasi-solusi-kelistrikan",
        category: "news",
        title: "Afana Memperkuat Pendekatan Solusi Kelistrikan Terintegrasi",
        excerpt:
          "Solusi kelistrikan yang baik berangkat dari kemampuan membaca hubungan antara infrastruktur, perangkat, dan kebutuhan operasional.",
        body: [
          "Afana mengembangkan pendekatan kerja yang menghubungkan kondisi kelistrikan dengan kebutuhan teknologi pelanggan. Setiap kebutuhan dipahami melalui pemetaan kondisi, identifikasi risiko, dan penyusunan rekomendasi yang relevan.",
          "Pendekatan ini membantu pelanggan melihat solusi secara lebih utuh. Pekerjaan tidak berhenti pada pemasangan atau perbaikan, tetapi diarahkan agar sistem dapat dipahami, dipantau, dan dikembangkan secara bertahap.",
        ],
        publishedAt: "2026-05-24",
        image: "/images/media/integrated-engineering.jpg",
        imageAlt: "Teknisi memeriksa peralatan dalam lingkungan kerja industri",
      },
      {
        id: "technology-readiness",
        slug: "kesiapan-teknologi-dimulai-dari-infrastruktur-listrik",
        category: "technology",
        title: "Kesiapan Teknologi Dimulai dari Infrastruktur Listrik",
        excerpt:
          "Perkembangan teknologi perlu berjalan bersama infrastruktur yang aman, stabil, dan mudah dipelihara.",
        body: [
          "Teknologi yang semakin canggih membawa tuntutan baru terhadap lingkungan operasional. Infrastruktur kelistrikan perlu dipersiapkan agar mampu mendukung perangkat dengan kebutuhan dan karakter yang beragam.",
          "Kesiapan tersebut mencakup pemahaman terhadap beban, perlindungan perangkat, serta proses pemantauan yang memungkinkan gangguan dikenali lebih awal. Dengan fondasi yang tepat, investasi teknologi dapat memberikan manfaat yang lebih konsisten.",
        ],
        publishedAt: "2026-04-18",
        image: "/images/media/technology-readiness.jpg",
        imageAlt: "Detail papan sirkuit sebagai fondasi perangkat teknologi",
      },
      {
        id: "electrical-risk-mapping",
        slug: "tiga-langkah-memetakan-risiko-kelistrikan",
        category: "insight",
        title: "Tiga Langkah Awal Memetakan Risiko Kelistrikan",
        excerpt:
          "Pemetaan kondisi yang sistematis membantu tim menentukan tindakan yang paling penting sebelum gangguan berkembang.",
        body: [
          "Langkah pertama adalah memahami bagaimana sistem digunakan sehari-hari. Pola operasi, perangkat yang paling kritis, dan dampak gangguan perlu dicatat agar analisis memiliki konteks yang jelas.",
          "Langkah berikutnya adalah mengidentifikasi titik yang berpotensi menimbulkan gangguan, lalu menyusun prioritas berdasarkan dampaknya terhadap perangkat dan kesinambungan operasional.",
          "Terakhir, hasil pemetaan diterjemahkan menjadi rekomendasi yang dapat dijalankan. Dokumentasi yang rapi membuat evaluasi berikutnya lebih mudah dan membantu tim mengambil keputusan secara konsisten.",
        ],
        publishedAt: "2026-03-09",
        image: "/images/media/power-distribution.jpg",
        imageAlt: "Jaringan transmisi listrik membentang menuju cakrawala",
      },
      {
        id: "device-protection-foundation",
        slug: "perlindungan-perangkat-dimulai-dari-fondasi-stabil",
        category: "technology",
        title: "Perlindungan Perangkat Dimulai dari Fondasi yang Stabil",
        excerpt:
          "Perlindungan perangkat bukan hanya lapisan tambahan, melainkan bagian dari rancangan kelistrikan yang menyeluruh.",
        body: [
          "Perangkat digital membutuhkan lingkungan kelistrikan yang mendukung agar dapat bekerja secara konsisten. Perlindungan yang efektif perlu mempertimbangkan hubungan antara sumber daya, distribusi, dan karakter perangkat.",
          "Dengan melihat sistem secara menyeluruh, pelanggan dapat membangun langkah perlindungan yang lebih sesuai dengan kebutuhan operasional dan rencana pengembangan teknologinya.",
        ],
        publishedAt: "2026-02-21",
        image: "/images/media/electrical-inspection.jpg",
        imageAlt: "Teknisi melakukan pemeriksaan presisi pada perangkat elektronik",
      },
      {
        id: "operational-readiness",
        slug: "membangun-budaya-operasional-yang-lebih-siap",
        category: "news",
        title: "Membangun Budaya Operasional yang Lebih Siap",
        excerpt:
          "Keandalan sistem tumbuh dari kombinasi infrastruktur yang tepat, proses yang disiplin, dan komunikasi yang terbuka.",
        body: [
          "Keandalan kelistrikan tidak hanya ditentukan oleh perangkat yang terpasang. Cara tim memahami kondisi, merespons tanda awal gangguan, dan mendokumentasikan tindakan juga menjadi bagian penting dari kesiapan operasional.",
          "Dengan komunikasi yang konsisten antara tim teknis dan pengguna, evaluasi dapat dilakukan lebih cepat dan perbaikan dapat diarahkan pada kebutuhan yang paling berdampak.",
        ],
        publishedAt: "2026-01-15",
        image: "/images/media/industrial-control-panel.jpg",
        imageAlt: "Panel kontrol industri dengan meter dan sakelar pengaman",
      },
    ],
  },
  en: {
    heroImage: "/images/media/media-hero-en.jpg",
    eyebrow: "AFANA / MEDIA & INFORMATION",
    title: "Insights for more reliable electrical systems",
    description:
      "Explore Afana's ideas, developments, and perspectives on building an electrical foundation ready to support technology and customer operations.",
    featuredLabel: "Featured",
    latestLabel: "Latest media",
    allLabel: "All",
    categoryLabels: {
      news: "Afana News",
      insight: "Electrical Insights",
      technology: "Technology & Operations",
    },
    readMoreLabel: "Read more",
    backLabel: "Back to Media & Information",
    relatedLabel: "Related reading",
    items: [
      {
        id: "power-quality-foundation",
        slug: "kualitas-daya-fondasi-keandalan-perangkat",
        category: "insight",
        title: "Power Quality: The Foundation of Digital Device Reliability",
        excerpt:
          "Understanding power quality helps companies take more precise steps to protect devices and maintain operations.",
        body: [
          "Electronic and digital devices operate as part of connected operational systems. When power quality is unstable, the impact can appear as performance issues, shorter device life, or interruptions to activities that depend on technology.",
          "Electrical assessment should therefore begin with an understanding of real site conditions. Voltage, load distribution, protection, and usage patterns need to be considered together so sources of risk can be mapped more clearly.",
          "A measured approach helps customers prioritise improvements and protection according to their needs. The solution is not only intended to respond to disruption, but also to build a foundation ready for future device development.",
        ],
        publishedAt: "2026-06-12",
        image: "/images/media/data-center-power.jpg",
        imageAlt: "Server racks and network cabling inside a data center",
        featured: true,
      },
      {
        id: "integrated-electrical-approach",
        slug: "pendekatan-terintegrasi-solusi-kelistrikan",
        category: "news",
        title: "Afana Strengthens Its Integrated Electrical Solutions Approach",
        excerpt:
          "A dependable electrical solution begins with understanding the relationship between infrastructure, devices, and operational needs.",
        body: [
          "Afana is developing a way of working that connects customers' electrical conditions with their technology needs. Each engagement is shaped through site mapping, risk identification, and relevant recommendations.",
          "This approach helps customers see the solution as a whole. The work goes beyond installation or repair and is intended to create systems that can be understood, monitored, and developed over time.",
        ],
        publishedAt: "2026-05-24",
        image: "/images/media/integrated-engineering.jpg",
        imageAlt: "Technician examining equipment in an industrial workplace",
      },
      {
        id: "technology-readiness",
        slug: "kesiapan-teknologi-dimulai-dari-infrastruktur-listrik",
        category: "technology",
        title: "Technology Readiness Starts with Electrical Infrastructure",
        excerpt:
          "Advancing technology needs to move together with infrastructure that is safe, stable, and easy to maintain.",
        body: [
          "Increasingly capable technology brings new demands to operational environments. Electrical infrastructure needs to be prepared to support devices with different requirements and characteristics.",
          "Readiness includes understanding loads, protecting devices, and creating monitoring practices that allow disruption to be recognised early. With the right foundation, technology investments can deliver more consistent value.",
        ],
        publishedAt: "2026-04-18",
        image: "/images/media/technology-readiness.jpg",
        imageAlt: "Circuit board detail representing the foundation of technology devices",
      },
      {
        id: "electrical-risk-mapping",
        slug: "tiga-langkah-memetakan-risiko-kelistrikan",
        category: "insight",
        title: "Three Starting Steps for Mapping Electrical Risk",
        excerpt:
          "A structured assessment helps teams identify the most important actions before disruption grows.",
        body: [
          "The first step is understanding how the system is used each day. Operating patterns, critical devices, and the impact of disruption should be recorded so the analysis has a clear context.",
          "The next step is identifying points that may create disruption, then prioritising them based on their impact on devices and operational continuity.",
          "Finally, the assessment is translated into practical recommendations. Clear documentation makes the next evaluation easier and helps teams make decisions consistently.",
        ],
        publishedAt: "2026-03-09",
        image: "/images/media/power-distribution.jpg",
        imageAlt: "Electrical transmission network extending toward the horizon",
      },
      {
        id: "device-protection-foundation",
        slug: "perlindungan-perangkat-dimulai-dari-fondasi-stabil",
        category: "technology",
        title: "Device Protection Starts with a Stable Foundation",
        excerpt:
          "Device protection is not merely an additional layer; it is part of a complete electrical design.",
        body: [
          "Digital devices need a supportive electrical environment to operate consistently. Effective protection needs to consider the relationship between the source, distribution, and device characteristics.",
          "By looking at the system as a whole, customers can build protection measures that better suit their operational needs and technology development plans.",
        ],
        publishedAt: "2026-02-21",
        image: "/images/media/electrical-inspection.jpg",
        imageAlt: "Technician performing precision inspection on electronic equipment",
      },
      {
        id: "operational-readiness",
        slug: "membangun-budaya-operasional-yang-lebih-siap",
        category: "news",
        title: "Building a More Prepared Operational Culture",
        excerpt:
          "System reliability grows from the combination of suitable infrastructure, disciplined processes, and open communication.",
        body: [
          "Electrical reliability is not determined only by installed equipment. How teams understand conditions, respond to early signs of disruption, and document actions also forms part of operational readiness.",
          "With consistent communication between technical teams and users, evaluations can happen faster and improvements can focus on the needs with the greatest impact.",
        ],
        publishedAt: "2026-01-15",
        image: "/images/media/industrial-control-panel.jpg",
        imageAlt: "Industrial control panel with meters and safety switches",
      },
    ],
  },
};

export function getMediaItem(locale: Locale, slug: string) {
  return mediaPageContent[locale].items.find((item) => item.slug === slug);
}
