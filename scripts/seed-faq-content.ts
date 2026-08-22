import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

import { FaqWorkflowStatus } from "../generated/prisma/enums";
import { Prisma, PrismaClient } from "../generated/prisma/client";

config({ path: ".env.local" });
config();

const categories = [
  { slug: "general", titleId: "Informasi Umum", titleEn: "General Information" },
  { slug: "electrical-solutions", titleId: "Solusi Kelistrikan", titleEn: "Electrical Solutions" },
  { slug: "project-consultation", titleId: "Konsultasi Proyek", titleEn: "Project Consultation" },
  { slug: "support", titleId: "Dukungan & Pemeliharaan", titleEn: "Support & Maintenance" },
  { slug: "partnership", titleId: "Kemitraan & Pengadaan", titleEn: "Partnership & Procurement" },
] as const;

const faqs = [
  {
    category: "general",
    id: {
      question: "Apa itu Afana?",
      answer: "Afana adalah perusahaan yang berfokus pada solusi kelistrikan untuk membantu melindungi perangkat dan mendukung kesinambungan operasi. Ruang lingkup solusi disesuaikan dengan kondisi serta kebutuhan setiap pelanggan.",
    },
    en: {
      question: "What is Afana?",
      answer: "Afana is a company focused on electrical solutions that help protect equipment and support operational continuity. The scope of each solution is adjusted to the customer's conditions and requirements.",
    },
  },
  {
    category: "general",
    id: {
      question: "Di mana Afana berlokasi?",
      answer: "Afana berlokasi di Banyuwangi. Silakan hubungi tim kami terlebih dahulu melalui halaman Kontak untuk mengatur komunikasi atau pertemuan yang sesuai.",
    },
    en: {
      question: "Where is Afana located?",
      answer: "Afana is located in Banyuwangi. Please contact our team through the Contact page first to arrange the most suitable communication or meeting.",
    },
  },
  {
    category: "general",
    id: {
      question: "Bagaimana cara menghubungi tim Afana?",
      answer: "Anda dapat menggunakan formulir pada halaman Kontak atau memilih kanal email, telepon, dan WhatsApp yang sedang ditampilkan di website. Sertakan ringkasan kebutuhan agar tim dapat menindaklanjuti dengan konteks yang cukup.",
    },
    en: {
      question: "How can I contact the Afana team?",
      answer: "Use the form on the Contact page or choose any email, phone, or WhatsApp channel currently displayed on the website. Include a short summary of your needs so the team has enough context to follow up.",
    },
  },
  {
    category: "general",
    id: {
      question: "Siapa yang dapat berkonsultasi dengan Afana?",
      answer: "Calon pelanggan, mitra, tim pengadaan, maupun pihak lain yang memiliki kebutuhan terkait kelistrikan dapat menyampaikan pertanyaan awal. Tim Afana akan meninjau kecocokan kebutuhan tersebut sebelum menentukan langkah berikutnya.",
    },
    en: {
      question: "Who can consult with Afana?",
      answer: "Prospective customers, partners, procurement teams, and other parties with electrical needs may submit an initial inquiry. The Afana team will review the requirement before determining the next step.",
    },
  },
  {
    category: "electrical-solutions",
    id: {
      question: "Solusi kelistrikan apa yang menjadi fokus Afana?",
      answer: "Fokus Afana mencakup kualitas daya, distribusi daya, perlindungan perangkat, dan dukungan terhadap kesinambungan operasi. Rekomendasi akhir selalu mengikuti hasil peninjauan kebutuhan serta kondisi sistem pelanggan.",
    },
    en: {
      question: "Which electrical solutions does Afana focus on?",
      answer: "Afana focuses on power quality, power distribution, equipment protection, and operational continuity. Final recommendations always follow a review of the customer's requirements and system conditions.",
    },
  },
  {
    category: "electrical-solutions",
    id: {
      question: "Apakah produk selalu tersedia?",
      answer: "Ketersediaan produk dapat berbeda berdasarkan tipe, spesifikasi, jumlah, dan waktu pemesanan. Hubungi tim Afana dengan detail kebutuhan agar ketersediaan dan alternatif yang sesuai dapat diperiksa.",
    },
    en: {
      question: "Are products always available?",
      answer: "Product availability may vary by type, specification, quantity, and ordering date. Contact the Afana team with your requirements so availability and suitable alternatives can be checked.",
    },
  },
  {
    category: "electrical-solutions",
    id: {
      question: "Bagaimana Afana menentukan rekomendasi solusi?",
      answer: "Rekomendasi disusun dari informasi beban, kondisi instalasi, masalah yang dialami, target penggunaan, dan batasan proyek. Bila informasi awal belum cukup, tim dapat meminta data tambahan sebelum memberikan arahan.",
    },
    en: {
      question: "How does Afana determine a solution recommendation?",
      answer: "Recommendations are based on load information, installation conditions, observed issues, usage goals, and project constraints. If the initial information is insufficient, the team may request additional data before providing guidance.",
    },
  },
  {
    category: "electrical-solutions",
    id: {
      question: "Apakah spesifikasi teknis produk dapat diminta?",
      answer: "Ya. Spesifikasi, datasheet, atau dokumen teknis yang tersedia dapat diminta saat konsultasi. Dokumen yang diberikan akan mengikuti produk atau solusi yang sedang dipertimbangkan.",
    },
    en: {
      question: "Can I request product technical specifications?",
      answer: "Yes. Available specifications, datasheets, or technical documents may be requested during consultation. The documents provided will correspond to the product or solution being considered.",
    },
  },
  {
    category: "project-consultation",
    id: {
      question: "Bagaimana memulai konsultasi proyek?",
      answer: "Mulailah dengan mengirim ringkasan kebutuhan melalui halaman Kontak. Jelaskan lokasi proyek, kondisi yang ingin ditangani, target penggunaan, dan jadwal yang diharapkan agar pembahasan awal lebih terarah.",
    },
    en: {
      question: "How do I start a project consultation?",
      answer: "Start by sending a requirement summary through the Contact page. Describe the project location, the condition to be addressed, the intended outcome, and the expected schedule to make the initial discussion more focused.",
    },
  },
  {
    category: "project-consultation",
    id: {
      question: "Informasi apa yang perlu disiapkan sebelum konsultasi?",
      answer: "Siapkan informasi mengenai sumber listrik, beban utama, diagram atau foto instalasi bila tersedia, gejala masalah, serta kebutuhan operasional. Jangan mengirimkan dokumen rahasia sebelum ruang lingkup dan kanal komunikasinya disepakati.",
    },
    en: {
      question: "What information should I prepare before a consultation?",
      answer: "Prepare information about the power source, major loads, installation diagrams or photos when available, observed issues, and operational requirements. Do not send confidential documents before the scope and communication channel are agreed upon.",
    },
  },
  {
    category: "project-consultation",
    id: {
      question: "Apakah setiap proyek memerlukan survei lokasi?",
      answer: "Tidak selalu. Kebutuhan survei ditentukan dari kompleksitas sistem dan kecukupan data awal. Tim Afana akan menginformasikan apabila pemeriksaan lokasi diperlukan sebelum rekomendasi atau penawaran disusun.",
    },
    en: {
      question: "Does every project require a site survey?",
      answer: "Not always. The need for a survey depends on system complexity and the completeness of the initial data. The Afana team will advise if a site inspection is needed before preparing a recommendation or proposal.",
    },
  },
  {
    category: "project-consultation",
    id: {
      question: "Berapa lama dan berapa biaya pengerjaan proyek?",
      answer: "Durasi dan biaya bergantung pada ruang lingkup, spesifikasi, ketersediaan material, kondisi lokasi, dan jadwal pelaksanaan. Estimasi hanya dapat disusun setelah kebutuhan proyek ditinjau dengan cukup.",
    },
    en: {
      question: "How long will a project take and how much will it cost?",
      answer: "Duration and cost depend on scope, specifications, material availability, site conditions, and the implementation schedule. An estimate can only be prepared after the project requirements have been reviewed in sufficient detail.",
    },
  },
  {
    category: "support",
    id: {
      question: "Apakah Afana menyediakan dukungan setelah pekerjaan selesai?",
      answer: "Bentuk dukungan setelah penyelesaian pekerjaan mengikuti ruang lingkup dan kesepakatan proyek. Periksa dokumen penawaran atau hubungi tim Afana untuk memastikan dukungan yang termasuk pada pekerjaan Anda.",
    },
    en: {
      question: "Does Afana provide support after project completion?",
      answer: "Post-completion support follows the agreed project scope and terms. Check the proposal documents or contact the Afana team to confirm which support is included in your project.",
    },
  },
  {
    category: "support",
    id: {
      question: "Apakah tersedia layanan pemeriksaan atau pemeliharaan?",
      answer: "Kebutuhan pemeriksaan atau pemeliharaan dapat dikonsultasikan kepada tim Afana. Ketersediaan layanan dan ruang lingkupnya akan ditentukan berdasarkan jenis perangkat, kondisi sistem, serta lokasi pekerjaan.",
    },
    en: {
      question: "Are inspection or maintenance services available?",
      answer: "Inspection or maintenance requirements may be discussed with the Afana team. Service availability and scope will be determined by the equipment type, system condition, and work location.",
    },
  },
  {
    category: "support",
    id: {
      question: "Apa yang harus dilakukan ketika terjadi gangguan kelistrikan?",
      answer: "Utamakan keselamatan, ikuti prosedur internal, dan jangan menangani instalasi tanpa personel yang kompeten. Setelah kondisi aman, catat gejala, waktu kejadian, serta perangkat terdampak untuk membantu proses peninjauan.",
    },
    en: {
      question: "What should I do when an electrical issue occurs?",
      answer: "Prioritize safety, follow internal procedures, and do not handle the installation without competent personnel. Once conditions are safe, record the symptoms, event time, and affected equipment to support the review process.",
    },
  },
  {
    category: "support",
    id: {
      question: "Bagaimana ketentuan garansi produk atau pekerjaan?",
      answer: "Ketentuan garansi dapat berbeda menurut produk, produsen, dan ruang lingkup pekerjaan. Rujuk dokumen penawaran, kartu garansi, atau perjanjian proyek untuk mengetahui cakupan dan masa berlaku yang tepat.",
    },
    en: {
      question: "What are the warranty terms for products or project work?",
      answer: "Warranty terms may vary by product, manufacturer, and work scope. Refer to the proposal, warranty card, or project agreement for the applicable coverage and validity period.",
    },
  },
  {
    category: "partnership",
    id: {
      question: "Apakah Afana terbuka untuk peluang kemitraan?",
      answer: "Peluang kemitraan dapat diajukan melalui halaman Kontak dengan menjelaskan profil organisasi, bentuk kerja sama, dan nilai yang ditawarkan. Setiap pengajuan akan ditinjau sebelum pembahasan lanjutan dilakukan.",
    },
    en: {
      question: "Is Afana open to partnership opportunities?",
      answer: "Partnership opportunities may be submitted through the Contact page with an organization profile, proposed collaboration model, and expected value. Each submission will be reviewed before further discussion.",
    },
  },
  {
    category: "partnership",
    id: {
      question: "Bagaimana cara menawarkan produk atau layanan kepada Afana?",
      answer: "Kirimkan perkenalan singkat perusahaan, kategori produk atau layanan, area cakupan, dan informasi kontak melalui halaman Kontak. Hindari mengirim lampiran berukuran besar sebelum tim meminta dokumen pendukung.",
    },
    en: {
      question: "How can I offer products or services to Afana?",
      answer: "Send a brief company introduction, product or service category, coverage area, and contact information through the Contact page. Avoid sending large attachments until the team requests supporting documents.",
    },
  },
  {
    category: "partnership",
    id: {
      question: "Apakah Afana dapat mengikuti proses pengadaan perusahaan?",
      answer: "Undangan pengadaan dapat disampaikan untuk ditinjau dengan menyertakan ruang lingkup, persyaratan, jadwal, dan kontak penanggung jawab. Keikutsertaan akan ditentukan setelah dokumen serta kecocokan kebutuhan diperiksa.",
    },
    en: {
      question: "Can Afana participate in a corporate procurement process?",
      answer: "Procurement invitations may be submitted for review with the scope, requirements, schedule, and responsible contact. Participation will be determined after the documents and requirement fit have been assessed.",
    },
  },
  {
    category: "partnership",
    id: {
      question: "Dokumen apa yang perlu disertakan dalam undangan pengadaan?",
      answer: "Sertakan ringkasan ruang lingkup, spesifikasi atau kerangka acuan, jadwal proses, ketentuan administrasi, serta kanal klarifikasi. Dokumen tambahan dapat diminta setelah peninjauan awal.",
    },
    en: {
      question: "Which documents should be included in a procurement invitation?",
      answer: "Include a scope summary, specifications or terms of reference, process schedule, administrative requirements, and a clarification channel. Additional documents may be requested after the initial review.",
    },
  },
] as const;

