import type { Locale } from "@/content/site-content";

export type SustainabilityStep = {
  number: string;
  title: string;
  body: string;
};

export type SustainabilityFocus = {
  title: string;
  body: string;
};

export type SustainabilityPageContent = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  eyebrow: string;
  title: string;
  description: string;
  introductionLabel: string;
  introductionTitle: string;
  introductionBody: string[];
  flowLabel: string;
  flowTitle: string;
  flowDescription: string;
  steps: SustainabilityStep[];
  focusLabel: string;
  focusTitle: string;
  focuses: SustainabilityFocus[];
  practiceLabel: string;
  practiceTitle: string;
  practices: SustainabilityFocus[];
  impactImageAlt: string;
  impactLabel: string;
  impactTitle: string;
  impacts: string[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
  heroImage: string;
  inspectionImage: string;
  infrastructureImage: string;
};

export const sustainabilityPageContent: Record<Locale, SustainabilityPageContent> = {
  id: {
    breadcrumbHome: "Beranda",
    breadcrumbCurrent: "Keberlanjutan",
    eyebrow: "AFANA / KEBERLANJUTAN",
    title: "Menjaga energi bekerja lebih baik, lebih lama.",
    description: "Keberlanjutan bagi Afana dimulai dari sistem kelistrikan yang dipahami, dirancang dengan tepat, dan dirawat untuk menjaga nilai perangkat serta kesinambungan operasi.",
    introductionLabel: "Cara pandang",
    introductionTitle: "Keberlanjutan bukan sekadar mengurangi pemakaian energi.",
    introductionBody: [
      "Setiap sistem kelistrikan memiliki kondisi, beban, perangkat, dan kebutuhan operasi yang berbeda. Karena itu, langkah yang berkelanjutan tidak dimulai dari solusi yang paling besar, tetapi dari pemahaman yang paling tepat.",
      "Afana melihat kualitas daya sebagai bagian dari perjalanan yang lebih panjang: energi digunakan sesuai kebutuhan, perangkat terlindungi, pemeliharaan dapat direncanakan, dan keputusan teknis tetap memiliki nilai bagi operasi di masa depan.",
    ],
    flowLabel: "Alur nilai energi",
    flowTitle: "Dari kondisi lapangan menjadi nilai yang bertahan.",
    flowDescription: "Empat langkah ini menjadi cara Afana menerjemahkan kebutuhan kelistrikan ke dalam keputusan yang lebih terukur dan dapat dipelihara.",
    steps: [
      { number: "01", title: "Pahami kondisi", body: "Membaca kebutuhan, beban, risiko, dan karakter perangkat sebelum menentukan arah." },
      { number: "02", title: "Stabilkan daya", body: "Menyusun kualitas daya yang sesuai agar sistem bekerja lebih tenang dan konsisten." },
      { number: "03", title: "Lindungi perangkat", body: "Mengurangi tekanan pada perangkat melalui perlindungan dan rancangan yang tepat." },
      { number: "04", title: "Perpanjang nilai aset", body: "Menjaga investasi teknologi tetap relevan melalui pemeliharaan dan pengembangan bertahap." },
    ],
    focusLabel: "Fokus keberlanjutan",
    focusTitle: "Prinsip yang hadir di setiap solusi.",
    focuses: [
      { title: "Efisiensi yang relevan", body: "Efisiensi bukan angka yang berdiri sendiri. Ia harus sesuai dengan pola penggunaan, kapasitas, dan prioritas operasi pelanggan." },
      { title: "Keandalan yang terjaga", body: "Sistem yang dapat dipahami dan dipantau membantu mengurangi keputusan reaktif serta menjaga ritme kerja perangkat." },
      { title: "Nilai aset yang lebih panjang", body: "Perlindungan dan perawatan yang tepat membantu perangkat digunakan dengan lebih bertanggung jawab sepanjang siklusnya." },
    ],
    practiceLabel: "Praktik di lapangan",
    practiceTitle: "Tiga kebiasaan teknis yang menjaga arah tetap nyata.",
    practices: [
      { title: "Audit sebelum menambah", body: "Kami memulai dari kondisi yang ada untuk menemukan kebutuhan sebenarnya sebelum merekomendasikan perubahan." },
      { title: "Rancang agar mudah dirawat", body: "Solusi perlu dapat dibaca, diakses, dan dikembangkan oleh orang yang akan menjaganya setelah pekerjaan selesai." },
      { title: "Tindak lanjut setelah pemasangan", body: "Keberlanjutan tidak berhenti ketika sistem menyala. Pengamatan dan komunikasi menjaga keputusan tetap relevan." },
    ],
    impactImageAlt: "Ruang panel kelistrikan industri yang tertata dan terawat",
    impactLabel: "Dampak yang ingin dibangun",
    impactTitle: "Keputusan kelistrikan yang lebih tenang untuk hari ini dan berikutnya.",
    impacts: [
      "Energi digunakan dengan pemahaman yang lebih baik.",
      "Gangguan dapat diantisipasi melalui sistem yang lebih terbaca.",
      "Perangkat memiliki perlindungan yang sesuai dengan kebutuhannya.",
      "Pengembangan dilakukan berdasarkan kondisi nyata, bukan asumsi.",
    ],
    ctaTitle: "Mulai dari sistem yang lebih dipahami.",
    ctaLabel: "Pelajari fokus solusi Afana",
    ctaHref: "/tentang-kami#fokus-solusi",
    heroImage: "/images/sustainability/sustainability-hero.png",
    inspectionImage: "/images/sustainability/power-quality-inspection.png",
    infrastructureImage: "/images/sustainability/maintained-infrastructure.png",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Sustainability",
    eyebrow: "AFANA / SUSTAINABILITY",
    title: "Keeping energy working better, for longer.",
    description: "For Afana, sustainability begins with electrical systems that are understood, precisely designed, and maintained to protect asset value and operational continuity.",
    introductionLabel: "Our perspective",
    introductionTitle: "Sustainability is more than using less energy.",
    introductionBody: [
      "Every electrical system has different conditions, loads, devices, and operational needs. A sustainable step therefore does not begin with the largest solution, but with the clearest understanding.",
      "Afana sees power quality as part of a longer journey: energy is used with purpose, devices are protected, maintenance can be planned, and technical decisions continue to serve the operation ahead.",
    ],
    flowLabel: "Energy value flow",
    flowTitle: "Turning field conditions into lasting value.",
    flowDescription: "These four steps are how Afana translates electrical needs into decisions that are more measured and easier to maintain.",
    steps: [
      { number: "01", title: "Understand conditions", body: "Read the needs, loads, risks, and device characteristics before setting a direction." },
      { number: "02", title: "Stabilise power", body: "Shape power quality around what the system needs to work calmly and consistently." },
      { number: "03", title: "Protect devices", body: "Reduce stress on equipment through the right protection and system design." },
      { number: "04", title: "Extend asset value", body: "Keep technology investments relevant through maintenance and considered development." },
    ],
    focusLabel: "Sustainability focus",
    focusTitle: "Principles present in every solution.",
    focuses: [
      { title: "Relevant efficiency", body: "Efficiency is not a standalone number. It must fit the customer's usage, capacity, and operational priorities." },
      { title: "Reliable continuity", body: "Systems that can be understood and monitored help reduce reactive decisions and protect the rhythm of operations." },
      { title: "Longer asset value", body: "The right protection and care help devices serve their purpose responsibly across their lifecycle." },
    ],
    practiceLabel: "In the field",
    practiceTitle: "Three technical habits that keep the direction real.",
    practices: [
      { title: "Audit before adding", body: "We start with existing conditions to find the real need before recommending change." },
      { title: "Design for maintenance", body: "A solution should be readable, accessible, and ready to be developed by the people who maintain it." },
      { title: "Follow through after installation", body: "Sustainability does not end when a system is switched on. Observation and communication keep decisions relevant." },
    ],
    impactImageAlt: "An orderly and well-maintained industrial electrical panel room",
    impactLabel: "The impact we want to build",
    impactTitle: "Quieter electrical decisions for today and what comes next.",
    impacts: [
      "Energy is used with greater understanding.",
      "Disruptions can be anticipated through systems that are easier to read.",
      "Devices receive protection suited to their needs.",
      "Development follows real conditions rather than assumptions.",
    ],
    ctaTitle: "Start with a system you can understand.",
    ctaLabel: "Explore Afana's solution focus",
    ctaHref: "/about#fokus-solusi",
    heroImage: "/images/sustainability/sustainability-hero.png",
    inspectionImage: "/images/sustainability/power-quality-inspection.png",
    infrastructureImage: "/images/sustainability/maintained-infrastructure.png",
  },
};
