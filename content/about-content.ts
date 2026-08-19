import type { Locale } from "@/content/site-content";

export type AboutTimelineItem = {
  id: string;
  period: string;
  title: string;
  body: string[];
  image: string;
  imageAlt: string;
};

export type AboutTimelineContent = {
  journeyLabel: string;
  periodLabel: string;
  previousLabel: string;
  nextLabel: string;
  slideLabel: string;
  items: AboutTimelineItem[];
};

export type AboutSection = {
  id: string;
  title: string;
  body: string[];
  blocks?: Array<{
    title: string;
    body: string[];
    list?: string[];
  }>;
  image?: {
    src: string;
    alt: string;
  };
  timeline?: AboutTimelineContent;
};

export type AboutPageContent = {
  heroImage: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  title: string;
  description: string;
  tabs: Array<{ label: string; target: string }>;
  sections: AboutSection[];
};

export const aboutPageContent: Record<Locale, AboutPageContent> = {
  id: {
    heroImage: "/hero/photo-automobile-production-line-welding-car-body-modern-car-assembly-plant-auto-industry-interior-hightech-factory-modern-production.jpg",
    breadcrumbHome: "Beranda",
    breadcrumbCurrent: "Profil Perusahaan",
    title: "Profil Perusahaan",
    description: "Afana hadir untuk menjalankan bisnis secara profesional dan memberikan solusi kelistrikan yang terintegrasi bagi pelanggan.",
    tabs: [
      { label: "Profil Afana", target: "#profil-afana" },
      { label: "Latar Belakang", target: "#latar-belakang" },
      { label: "Visi & Misi", target: "#visi-misi" },
      { label: "Fokus Solusi", target: "#fokus-solusi" },
      { label: "Peran Afana", target: "#peran-afana" },
    ],
    sections: [
      {
        id: "profil-afana",
        title: "Afana",
        body: [
          "Afana adalah perusahaan yang terbentuk dari ide untuk mewadahi dan menjalankan bisnis para pendirinya yang sebelumnya berjalan secara perorangan. Dengan pengalaman yang telah dibangun dari berbagai bidang, Afana hadir sebagai sarana untuk menyatukan keahlian, memperluas manfaat, dan menjalankan bisnis secara profesional.",
          "Sejak awal, Afana dibangun dengan keyakinan bahwa kualitas layanan tidak hanya ditentukan oleh produk atau perangkat yang digunakan, tetapi juga oleh kemampuan untuk memahami kebutuhan pelanggan secara menyeluruh. Karena itu, setiap pekerjaan dimulai dengan mendengarkan, memetakan kondisi, dan menyusun solusi yang sesuai dengan tujuan operasional pelanggan.",
          "Afana berfokus pada solusi kelistrikan yang menjadi penyebab 80% kerusakan perangkat elektronik dan digital pelanggan. Fokus ini lahir dari kenyataan bahwa perkembangan teknologi IT yang semakin cepat perlu didukung oleh infrastruktur kelistrikan yang stabil, aman, dan dirancang dengan tepat.",
          "Melalui pendekatan yang terintegrasi, Afana membantu pelanggan melihat hubungan antara kualitas daya listrik, perlindungan perangkat, kesinambungan operasional, dan efisiensi biaya. Solusi yang diberikan tidak berhenti pada pemasangan atau perbaikan, tetapi diarahkan untuk membangun sistem yang dapat dipahami, dipantau, dan dikembangkan bersama.",
          "Dalam menjalankan perannya, Afana menempatkan profesionalisme, ketepatan, dan komunikasi terbuka sebagai dasar pelayanan. Setiap kebutuhan memiliki tantangan yang berbeda, sehingga solusi dirancang dengan mempertimbangkan kondisi lapangan, karakter perangkat, skala usaha, serta rencana pengembangan pelanggan di masa mendatang.",
          "Afana ingin menjadi jembatan antara kebutuhan teknologi dan realitas kelistrikan di Indonesia. Dengan fondasi pengalaman para pendirinya dan semangat untuk terus belajar, Afana bertumbuh sebagai mitra yang membantu pelanggan menjaga perangkat tetap terlindungi, operasi tetap berjalan, dan investasi teknologi menghasilkan manfaat yang maksimal.",
        ],
        image: {
          src: "/images/about/afana-technicians.jpg",
          alt: "Dua teknisi Afana memeriksa panel kelistrikan di lingkungan industri",
        },
      },
      {
        id: "latar-belakang",
        title: "Berangkat dari Pengalaman",
        body: [],
        timeline: {
          journeyLabel: "Perjalanan",
          periodLabel: "Pilih periode perjalanan Afana",
          previousLabel: "Periode sebelumnya",
          nextLabel: "Periode berikutnya",
          slideLabel: "Periode",
          items: [
            {
              id: "field-foundation",
              period: "2019–2020",
              title: "Pengalaman yang Menjadi Fondasi",
              body: [
                "Perjalanan Afana berawal dari pengalaman para pendirinya menangani kebutuhan kelistrikan dan perangkat elektronik secara mandiri. Kedekatan dengan kondisi lapangan membentuk pemahaman bahwa gangguan kecil pada kualitas daya dapat berdampak besar pada operasional pelanggan.",
                "Fase ini menjadi fondasi cara kerja Afana: mendengarkan kebutuhan, memetakan risiko, lalu menawarkan langkah yang realistis dan dapat dipertanggungjawabkan.",
              ],
              image: "/images/about/Our-Background-1.jpg",
              imageAlt: "Ruang pertemuan yang menjadi simbol awal kolaborasi Afana",
            },
            {
              id: "united-expertise",
              period: "2021",
              title: "Keahlian Mulai Disatukan",
              body: [
                "Pengalaman yang sebelumnya berjalan secara perorangan mulai dipertemukan dalam satu arah. Keahlian teknis, pemahaman operasional, dan orientasi pelayanan disusun menjadi pendekatan kerja yang lebih terkoordinasi.",
                "Kolaborasi tersebut melahirkan komitmen untuk membangun layanan kelistrikan yang tidak hanya menyelesaikan masalah saat ini, tetapi juga membantu pelanggan mengantisipasi kebutuhan berikutnya.",
              ],
              image: "/images/about/Our-Background-2.jpg",
              imageAlt: "Koridor kantor modern yang menggambarkan proses penyatuan kerja Afana",
            },
            {
              id: "afana-growth",
              period: "2022",
              title: "Afana Mulai Bertumbuh",
              body: [
                "Afana mulai bertumbuh sebagai wadah profesional yang menghubungkan pengalaman para pendiri dengan kebutuhan pelanggan yang semakin kompleks. Setiap pekerjaan digunakan untuk memperkuat ketelitian, komunikasi, dan kualitas pelaksanaan di lapangan.",
                "Pada tahap ini, perlindungan perangkat elektronik dan digital ditempatkan sebagai bagian penting dari solusi, bukan sekadar hasil tambahan dari pekerjaan kelistrikan.",
              ],
              image: "/images/about/Our-Background-3.jpg",
              imageAlt: "Dua teknisi Afana memeriksa sistem kelistrikan di lingkungan industri",
            },
            {
              id: "service-standard",
              period: "2023",
              title: "Standar Layanan Terintegrasi",
              body: [
                "Afana memperkuat standar layanan melalui proses yang lebih terstruktur, mulai dari pemetaan kondisi, identifikasi risiko, rekomendasi teknis, hingga evaluasi hasil pekerjaan. Pendekatan ini membantu setiap solusi tetap relevan dengan kondisi nyata pelanggan.",
                "Integrasi antara aspek kelistrikan dan kebutuhan teknologi menjadi pembeda yang terus dikembangkan agar sistem bekerja lebih aman, stabil, dan mudah dipelihara.",
              ],
              image: "/images/about/Our-Background-4.jpg",
              imageAlt: "Peralatan kelistrikan pada fasilitas industri modern",
            },
            {
              id: "wider-collaboration",
              period: "2024–2025",
              title: "Kolaborasi yang Lebih Luas",
              body: [
                "Kebutuhan pelanggan yang beragam mendorong Afana memperluas kolaborasi dan memperdalam pemahaman terhadap karakter berbagai industri. Setiap kerja sama dipandang sebagai hubungan jangka panjang yang dibangun melalui transparansi dan konsistensi pelayanan.",
                "Afana terus menyempurnakan kemampuannya untuk menjembatani kebutuhan bisnis, teknologi, dan infrastruktur kelistrikan dalam satu solusi yang terarah.",
              ],
              image: "/images/about/Our-Background-5.jpg",
              imageAlt: "Jembatan kota bercahaya sebagai simbol perluasan kolaborasi Afana",
            },
            {
              id: "reliable-future",
              period: "2026–Kini",
              title: "Keandalan untuk Masa Depan",
              body: [
                "Afana bergerak menuju masa depan dengan fokus pada keandalan kelistrikan yang mampu mendukung perkembangan teknologi. Perlindungan perangkat, kesinambungan operasional, dan kesiapan sistem menjadi bagian dari satu tujuan yang sama.",
                "Dengan semangat belajar dan beradaptasi, Afana ingin terus hadir sebagai mitra yang membantu pelanggan membangun fondasi kelistrikan yang lebih tangguh, efisien, dan siap berkembang.",
              ],
              image: "/images/about/Our-Background-6.jpg",
              imageAlt: "Infrastruktur transformator listrik sebagai simbol kesiapan masa depan Afana",
            },
          ],
        },
      },
      {
        id: "visi-misi",
        title: "Visi & Misi",
        body: [],
        blocks: [
          {
            title: "Visi",
            body: [
              "Visi Afana adalah menjadi mitra strategis yang dipercaya dalam menghadirkan keandalan kelistrikan—melindungi teknologi, menjaga kesinambungan operasional, dan mendukung pertumbuhan bisnis pelanggan.",
            ],
            list: [
              "Keandalan kelistrikan: memperkuat perlindungan perangkat dan menjaga operasional pelanggan tetap berjalan.",
              "Kesiapsiagaan teknologi: membantu pelanggan mengantisipasi risiko sebelum berkembang menjadi gangguan.",
              "Pertumbuhan berkelanjutan: membangun fondasi kelistrikan yang siap mendukung kebutuhan bisnis di masa depan.",
            ],
          },
          {
            title: "Misi",
            body: [
              "Untuk mewujudkan visi tersebut, Afana menjalankan misi dengan menghadirkan solusi kelistrikan yang terintegrasi, presisi, dan dapat dipertanggungjawabkan; mulai dari memahami kondisi lapangan, mengidentifikasi sumber risiko, hingga memastikan setiap sistem bekerja secara optimal.",
              "Afana menggabungkan pengalaman teknis, pemahaman terhadap kebutuhan industri, dan pelayanan yang responsif untuk membantu pelanggan mencegah kerusakan, mengurangi gangguan operasional, serta memperoleh nilai maksimal dari investasi perangkat elektronik dan digital.",
              "Lebih dari sekadar penyedia layanan, Afana membangun hubungan jangka panjang sebagai mitra yang hadir sebelum masalah terjadi, bekerja dengan standar profesional, dan terus berkembang bersama pelanggan.",
            ],
          },
        ],
      },
      {
        id: "fokus-solusi",
        title: "Fokus pada Solusi Kelistrikan",
        body: [
          "Afana memusatkan keahlian pada solusi kelistrikan yang berperan penting dalam mencegah kerusakan perangkat elektronik dan digital pelanggan. Fokus ini berangkat dari pemahaman bahwa kualitas daya, keamanan instalasi, dan kestabilan sistem memiliki pengaruh langsung terhadap keandalan teknologi yang digunakan dalam kegiatan operasional.",
          "Dengan pengalaman di lapangan, Afana membantu pelanggan memahami kondisi kelistrikan secara lebih menyeluruh—mulai dari mengidentifikasi potensi gangguan, memetakan risiko, hingga menyusun rekomendasi yang sesuai dengan kebutuhan dan karakteristik perangkat. Setiap solusi dirancang secara terukur agar dapat diterapkan secara efektif, mudah dipantau, dan dipertanggungjawabkan.",
          "Pendekatan Afana tidak berhenti pada penanganan masalah yang muncul. Kami berupaya membangun fondasi kelistrikan yang lebih aman, stabil, dan siap mendukung perkembangan teknologi pelanggan. Dengan demikian, pelanggan dapat mengurangi risiko kerusakan, menjaga kesinambungan operasional, dan memperoleh manfaat yang lebih optimal dari investasi perangkat elektronik maupun digital.",
        ],
      },
      {
        id: "peran-afana",
        title: "Menjembatani Teknologi & Kelistrikan",
        body: [
          "Afana menjadi solusi yang menjembatani perkembangan teknologi IT yang semakin canggih dengan kondisi kelistrikan yang kurang baik di Indonesia. Kami membantu pelanggan membangun fondasi kelistrikan yang lebih siap agar teknologi dapat bekerja secara optimal dan berkelanjutan.",
        ],
      },
    ],
  },
  en: {
    heroImage: "/hero/photo-automobile-production-line-welding-car-body-modern-car-assembly-plant-auto-industry-interior-hightech-factory-modern-production.jpg",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Company Profile",
    title: "Company Profile",
    description: "Afana exists to operate businesses professionally and provide integrated electrical solutions for customers.",
    tabs: [
      { label: "Afana Profile", target: "#profil-afana" },
      { label: "Our Background", target: "#latar-belakang" },
      { label: "Vision & Mission", target: "#visi-misi" },
      { label: "Solution Focus", target: "#fokus-solusi" },
      { label: "Afana's Role", target: "#peran-afana" },
    ],
    sections: [
      {
        id: "profil-afana",
        title: "Afana",
        body: [
          "Afana was formed from the idea of bringing together and operating the businesses of its founders, which had previously been run individually. Built on experience from different fields, Afana provides a professional platform for combining expertise, expanding its impact, and delivering dependable business services.",
          "From the beginning, Afana has believed that service quality is shaped not only by the products or equipment used, but also by the ability to understand each customer's needs as a whole. Every engagement therefore begins by listening, mapping the existing conditions, and building a solution that supports the customer's operational goals.",
          "Afana focuses on electrical solutions for issues that cause 80% of damage to customers' electronic and digital devices. This focus comes from a simple reality: increasingly advanced IT technology needs stable, safe, and properly designed electrical infrastructure behind it.",
          "Through an integrated approach, Afana helps customers understand the relationship between power quality, device protection, operational continuity, and cost efficiency. Our work goes beyond installation or repair; it is designed to create systems that can be understood, monitored, and developed together over time.",
          "Afana builds its service on professionalism, accuracy, and open communication. Every customer faces different challenges, so each solution considers the site conditions, device characteristics, business scale, and the customer's future development plans.",
          "Afana aims to bridge the gap between technology needs and the electrical realities of Indonesia. With the founders' experience and a commitment to continuous learning, Afana grows as a partner that helps customers protect their devices, keep operations running, and gain the greatest value from their technology investments.",
        ],
        image: {
          src: "/images/about/afana-technicians.jpg",
          alt: "Two Afana technicians inspecting an electrical panel in an industrial environment",
        },
      },
      {
        id: "latar-belakang",
        title: "Built on Experience",
        body: [],
        timeline: {
          journeyLabel: "Journey",
          periodLabel: "Choose a period in Afana's journey",
          previousLabel: "Previous period",
          nextLabel: "Next period",
          slideLabel: "Period",
          items: [
            {
              id: "field-foundation",
              period: "2019–2020",
              title: "Experience as the Foundation",
              body: [
                "Afana's journey began with the founders independently handling electrical and electronic equipment needs. Working close to real site conditions built an understanding that even a small power-quality issue can have a major impact on a customer's operations.",
                "This phase shaped Afana's way of working: listen to the need, map the risk, and propose practical steps that can be clearly accounted for.",
              ],
              image: "/images/about/Our-Background-1.jpg",
              imageAlt: "A meeting room symbolising the beginning of Afana's collaboration",
            },
            {
              id: "united-expertise",
              period: "2021",
              title: "Expertise Brought Together",
              body: [
                "Experience that had previously developed individually began moving in one direction. Technical expertise, operational understanding, and a service mindset were organised into a more coordinated way of working.",
                "That collaboration created a commitment to build electrical services that solve today's issues while helping customers anticipate what comes next.",
              ],
              image: "/images/about/Our-Background-2.jpg",
              imageAlt: "A modern office corridor representing Afana's coordinated way of working",
            },
            {
              id: "afana-growth",
              period: "2022",
              title: "Afana Began to Grow",
              body: [
                "Afana began growing as a professional platform connecting the founders' experience with increasingly complex customer needs. Every project became an opportunity to strengthen accuracy, communication, and the quality of field execution.",
                "At this stage, protecting electronic and digital equipment became an essential part of the solution rather than a secondary outcome of electrical work.",
              ],
              image: "/images/about/Our-Background-3.jpg",
              imageAlt: "Two Afana technicians inspecting an electrical system in an industrial environment",
            },
            {
              id: "service-standard",
              period: "2023",
              title: "Integrated Service Standards",
              body: [
                "Afana strengthened its service standards through a more structured process, from site mapping and risk identification to technical recommendations and result evaluation. This approach keeps every solution relevant to the customer's actual conditions.",
                "The integration of electrical requirements and technology needs became a distinction that Afana continues to develop for safer, more stable, and easier-to-maintain systems.",
              ],
              image: "/images/about/Our-Background-4.jpg",
              imageAlt: "Electrical equipment inside a modern industrial facility",
            },
            {
              id: "wider-collaboration",
              period: "2024–2025",
              title: "Broader Collaboration",
              body: [
                "A wider range of customer needs encouraged Afana to expand collaboration and deepen its understanding of different industries. Each engagement is treated as a long-term relationship built through transparency and consistent service.",
                "Afana continues refining its ability to connect business requirements, technology, and electrical infrastructure within one focused solution.",
              ],
              image: "/images/about/Our-Background-5.jpg",
              imageAlt: "An illuminated city bridge symbolising Afana's broader collaboration",
            },
            {
              id: "reliable-future",
              period: "2026–Present",
              title: "Reliability for the Future",
              body: [
                "Afana moves forward with a focus on electrical reliability that can support continued technological development. Device protection, operational continuity, and system readiness are treated as parts of the same objective.",
                "With a commitment to learning and adapting, Afana aims to remain a partner that helps customers build a stronger, more efficient, and growth-ready electrical foundation.",
              ],
              image: "/images/about/Our-Background-6.jpg",
              imageAlt: "Electrical transformer infrastructure symbolising Afana's future readiness",
            },
          ],
        },
      },
      {
        id: "visi-misi",
        title: "Vision & Mission",
        body: [],
        blocks: [
          {
            title: "Vision",
            body: [
              "Afana's vision is to become a trusted strategic partner for electrical reliability—protecting technology, maintaining operational continuity, and supporting the growth of every customer's business.",
            ],
            list: [
              "Electrical reliability: strengthening device protection and keeping customer operations running.",
              "Technology readiness: helping customers anticipate risks before they become disruptions.",
              "Sustainable growth: building an electrical foundation ready to support future business needs.",
            ],
          },
          {
            title: "Mission",
            body: [
              "To bring this vision to life, Afana's mission is to deliver integrated, precise, and accountable electrical solutions; from understanding site conditions and identifying sources of risk to ensuring every system performs at its best.",
              "Afana combines technical experience, an understanding of industry needs, and responsive service to help customers prevent damage, reduce operational disruption, and gain greater value from their electronic and digital investments.",
              "More than a service provider, Afana builds long-term relationships as a partner that helps customers act before problems occur, works to professional standards, and continues to grow alongside them.",
            ],
          },
        ],
      },
      {
        id: "fokus-solusi",
        title: "Focused on Electrical Solutions",
        body: [
          "Afana focuses its expertise on electrical solutions that play an important role in preventing damage to customers' electronic and digital devices. This focus is grounded in the understanding that power quality, installation safety, and system stability directly influence the reliability of the technology used in daily operations.",
          "Drawing on field experience, Afana helps customers understand their electrical conditions more comprehensively—from identifying potential disruptions and mapping risks to developing recommendations suited to their needs and equipment characteristics. Each solution is designed to be measured, effective to implement, easy to monitor, and accountable.",
          "Afana's approach goes beyond addressing problems after they occur. We work to build a safer, more stable electrical foundation that is ready to support our customers' technology as it develops. This helps reduce the risk of damage, maintain operational continuity, and maximise the value of electronic and digital investments.",
        ],
      },
      {
        id: "peran-afana",
        title: "Bridging Technology & Electrical Infrastructure",
        body: [
          "Afana bridges increasingly advanced IT technology with the challenges of inadequate electrical conditions in Indonesia. We help customers build a stronger electrical foundation so their technology can perform reliably and sustainably.",
        ],
      },
    ],
  },
};