async function seed() {
  if (faqs.length !== 20) throw new Error(`Expected 20 FAQ entries, received ${faqs.length}.`);
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  const categoryIds = new Map<string, string>();

  for (const [sortOrder, category] of categories.entries()) {
    const saved = await prisma.faqCategory.upsert({
      where: { slug: category.slug },
      update: { titleId: category.titleId, titleEn: category.titleEn, archivedAt: null },
      create: { ...category, sortOrder },
      select: { id: true },
    });
    categoryIds.set(category.slug, saved.id);
  }

  let created = 0;
  let skipped = 0;
  const categoryOrder = new Map<string, number>();

  for (const [index, faq] of faqs.entries()) {
    const itemId = `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
    const revisionId = `20000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
    const categoryId = categoryIds.get(faq.category);
    if (!categoryId) throw new Error(`FAQ category is missing: ${faq.category}`);
    const sortOrder = categoryOrder.get(faq.category) ?? 0;
    categoryOrder.set(faq.category, sortOrder + 1);
    const existing = await prisma.faqItem.findUnique({ where: { id: itemId }, select: { id: true } });
    if (existing) {
      skipped += 1;
      continue;
    }
    await prisma.$transaction(async (transaction) => {
      await transaction.faqItem.create({
        data: { id: itemId, categoryId, sortOrder, workflowStatus: FaqWorkflowStatus.DRAFT },
      });
      await transaction.faqRevision.create({
        data: {
          id: revisionId,
          faqItemId: itemId,
          categoryId,
          revisionNumber: 1,
          payload: { translations: { id: faq.id, en: faq.en } } as unknown as Prisma.InputJsonValue,
        },
      });
      await transaction.faqItem.update({
        where: { id: itemId },
        data: { draftRevisionId: revisionId, publishedRevisionId: revisionId, lockVersion: 1 },
      });
      await transaction.auditLog.create({
        data: { action: "FAQ_IMPORTED", entityType: "FaqItem", entityId: itemId },
      });
    });
    created += 1;
  }

  await prisma.$disconnect();
  console.log(JSON.stringify({ categories: categories.length, total: faqs.length, created, skipped }));
}

seed().catch((error) => {
  console.error("FAQ seed failed.", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
