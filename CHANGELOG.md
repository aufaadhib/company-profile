# Changelog

## Unreleased

- Hapus Karier/Careers dari navigasi publik dan pilihan topik form Contact pada kedua bahasa.
- Tambahkan halaman FAQ bilingual dengan Search Desk, filter/pencarian GET, accordion native, empty state, CTA Contact, metadata, dan JSON-LD published-only.
- Tambahkan CMS FAQ dengan kategori bilingual, revision immutable, optimistic locking, workflow draft/review/publish, soft archive/restore, manual ordering, audit log, serta hak akses Editor/Admin.
- Tambahkan seed idempotent berisi lima kategori dan 20 FAQ bilingual yang langsung dipublish tanpa menimpa FAQ hasil impor sebelumnya.
- Lengkapi Home bilingual setelah hero dengan teaser profil, rail cara kerja, Sustainability, tiga Media terbaru dari CMS, CTA Contact, dan anchor Bisnis Afana yang nyata.
- Tambahkan section Bisnis Afana dua tab dengan kartu media Fokus Sistem dan Pendekatan Kerja, hinge transition CSS, serta scroll-snap native pada mobile.
- Ubah kartu Bisnis Afana menjadi kartu flip saat hover yang dapat dikunci melalui tap atau keyboard untuk menampilkan ringkasan.
- Perbaiki artefak flip Bisnis Afana dengan satu bidang visual dan pertukaran konten tepat di tengah animasi, sehingga permukaan depan dan belakang tidak lagi terlihat bersamaan.
- Perkecil kartu solusi Home menjadi 75% dari ukuran grid sebelumnya dan standarkan cursor pointer untuk seluruh tombol aktif.
- Rapatkan kartu solusi Home ke sisi kiri setiap kolom dan pertahankan whitespace di sisi kanan sesuai komposisi editorial.
- Padatkan gap antar-card solusi pada desktop agar rail mengikuti komposisi referensi yang lebih rapat.
- Hapus ikon flip dekoratif dari permukaan depan card solusi Home.
- Pastikan wrapper copy hero Home dapat menyusut pada mobile agar judul dan deskripsi panjang tidak melewati viewport tanpa mengecilkan standar typography.
- Lokalkan metadata title beranda menjadi `Beranda | Afana` untuk Indonesia dan `Home | Afana` untuk Inggris.
- Perbaiki transaksi Contact, workflow CMS, dan seed Media agar menggunakan isolation default yang didukung Prisma Neon serta tidak gagal dengan `P2028`.
- Tambahkan Contact Control Admin-only dengan inbox responsif, read/archive, retry notifikasi, Auto Email, test email, dan pengaturan email/telepon/WhatsApp/lokasi publik.
- Perbaiki undangan Editor agar memakai default role Better Auth tanpa membuka izin perubahan role, serta gunakan nama dan alamat sender Resend yang dapat dikonfigurasi melalui environment variable.
- Tambahkan CMS Media produksi pada `/admin` dengan Better Auth, role Admin/Editor, invitation-only access, reset password, revision immutable, optimistic locking, audit log, preview, dan workflow draft/review/publish.
- Tambahkan upload gambar Vercel Blob tervalidasi, seed idempotent enam artikel lama, serta pindahkan listing/detail Media bilingual ke published revision di Neon PostgreSQL.
- Tambahkan halaman Contact bilingual `/id/kontak` dan `/en/contact` dengan connection-ledger hero, kanal email/telepon/WhatsApp, form accessible, metadata, dan language mapping.
- Tambahkan penyimpanan pesan Contact pada Neon PostgreSQL melalui Prisma, notifikasi Resend, validasi Turnstile, rate limit berbasis HMAC tanpa IP mentah, dan retensi 12 bulan melalui Vercel Cron.
- Dokumentasikan setup Node 24, Neon, Resend, Turnstile, environment variable, batas privacy, serta product context Contact.
- Standarkan typography seluruh hero melalui satu skala judul fluid `44–68px`, lalu dokumentasikan aturannya di `docs/hero-standards.md`.
- Variasikan tinggi hero: Home dan Media listing tetap full-screen, About dan Sustainability menjadi `60svh`, serta detail artikel memakai minimum `60svh`.
- Tingkatkan kualitas optimasi foto inspeksi Sustainability agar detail panel dan kabel tidak terlihat blur.
- Rapikan styling alur nilai energi menjadi panel datar pada mobile/tablet dan rail proses horizontal pada desktop.
- Perbaiki breakpoint alur nilai energi Sustainability agar layout empat kolom baru aktif mulai `1280px` dan tidak memadat pada lebar medium.
- Tambahkan halaman Sustainability bilingual dengan alur nilai energi, fokus kualitas daya, praktik pemeliharaan, dan aset visual industri khusus.
- Tampilkan ikon pencarian pada primary navigation baik saat header utama transparan maupun saat navbar compact setelah scroll.
- Atur media hero home sebagai `loading="eager"` agar slide full-viewport tidak terlambat saat menjadi kandidat LCP pada autoplay.
- Batalkan seluruh implementasi CMS, termasuk route admin/API, authentication, database integration, media upload, dependency terkait, dan environment lokal CMS; situs kembali menggunakan konten lokal.
- Perbaiki link header, menu mobile, footer, dan CTA agar konsisten menuju route `/id` atau `/en`, termasuk anchor beranda.
- Tambahkan aturan URL multi bahasa ke `AGENTS.md` dan dokumentasi design system.
- Pisahkan route About bahasa Inggris menjadi `/en/about`; `/en/tentang-kami` dipertahankan sebagai redirect legacy.
- Ganti seluruh aset visual Media & Informasi dengan delapan gambar lokal baru yang mengikuti tema berita dan tidak memakai ulang aset hero/About.
- Ubah hero Media & Informasi menjadi Swiper tiga berita terbaru berdasarkan tanggal terbit, dengan autoplay 8 detik dan reduced-motion fallback.
- Perbaiki inisialisasi autoplay Swiper pada Hero Home dan Media setelah preferensi reduced-motion selesai dibaca browser.
- Pastikan autoplay hero Media & Informasi tidak berhenti hanya karena pointer berada di atas area hero.
- Sesuaikan hero Media & Informasi menjadi full viewport `100svh` seperti hero Home.
- Turunkan posisi copy hero Media & Informasi agar tidak bertabrakan dengan navbar pada desktop.
- Sembunyikan sementara menu Hubungan Investor dari navigasi Indonesia dan Inggris.
- Ubah format metadata title menjadi `Judul Halaman | Afana` pada seluruh route publik.
- Arahkan navigasi Profil Afana langsung ke section Afana melalui anchor `#profil-afana`.
- Perbaiki dropdown topbar agar menutup saat klik di luar dan tetap terlihat saat sedang dibuka ketika halaman discroll.
- Tempatkan kembali CTA Meet Afana di utility topbar, sejajar dengan bahasa di sisi kanan.
- Rapatkan primary navigation ke sisi kanan dengan menghapus ruang Search yang tidak terlihat saat header transparan.
- Ubah klik parent About Afana menjadi navigasi langsung ke bagian paling atas halaman About; dropdown tetap terbuka melalui hover dan keyboard focus.
- Batasi dropdown desktop agar hanya terbuka saat pointer berada di area hover, bukan karena parent masih fokus setelah diklik.
- Tambahkan `data-scroll-behavior="smooth"` pada root layout untuk menghilangkan warning route transition Next.js 16.
- Stabilkan posisi anchor About saat navigasi lintas halaman setelah scroll otomatis Next.js selesai.
- Ubah section Peran Afana menjadi Makna Logo dengan narasi bilingual berdasarkan bentuk logo Afana.
- Susun section Makna Logo dengan format editorial berisi makna warna, makna simbol, dan lockup logo Afana.
- Hilangkan garis pemisah sebelum lockup logo dan perbesar ukuran logo pada section Makna Logo.
- Perbesar kembali lockup logo Makna Logo menjadi 2× dari ukuran sebelumnya secara responsif.
- Satukan simbol dan wordmark Makna Logo menjadi satu aset SVG agar alignment dan area visualnya terhitung sebagai satu logo.
- Tambahkan aturan workflow agar dokumentasi Markdown yang relevan selalu ditinjau dan diperbarui bersama perubahan kode.

