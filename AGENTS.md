<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository Workflow

1. Baca `docs/design-system.md` untuk keputusan visual, `docs/security.md` untuk pekerjaan yang menyentuh data atau akses, dan `docs/roadmap.md` untuk prioritas yang sedang berjalan.
2. Simpan milestone, keputusan yang berubah, dan catatan release di dokumen terkait; jangan menumpuknya di `AGENTS.md`.
3. Gunakan bahasa Inggris untuk nama file, variable, type, class, method, dan function.
4. Gunakan npm sebagai satu-satunya package manager dan pertahankan `package-lock.json`.

## Project Stack

1. Gunakan Next.js 16 App Router dan TypeScript strict.
2. Gunakan Tailwind CSS v4 sebagai fondasi styling dan bangun komponen antarmuka internal sesuai kebutuhan proyek.
3. Utamakan kemampuan native browser, React, Next.js, CSS, dan SVG sebelum menambah dependency.
4. Framer Motion (`framer-motion`) dan Swiper (`swiper`) adalah opsi yang dapat digunakan bila kebutuhan UI memang memerlukannya dan dependency tersebut sudah dipasang. Jangan menambahkan keduanya secara spekulatif.
5. Jangan menambahkan library animation, smooth-scroll, 3D, carousel, atau ikon tanpa kebutuhan yang jelas dan persetujuan proyek.

## Next.js Architecture

1. Gunakan Server Component sebagai default. Tambahkan `"use client"` hanya untuk state, event handler, browser API, motion, slider, atau interaktivitas client-side.
2. Jaga batas Client Component sekecil mungkin dan kirim hanya data serializable dari Server Component.
3. Baca panduan Next.js versi terpasang di `node_modules/next/dist/docs/` sebelum menggunakan API, metadata convention, image, caching, atau route behavior.
4. Portofolio publik dan konten statis harus diprerender bila memungkinkan. Jangan menambahkan backend, database, authentication, atau dynamic rendering tanpa kebutuhan produk.
5. Gunakan struktur semantik dan pisahkan data konten dari presentasi agar proyek mudah diperbarui tanpa CMS.

## Content and Privacy Rules

1. Jika membutuhkan teks, foto, data pribadi, riwayat kerja, keahlian, layanan, proyek, screenshot, tautan, testimonial, kontak, CV, atau konten lain, minta langsung kepada pengguna.
2. Jangan mengarang placeholder yang terlihat sebagai fakta, mengambil konten milik orang lain, atau mencari konten pengguna di internet tanpa permintaan dan persetujuan eksplisit.
3. Jangan menerbitkan data pribadi, alamat, nomor telepon, email, atau dokumen pengguna sebelum pengguna menyetujui konten tersebut.
4. Jika konten faktual belum tersedia, minta langsung kepada pengguna; jangan mencari atau mengarangnya di internet.

## Responsive Implementation

1. Semua halaman harus mobile-first dan dirancang serta diperiksa pada lebar 375px, 768px, 1024px, dan 1440px.
2. Jangan sekadar mengecilkan layout desktop. Susun ulang hierarchy, navigation, ukuran tipe, spacing, media, dan motion untuk mobile, tablet, dan desktop.
3. Ikuti token dan keputusan visual di `docs/design-system.md`; hindari nilai acak yang berulang di komponen.
4. Gunakan `next/font` untuk font lokal atau provider yang didukung. Hindari CSS `@import` font eksternal.
5. Gunakan fluid typography dan spacing dengan `clamp()` jika sesuai, sambil menjaga keterbacaan dan hierarchy.
6. Pastikan tidak ada horizontal overflow, teks terlalu kecil, kontrol gepeng, atau layout yang hanya berfungsi saat hover.

## Motion and Slider Rules

1. Gunakan CSS atau Tailwind untuk hover dan transisi sederhana. Gunakan Framer Motion hanya untuk state, entrance, layout, atau sequence yang memang meningkatkan pemahaman pengguna.
2. Letakkan komponen Framer Motion di Client Component sekecil mungkin. Jangan mengubah seluruh halaman statis menjadi Client Component hanya untuk satu animasi.
3. Hormati `prefers-reduced-motion`. Saat reduced motion aktif, kurangi atau hapus perpindahan besar, autoplay, parallax, dan transisi yang tidak penting; konten tetap harus langsung tersedia.
4. Jangan menyembunyikan konten penting sampai JavaScript selesai. Sediakan keadaan awal dan fallback tanpa JavaScript yang dapat dibaca.
5. Gunakan native CSS scroll-snap untuk daftar geser sederhana. Gunakan Swiper hanya untuk slider/carousel yang benar-benar membutuhkan pagination, navigation, atau perilaku touch yang lebih lengkap.
6. Slider proyek harus dapat digunakan dengan keyboard, memiliki kontrol prev/next berlabel, status posisi yang dapat dipahami, dan tidak bergantung pada drag atau autoplay.
7. Jika Swiper digunakan, lazy-load hanya bila tidak diperlukan pada render awal, matikan autoplay untuk reduced motion, dan pastikan kontrol serta fokus tetap dapat diakses.

