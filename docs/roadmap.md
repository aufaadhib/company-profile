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
- **Completed** — Contact memakai `/id/kontak` dan `/en/contact`; pesan disimpan pada Neon PostgreSQL, dilindungi Turnstile/rate limit, diberi notifikasi Resend, dan memiliki retensi 12 bulan.
- **Completed** — Admin utama memiliki Contact Control untuk inbox, read/archive, retry email, Auto Email, dan kanal publik; Editor tidak memiliki akses ke data Contact.
- **Completed** — CMS Media memakai Better Auth, Admin/Editor, revision draft/review/publish, Vercel Blob, dan artikel publik bilingual dari Neon PostgreSQL.
- **Completed** — FAQ memakai Search Desk bilingual, pencarian/filter GET, accordion native, serta CMS revision draft/review/publish dengan kategori dan urutan Admin-only.

- **Completed** — Home membentuk alur lengkap dari hero menuju profil, cara kerja, Sustainability, Media terbaru dari CMS, dan Contact dengan anchor bisnis bilingual.

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

### 7. Sustainability

- [x] Tambahkan route bilingual `/id/keberlanjutan` dan `/en/sustainability`.
- [x] Tambahkan halaman technical sustainability editorial dengan alur nilai energi empat tahap.
- [x] Tambahkan aset visual khusus Sustainability dan copy draft bilingual tanpa klaim metrik publik.
- [ ] Ganti copy draft dengan data, program, target, dan materi Sustainability yang telah disetujui pengguna.

### 8. Contact

- [x] Tambahkan route Contact bilingual, metadata, language mapping, dan seluruh link navigasi terkait.
- [x] Tambahkan connection-ledger hero, kanal email/telepon/WhatsApp/lokasi, dan form accessible.
- [x] Tambahkan schema Prisma PostgreSQL, Server Action, Turnstile server verification, rate limit, Resend, serta retention cron.
- [x] Tambahkan inbox Admin, status read/archive, retry notifikasi, Auto Email, test email, dan pengaturan kanal publik.
- [ ] Buat project Neon, verifikasi domain Resend, buat widget Turnstile, dan pasang seluruh environment variable pada Vercel.
- [ ] Jalankan migration dan smoke test submit production setelah service eksternal tersedia.

### 9. CMS Media

- [x] Tambahkan dashboard `/admin`, autentikasi email/password, satu Admin utama, dan invitation-only Editor.
- [x] Tambahkan revision immutable, optimistic locking, review/publish, audit log, preview, dan upload Vercel Blob.
- [x] Pindahkan sumber data Media publik ke CMS serta sediakan seed idempotent untuk enam artikel lama.
- [ ] Konfigurasikan Better Auth, Vercel Blob, migration, seed, dan Admin utama pada production.

### 10. Home

- [x] Pertahankan hero brand `100svh` sebagai pembuka utama.
- [x] Tambahkan teaser profil, rail cara kerja, Sustainability, Media terbaru, dan CTA Contact dalam struktur bilingual.
- [x] Arahkan navigasi Bisnis Afana ke section `#bisnis-afana` yang nyata.
- [x] Tambahkan tab Fokus Sistem dan Pendekatan Kerja dengan kartu media single-plane, hover/tap/keyboard flip, scroll-snap mobile, dan hinge transition yang menghormati reduced motion.
- [x] Stream Media terbaru melalui Suspense lokal tanpa menahan konten Home yang statis.

### 11. FAQ

- [x] Tambahkan route `/id/faq` dan `/en/faq` dengan metadata, alternate locale, Search Desk, empty/no-result state, dan CTA Contact.
- [x] Tambahkan pencarian serta filter kategori berbasis GET dan accordion native yang dapat digunakan dengan keyboard.
- [x] Tambahkan model kategori, item, dan revision immutable dengan optimistic locking, audit log, soft archive, manual ordering, dan cache published.
- [x] Tambahkan halaman Admin untuk CRUD draft FAQ dan pengelolaan kategori sesuai hak akses Editor/Admin.
- [x] Isi lima kategori dan 20 FAQ bilingual melalui seed idempotent setelah pengguna memberikan persetujuan konten bebas.

## Deferred

- CMS untuk Beranda, About, Sustainability, Contact copy, navigation/footer, dan page builder tetap ditunda.
- Library animation atau carousel tambahan — hanya jika CSS/native browser tidak mencukupi.

## Definition of Done

- Konten faktual dan bilingual sudah disetujui pengguna.
- Route dapat dibuka langsung, di-refresh, dibagikan, dan berpindah bahasa dengan benar.
- UI berfungsi pada mobile, tablet, desktop, keyboard, reduced motion, dan tanpa ketergantungan hover.
- Loading dan error state tidak menyebabkan layout shift atau mengosongkan halaman tanpa alasan.
- Verifikasi teknis relevan berhasil dan perubahan tercatat di `CHANGELOG.md`.
