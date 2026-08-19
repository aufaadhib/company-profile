# Roadmap

Dokumen ini menyimpan milestone dan keputusan yang dapat berubah. Aturan implementasi permanen tetap berada di `AGENTS.md`.

## Status

- **Planned** — sudah diprioritaskan, belum dikerjakan.
- **In Progress** — sedang dikerjakan.
- **Blocked** — membutuhkan keputusan atau input eksternal.
- **Deferred** — sengaja ditunda.
- **Completed** — sudah diverifikasi.

## Decisions

- **Completed** — Bahasa utama menggunakan route, dengan `/id` dan `/en` sebagai sumber kebenaran; state hanya untuk interaksi switcher atau preferensi sementara.
- **Completed** — Pertamina menjadi referensi arah corporate UI, tanpa menyalin brand, aset, copy, atau komposisi.
- **Completed** — CSS/native browser menjadi default motion; Framer Motion dan Swiper hanya opsional setelah kebutuhan nyata dan dependency disetujui.
- **Completed** — Loading memakai skeleton scoped yang mengikuti geometry konten akhir dan tetap memiliki error state terpisah.
- **Completed** — Prototype hero Afana memakai full-bleed media, topbar transparan dua tingkat, dan fade transition Swiper.
- **Completed** — Latar belakang perusahaan memakai timeline Swiper bilingual dengan navigasi manual, autoplay 25 detik, dan progress rail.
- **Completed** — Semua link lintas halaman memakai prefix locale aktif; hash-only link dibatasi untuk anchor pada halaman yang sama.
- **Completed** — Route About dipetakan bilingual dengan `/id/tentang-kami` dan `/en/about`; URL Inggris lama `/en/tentang-kami` hanya menjadi redirect legacy.

## Planned

### 1. Bilingual foundation

- [x] Buat route locale `app/[locale]` untuk `id` dan `en`.
- [x] Buat dictionary konten terpisah tanpa menggandakan komponen halaman.
- [x] Buat language switcher yang mempertahankan halaman aktif ketika memungkinkan.
- [x] Tambahkan metadata, canonical, dan alternate language untuk setiap route publik.

### 2. Content and identity

- [ ] Minta dan masukkan konten portfolio Indonesia/Inggris yang sudah disetujui pengguna.
- [x] Tentukan elemen visual khas, typography, warna, spacing, dan token global untuk prototype hero.
- [ ] Adaptasikan prinsip referensi Pertamina ke identitas pengguna sendiri.

### 3. Responsive UI

- [ ] Bangun halaman mobile-first dan periksa pada 375px, 768px, 1024px, dan 1440px.
- [ ] Verifikasi navigation, hero, media, cards, spacing, focus state, dan tidak ada horizontal overflow.
- [ ] Tambahkan skeleton hanya pada bagian yang benar-benar menunggu data atau media.

### 4. Motion and interaction

- [x] Tambahkan motion carousel melalui Swiper dengan fade transition yang terukur.
- [x] Evaluasi Framer Motion dan menundanya karena CSS, Swiper, dan WebGL sudah mencukupi scope hero.
- [x] Gunakan Swiper karena kebutuhan autoplay, navigation, pagination, dan keyboard melampaui scroll-snap sederhana.
- [x] Tambahkan timeline perjalanan Afana dengan kontrol periode, keyboard, swipe, dan reduced-motion fallback.
- [ ] Uji reduced motion, keyboard, touch target, dan fallback tanpa JavaScript secara manual pada browser target.

### 5. Release quality

- [ ] Lengkapi metadata, sitemap, robots, favicon, dan Open Graph dengan data yang disetujui.
- [ ] Jalankan lint, typecheck, production build, dan smoke check route publik.
- [ ] Periksa loading state, layout shift, hydration mismatch, dan motion jank pada production build.

### 6. Media and information

- [x] Tambahkan halaman listing Media & Informasi bilingual dengan featured article dan filter kategori ringan.
- [x] Tambahkan halaman detail artikel bilingual dengan slug statis, metadata, dan related reading.
- [x] Jadikan hero Media & Informasi sebagai Swiper tiga berita terbaru dengan autoplay 8 detik dan reduced-motion fallback.
- [x] Gunakan struktur konten lokal yang siap dipetakan ke CMS tanpa menambahkan CMS pada prototype.

## Deferred

- CMS, authentication, database, owner-only preview, dan media upload — hanya jika kebutuhan produk sudah jelas.
- Library animation atau carousel tambahan — hanya jika CSS/native browser tidak mencukupi.

## Definition of Done

- Konten faktual dan bilingual sudah disetujui pengguna.
- Route dapat dibuka langsung, di-refresh, dibagikan, dan berpindah bahasa dengan benar.
- UI berfungsi pada mobile, tablet, desktop, keyboard, reduced motion, dan tanpa ketergantungan hover.
- Loading dan error state tidak menyebabkan layout shift atau mengosongkan halaman tanpa alasan.
- Verifikasi teknis relevan berhasil dan perubahan tercatat di `CHANGELOG.md`.