## Loading and Skeleton Rules

1. Gunakan lazy loading hanya untuk Client Component atau library berat yang tidak diperlukan pada render awal. Jangan menambahkan dependency baru hanya untuk lazy loading.
2. Jangan lazy-load komponen kecil, navigasi utama, kontrol kritis, atau konten above-the-fold.
3. Tempatkan `<Suspense>` sedekat mungkin dengan bagian async yang lambat. Layout bersama, navigasi, dan konten yang sudah siap harus tetap terlihat dan interaktif.
4. Gunakan `loading.tsx` hanya jika seluruh route segment memang membutuhkan fallback. Untuk satu section, kartu, atau panel, gunakan boundary loading lokal agar halaman tidak ikut menjadi skeleton.
5. Gunakan komponen skeleton internal berbasis Tailwind atau CSS. Samakan bentuk, jumlah baris, aspect ratio, dan tinggi skeleton dengan konten akhir pada mobile, tablet, dan desktop untuk mencegah layout shift.
6. Skeleton hanya boleh menggantikan area yang benar-benar belum siap. Jangan gunakan spinner atau skeleton satu halaman penuh ketika hanya satu kontrol atau section yang sedang memuat; error state harus ditangani terpisah.
7. Saat mutation atau revalidation, pertahankan data lama yang masih valid dan tampilkan pending state pada kontrol atau area yang terdampak. Jangan mengosongkan seluruh halaman atau menambahkan delay loading buatan.
8. Tandai container yang memuat dengan `aria-busy`, berikan status loading yang dapat dibaca screen reader, jadikan skeleton dekoratif `aria-hidden`, dan hormati preferensi reduced motion.
9. Verifikasi loading state menggunakan throttling jaringan dan production build. Pastikan tidak ada layout shift, hydration mismatch, request waterfall, atau shared layout yang ikut berkedip.

## Images and Performance

1. Gunakan `next/image` dengan dimensi atau aspect ratio yang dicadangkan untuk mencegah layout shift.
2. Prioritaskan hanya gambar LCP yang benar-benar terlihat pada render awal; lazy-load gambar proyek dan media di bawah fold.
3. Gunakan AVIF atau WebP bila sesuai, `sizes` yang akurat, dan resolusi secukupnya. Jangan mengirim aset desktop besar ke mobile tanpa kebutuhan.
4. Hindari layout thrashing pada scroll handler, animasi tanpa cleanup, dan penggunaan `will-change` permanen secara berlebihan.
5. Targetkan skor Lighthouse minimal 95 untuk Performance, Accessibility, Best Practices, dan SEO pada production build, tanpa mengorbankan kegunaan nyata demi skor.
6. Verifikasi Core Web Vitals dan motion jank menggunakan production build serta throttling yang relevan.

## Accessibility

1. Sediakan skip link, landmark semantik, hierarchy heading yang benar, keyboard navigation, dan focus state yang jelas.
2. Pertahankan rasio kontras minimal 4.5:1 untuk teks biasa dan jangan mengandalkan warna saja untuk menyampaikan informasi.
3. Semua kontrol interaktif harus memiliki accessible name dan area sentuh minimal 44 x 44px.
4. Berikan alt text yang menjelaskan tujuan gambar; gunakan alt kosong untuk gambar dekoratif.
5. Jangan menjadikan hover, pointer presisi, autoplay, atau animasi sebagai satu-satunya cara mengakses konten.
6. Jangan menonaktifkan zoom browser dan hormati safe area pada perangkat mobile.

## SEO and Metadata

1. Gunakan Next.js Metadata API untuk title, description, canonical, Open Graph, dan Twitter card yang sesuai pada setiap halaman.
2. Sediakan `sitemap.ts`, `robots.ts`, favicon, manifest bila dibutuhkan, dan gambar Open Graph yang menggunakan identitas pengguna sendiri.
3. Tambahkan JSON-LD `Person` dan data proyek hanya dari informasi yang telah diberikan serta disetujui pengguna.
4. Jangan menambahkan klaim, skill, pengalaman, klien, statistik, alamat, atau profil sosial yang belum dikonfirmasi pengguna.
5. Gunakan struktur URL dan internal link yang jelas untuk beranda, proyek, tentang, dan kontak jika halaman tersebut memang memiliki konten cukup.

## Code Quality and Verification

1. Sebelum membuat komponen, hook, helper, atau dependency baru, periksa implementasi yang sudah ada dan gunakan solusi paling sederhana yang memenuhi kebutuhan.
2. Dokumentasikan function baru yang memiliki behavior, input, output, atau side effect yang tidak langsung terlihat; jangan menambah komentar untuk kode trivial.
3. Pastikan UI tetap berfungsi tanpa motion, dengan keyboard, dan pada mobile, tablet, serta desktop.
4. Jalankan `npm run lint`, `npx tsc --noEmit`, `npm run build`, dan test relevan untuk perubahan major. Untuk perubahan dokumentasi atau dependency kecil, lakukan verifikasi terarah yang proporsional.