Semua perubahan penting pada proyek ini dicatat di sini.

## [Unreleased]

### Added

- Memisahkan instruksi agent, design system, security, dan roadmap ke dokumen masing-masing.
- Menetapkan route sebagai sumber kebenaran untuk dual language dengan `/id` dan `/en`.
- Mendokumentasikan Pertamina sebagai referensi UI corporate yang tidak boleh disalin secara identik.
- Mendokumentasikan aturan skeleton loading, reduced motion, responsive behavior, dan verifikasi release.
- Menambahkan prototype topbar transparan dua tingkat dan hero full-bleed Afana.
- Menambahkan Swiper dengan fade transition 1200ms untuk media dan copy hero.
- Menambahkan font Lexend dan Source Sans 3 secara self-hosted untuk build yang tidak bergantung pada Google Fonts.
- Memperluas narasi profil Afana menjadi konten dummy multi-paragraf dalam bahasa Indonesia dan Inggris.
- Merapikan alignment dan posisi tengah teks pada section profil perusahaan.
- Menata aset gambar profil ke folder `public/images/about` dan menambahkan sudut rounded pada gambar.
- Menggunakan file asli tanpa kompresi Next.js untuk gambar profil.
- Memperkuat narasi visi dan misi Afana untuk positioning perusahaan yang lebih meyakinkan.
- Memisahkan section dan navigasi Visi serta Misi menjadi anchor yang berdiri sendiri.
- Menggabungkan kembali Visi & Misi dalam satu section dengan dua blok konten responsif.
- Menata blok Visi dan Misi secara vertikal dengan daftar poin bernomor pada Visi.
- Memperbaiki offset anchor section agar tidak tertutup header dan navigasi sticky.
- Mengubah section latar belakang menjadi timeline Swiper bilingual dengan enam milestone, autoplay 25 detik, dan progress rail aksesibel.
- Memastikan konfigurasi autoplay timeline memakai durasi 25 detik sejak inisialisasi pertama.
- Menggunakan enam aset `Our-Background` baru untuk seluruh gambar timeline latar belakang.
- Menambahkan perilaku auto-hide header saat scroll turun dan menampilkannya kembali saat scroll naik.
- Menambahkan halaman Media & Informasi bilingual dengan featured article, filter kategori, dan detail artikel statis.
- Menambahkan hero berita dengan pagination clickable, keyboard navigation, dan CTA menuju detail setiap artikel.
- Menambahkan struktur konten media yang siap dipetakan ke CMS pada fase berikutnya.
- Memasang topbar pada seluruh route listing dan detail Media & Informasi.
