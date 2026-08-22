# Product

<!-- uizze:product-schema 1 -->

## Platform

web

## Users

Pengunjung berbahasa Indonesia dan Inggris yang ingin memahami Afana atau menyampaikan pertanyaan umum, kebutuhan solusi kelistrikan, peluang kemitraan, pengadaan, karier, maupun kebutuhan media.

## Product Purpose

Website company profile publik Afana menjelaskan arah, identitas, solusi kelistrikan, media, dan keberlanjutan perusahaan. Halaman kontak memberi pengunjung jalur langsung dan formulir terstruktur untuk memulai percakapan.

## Positioning

Afana berfokus pada solusi kelistrikan yang membantu melindungi perangkat elektronik dan digital serta menjaga kesinambungan operasional pelanggan.

## Operating Context

Pengunjung membaca halaman publik melalui perangkat mobile, tablet, atau desktop, berpindah antara bahasa Indonesia dan Inggris melalui route, lalu menghubungi Afana melalui email, telepon, WhatsApp, atau formulir website.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, dan npm.
- Konten publik bilingual memakai prefix route `/id` dan `/en`.
- Pesan kontak disimpan pada Neon PostgreSQL melalui Prisma, diberi notifikasi melalui Resend, dilindungi Cloudflare Turnstile dan rate limit, serta disimpan maksimal 12 bulan.
- Dashboard internal memakai Better Auth dengan satu Admin utama dan Editor invitation-only. Media memiliki revision immutable serta Vercel Blob.
- Admin utama dapat mengelola inbox Contact, kirim ulang notifikasi gagal, dan pengaturan kanal publik; Editor tetap dibatasi pada workflow Media.

## Brand Commitments

- Nama dan identitas Afana tetap orisinal.
- Arah visual corporate electrical editorial memakai Lexend, Source Sans 3, warna gelap teknis, permukaan terang, dan aksen oranye.
- Pertamina hanya menjadi referensi tingkat tinggi untuk kualitas corporate dan hierarchy; aset, copy, branding, dan komposisi tidak disalin.

## Evidence on Hand

- Logo dan aset Afana tersedia di repository.
- Kontak yang disetujui untuk publikasi: `info@afana.id`, `081331096250`, dan lokasi Banyuwangi.
- Nomor telepon yang sama disetujui untuk telepon dan WhatsApp.
- Belum ada alamat rinci, jam operasional, peta, atau janji waktu respons yang disetujui.

## Product Principles

- Gunakan fakta yang telah disetujui; jangan mengarang kontak, alamat, klaim, atau bukti bisnis.
- Buat setiap route dapat dibaca, diakses melalui keyboard, responsif, dan konsisten antarbahasa.
- Pertahankan batas data server-side dan kumpulkan data pribadi sesedikit yang diperlukan.
- Gunakan kemampuan native browser dan dependency minimum yang memenuhi kebutuhan nyata.

## Accessibility & Inclusion

Halaman dirancang mobile-first dan diperiksa pada lebar 375px, 768px, 1024px, dan 1440px, dengan heading semantik, focus state, target sentuh minimal 44px, status form yang dapat dibaca screen reader, serta kanal kontak yang tetap tersedia ketika JavaScript atau Turnstile gagal.
