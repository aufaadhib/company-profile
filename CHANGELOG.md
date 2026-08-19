# Changelog

## Unreleased

- Perbaiki link header, menu mobile, footer, dan CTA agar konsisten menuju route `/id` atau `/en`, termasuk anchor beranda.
- Tambahkan aturan URL multi bahasa ke `AGENTS.md` dan dokumentasi design system.
- Pisahkan route About bahasa Inggris menjadi `/en/about`; `/en/tentang-kami` dipertahankan sebagai redirect legacy.
- Ganti seluruh aset visual Media & Informasi dengan delapan gambar lokal baru yang mengikuti tema berita dan tidak memakai ulang aset hero/About.
- Ubah hero Media & Informasi menjadi Swiper tiga berita terbaru berdasarkan tanggal terbit, dengan autoplay 8 detik dan reduced-motion fallback.
- Perbaiki inisialisasi autoplay Swiper pada Hero Home dan Media setelah preferensi reduced-motion selesai dibaca browser.
- Pastikan autoplay hero Media & Informasi tidak berhenti hanya karena pointer berada di atas area hero.
- Sesuaikan hero Media & Informasi menjadi full viewport `100svh` seperti hero Home.
- Turunkan posisi copy hero Media & Informasi agar tidak bertabrakan dengan navbar pada desktop.

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
