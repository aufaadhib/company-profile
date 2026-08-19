# Afana Company Profile Implementation Plan

Dokumen ini menjadi handoff antara agent perencana (SOL) dan agent pelaksana (LUNA). SOL memperbarui rencana dan kriteria penerimaan; LUNA membaca dokumen ini, memeriksa repository, lalu mengimplementasikan pekerjaan secara bertahap.

## Tujuan

Menyelesaikan website company profile Afana yang responsif, bilingual, mudah dipelihara, dan siap diverifikasi pada mobile, tablet, serta desktop.

## Kondisi saat ini

- Stack: Next.js 16 App Router, TypeScript strict, Tailwind CSS v4.
- Route tersedia untuk `/id`, `/en`, `/id/tentang-kami`, dan `/en/about`.
- Konten halaman About tersimpan terpisah di `content/about-content.ts`.
- Hero menggunakan Swiper; timeline latar belakang menggunakan Swiper dengan autoplay 25 detik.
- Topbar memiliki perilaku hide/show saat scroll dan hamburger menu untuk mobile.
- Perubahan terakhir sudah diverifikasi dengan lint, TypeScript, production build, dan `git diff --check`.
- Konten profil masih perlu mendapatkan persetujuan final sebelum dianggap sebagai konten produksi.

## Urutan implementasi

### 1. Audit dan stabilisasi navigasi

- Periksa topbar pada lebar 375px, 768px, 1024px, dan 1440px.
- Pastikan hamburger menu terbuka penuh pada viewport, dapat discroll di dalam menu, dan dapat ditutup dengan tombol serta `Escape`.
- Pastikan topbar slide ke atas saat scroll turun dan slide ke bawah saat scroll naik.
- Pastikan navigasi section About tetap berada di bawah topbar saat topbar terlihat dan naik ke atas viewport saat topbar tersembunyi.
- Pastikan tidak ada horizontal overflow.

Acceptance criteria:

- Semua kontrol menu memiliki accessible name dan target sentuh minimal 44px.
- Menu tidak tertutup oleh topbar atau terpotong oleh elemen yang memakai transform.
- Navigasi section tidak meninggalkan celah kosong ketika topbar tersembunyi.

### 2. Audit halaman About dan konten

- Periksa hierarchy heading, anchor section, scroll offset, dan posisi gambar.
- Pastikan section `profil-afana`, `latar-belakang`, `visi-misi`, `fokus-solusi`, dan `peran-afana` dapat dibuka langsung melalui hash URL.
- Rapikan copy Indonesia dan Inggris tanpa menambahkan klaim, angka, sertifikasi, pelanggan, atau layanan yang belum disetujui.
- Periksa alt text seluruh gambar About.

Acceptance criteria:

- Setiap tab mengarah ke section yang benar.
- Konten Indonesia dan Inggris memiliki struktur informasi yang setara.
- Gambar tidak menyebabkan layout shift atau horizontal overflow.

### 3. Audit hero dan timeline

- Periksa cropping media pada mobile, tablet, dan desktop.
- Pastikan Swiper mendukung keyboard, tombol prev/next, status slide, dan reduced motion.
- Pastikan autoplay timeline tetap 25 detik dan progress rail mencerminkan progres aktual.
- Pastikan konten tetap dapat dibaca ketika autoplay dinonaktifkan.

Acceptance criteria:

- `prefers-reduced-motion` menonaktifkan autoplay dan perpindahan besar.
- Tidak ada konten penting yang hanya tersedia melalui hover atau drag.
- Kontrol slider memiliki label yang jelas.

### 4. SEO, metadata, dan halaman error

- Periksa title, description, canonical, dan alternate language untuk route publik.
- Lengkapi `sitemap.ts`, `robots.ts`, favicon, dan Open Graph hanya dengan identitas Afana yang sudah disetujui.
- Pastikan halaman 404 tetap konsisten dengan tema kelistrikan dan memiliki link kembali yang jelas.

Acceptance criteria:

- Route publik dapat dibuka langsung dan di-refresh tanpa error.
- Metadata tidak memuat nama, klaim, atau aset milik pihak lain.
- Halaman 404 memiliki landmark dan focus state yang benar.

### 5. Verifikasi dan release

- Jalankan pemeriksaan berikut dari root repository:

```bash
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

- Lakukan smoke check pada route `/id`, `/en`, `/id/tentang-kami`, `/en/about`, serta redirect legacy `/en/tentang-kami` dan route 404.
- Periksa keyboard navigation, reduced motion, touch target, dan overflow.
- Catat perubahan final di `CHANGELOG.md`.
- Buat satu commit untuk satu batch pekerjaan yang koheren, lalu push setelah remote dan branch dikonfirmasi.

## Aturan handoff SOL → LUNA

SOL bertugas menganalisis repository, menentukan scope, menulis acceptance criteria, dan mencatat risiko. SOL tidak mengubah kode kecuali diminta.

LUNA bertugas membaca plan, memeriksa ulang kondisi repository, mengimplementasikan hanya scope yang disetujui, menjalankan verifikasi, dan melaporkan file yang berubah.

Jangan menjalankan dua agent secara bersamaan di working tree yang sama. Jika menggunakan dua akun, pindahkan konteks melalui dokumen ini, commit Git, atau pull request; percakapan dan konteks akun tidak berpindah otomatis.

## Di luar scope

- CMS, database, authentication, dashboard owner, dan upload media.
- Penambahan library animasi atau carousel baru.
- Klaim bisnis, statistik, sertifikasi, daftar pelanggan, alamat, atau kontak yang belum disetujui.
