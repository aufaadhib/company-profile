# Design System Afana

Dokumen ini mencatat karakter visual dan aturan antarmuka yang saat ini sudah diterapkan pada website company profile Afana. Nilai token utama berada di `app/globals.css`; komponen tidak boleh memperkenalkan nilai berulang yang bertentangan dengan token ini.

## Arah visual

Afana menggunakan arah corporate electrical editorial: tegas, teknis, tenang, dan berorientasi pada keandalan. Media kelistrikan dan industri menjadi konteks visual utama, sementara tipografi besar, garis tipis, dan panel navigasi membantu menyusun informasi.

Karakter yang dipertahankan:

- Komposisi presisi dengan ruang lega dan hierarchy yang jelas.
- Permukaan konten terang yang kontras dengan section media gelap.
- Warna solid untuk identitas corporate.
- Aksen oranye dipakai sebagai penanda aktif, progres, selection, dan tindakan penting.
- Overlay gradient hanya digunakan di atas gambar untuk menjaga keterbacaan teks; bukan sebagai dekorasi mandiri.
- Ikon menggunakan SVG sederhana. Jangan gunakan emoji sebagai pengganti ikon antarmuka.

Pertamina tetap menjadi referensi tingkat tinggi untuk kualitas corporate, hierarchy, dan struktur informasi. Identitas Afana, logo, aset, copy, dan komposisi harus tetap orisinal.

## Token visual

### Warna

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--paper` | `#f7f7f5` | Latar utama halaman dan section konten |
| `--ink` | `#101820` | Teks utama, hero gelap, timeline, dan footer |
| `--accent` | `#e4572e` | Aksen aktif, progres, selection, dan CTA |
| `--accent-strong` | `#bb3d23` | Variasi aksen yang lebih pekat |
| `--muted` | `#667085` | Teks body dan informasi sekunder |
| `--line` | `#d8dde2` | Divider, border, dan pemisah navigasi |

Header dan navigasi menggunakan permukaan putih dengan transparansi tinggi saat sudah melewati hero, serta blur ringan untuk menjaga keterbacaan. Shadow dibatasi pada elemen yang membutuhkan pemisahan layer, terutama header, navigasi section, dan dropdown.

### Tipografi

- `Lexend` melalui `next/font/local` digunakan untuk logo wordmark, heading, navigasi utama, label display, dan angka besar.
- `Source Sans 3` melalui `next/font/local` digunakan untuk body copy, utility navigation, deskripsi, dan teks pendukung.
- Heading memakai tracking negatif yang rapat dan ukuran fluid dengan `clamp()`.
- Body copy memakai line-height longgar untuk paragraf profil dan konten teknis.
- Label kecil memakai uppercase, weight semibold, dan letter spacing untuk membentuk bahasa visual teknis.

### Layout dan breakpoint

- Container utama menggunakan lebar maksimum `1440px`.
- Padding horizontal utama: `24px` pada mobile, `40px` pada ukuran medium, dan `80px` pada desktop untuk section utama.
- Halaman dirancang mobile-first dan diperiksa pada lebar `375px`, `768px`, `1024px`, dan `1440px`.
- Di bawah `640px`, navigasi desktop dan tab section About disembunyikan; hamburger menu mengambil alih navigasi.
- Mulai `1024px`, navigasi desktop dan tab section About tampil.
- Section hero menggunakan `100svh` agar tinggi mengikuti viewport mobile modern tanpa menyisakan ruang akibat browser chrome.
- Gambar menggunakan `next/image` dengan `fill`, `object-cover`, dan ukuran yang dideklarasikan agar tidak menyebabkan layout shift.

## Logo dan ikon

Motif Afana berupa bidang miring yang terinspirasi dari aliran energi dan koneksi. Header dan footer saat ini menampilkan mark SVG internal bersama wordmark “Afana”.

Favicon menggunakan ikon dua bidang tanpa wordmark agar tetap terbaca pada ukuran kecil. Asetnya tersedia di:

- `app/icon.svg` untuk favicon Next.js.
- `public/afana_logo_icon_only.svg` sebagai aset ikon yang dapat digunakan ulang.

Logo tidak boleh diberi shadow, distorsi, atau warna baru di luar kebutuhan kontras pada permukaan tertentu.

## Header dan navigasi

Header adalah elemen fixed di atas viewport:

- Pada awal hero, header transparan dan menggunakan teks putih.
- Setelah halaman discroll, header berubah menjadi permukaan putih semi-opaque dengan teks gelap.
- Saat scroll ke bawah, header slide ke atas hingga keluar viewport.
- Saat scroll ke atas atau kembali dekat bagian atas, header slide turun kembali.
- Durasi transisi header adalah `650ms` dengan easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Navigasi section About memakai offset yang sama dengan kondisi header. Saat header tersembunyi, navigasi section naik ke batas atas viewport tanpa meninggalkan celah.
- Saat hamburger menu terbuka, header tetap berada di layer teratas dan overlay menu menempel langsung ke viewport.
- Hamburger menu dapat ditutup melalui tombol close, link navigasi, atau tombol `Escape`.

Pada desktop, navigasi memiliki primary navigation dan utility navigation. Dropdown menggunakan focus state, hover state, dan panel putih dengan radius serta shadow ringan.

## Home hero

Hero home adalah media full-bleed dengan tinggi `100svh` dan fokus pada solusi kelistrikan Afana.

- Gambar industri atau infrastruktur kelistrikan menjadi latar utama.
- Dua overlay gelap-biru membantu menjaga keterbacaan copy tanpa menghilangkan konteks gambar.
- Copy utama berada di area kiri bawah pada desktop dan tetap tersusun secara vertikal pada layar kecil.
- Heading besar menyampaikan manfaat utama solusi kelistrikan bagi perlindungan perangkat.
- Rail pagination berada di bagian bawah hero dan berfungsi sebagai penanda slide sekaligus kontrol navigasi.
- Swiper memakai fade transition dengan speed `1200ms`, keyboard navigation, pagination clickable, accessibility labels, dan autoplay `7000ms`.
- Slide pertama diprioritaskan sebagai media LCP; slide lain mengikuti kebutuhan carousel.

## Media & Informasi

Halaman Media & Informasi menggunakan pola editorial yang sama dengan hero Afana, tetapi lebih berorientasi pada pembacaan:

- Hero gelap full-bleed setinggi `100svh` menampilkan tiga berita terbaru berdasarkan `publishedAt`, dengan gambar, kategori, tanggal, judul, ringkasan, dan CTA artikel.
- Hero media menggunakan Swiper fade dengan speed `1000ms`, autoplay `8000ms`, pagination clickable, keyboard navigation, dan label aksesibilitas bilingual.
- Slide pertama diprioritaskan sebagai media LCP; gambar slide berikutnya mengikuti lazy loading bawaan `next/image`.
- Featured article memakai panel `--ink` dengan gambar besar dan copy kontras.
- Filter kategori menggunakan chip ringan tanpa search atau pagination.
- Kartu media memakai gambar rounded, metadata kategori/tanggal, judul, ringkasan, dan link baca selengkapnya.
- Halaman detail menggunakan hero artikel gelap, gambar utama, body copy lebar terbatas, dan bacaan terkait.
- Reduced motion menonaktifkan autoplay media hero dan mengurangi perpindahan visual.
- Konten awal bersifat dummy profesional, tetapi tipe data dan slug dibuat stabil agar dapat dipetakan ke CMS pada fase berikutnya.

## Halaman About

Halaman About menyajikan profil Afana melalui urutan informasi yang jelas:

1. Hero profil perusahaan.
2. Tab section: Profil Afana, Latar Belakang, Visi & Misi, Fokus Solusi, dan Peran Afana.
3. Profil perusahaan dengan body copy rata kiri-kanan dan gambar teknisi rounded.
4. Timeline perjalanan Afana.
5. Visi & Misi dalam satu section dengan dua blok konten.
6. Fokus pada Solusi Kelistrikan.
7. Peran Afana sebagai jembatan antara teknologi dan infrastruktur kelistrikan.

Body copy About menggunakan warna muted, line-height longgar, dan `text-justify` untuk menjaga bentuk kolom editorial. Setiap section memiliki divider bawah dan scroll margin yang mempertimbangkan header.

## Timeline perjalanan Afana

Timeline menggunakan section media full-bleed berwarna gelap dengan rail periode di bagian atas.

- Rail periode memiliki satu baris pada desktop dan dapat digeser horizontal pada mobile.
- Periode aktif ditandai dengan warna putih, titik oranye, dan garis progres oranye.
- Setiap periode menampilkan gambar, judul, periode, dan narasi singkat di atas overlay gelap.
- Swiper mendukung swipe, keyboard, klik periode, tab semantics, dan pesan accessibility untuk perpindahan slide.
- Autoplay timeline menggunakan delay `25000ms` dan progress rail mengikuti waktu autoplay aktual.
- Reduced motion menghentikan autoplay, menghilangkan perpindahan besar, dan menampilkan progres aktif secara statis.
- Tinggi timeline menyesuaikan viewport komposisi: lebih tinggi pada mobile dan semakin ringkas pada desktop.

## Footer

Footer menggunakan permukaan `--ink` dengan teks putih dan struktur kolom informasi.

- Mobile menggunakan susunan vertikal dengan jarak antar kelompok yang jelas.
- Desktop menggunakan grid empat kolom: identitas, eksplorasi, informasi, dan CTA.
- Divider tipis memisahkan konten footer dari baris penutup.
- Logo footer mempertahankan mark dan wordmark yang sama dengan header.
- Link bahasa mempertahankan pathname aktif: `/id/tentang-kami` berpindah ke `/en/about`, bukan kembali ke home atau memakai segmen Indonesia.

## URL dan bahasa

- Route publik menggunakan `/id` dan `/en` sebagai prefix wajib.
- Link lintas halaman harus di-resolve melalui locale aktif, termasuk link menuju anchor seperti `/${locale}/#hero-copy`.
- Hash-only link hanya untuk navigasi di section pada halaman yang sedang dibuka.
- Language switcher mempertahankan pathname dan slug aktif; segment About dipetakan antara `/tentang-kami` dan `/about`, sedangkan Media & Informasi dipetakan antara `/media-informasi` dan `/media-information`.

## Motion dan state

- Motion utama memakai CSS dan konfigurasi Swiper yang sudah terpasang.
- Header dan navigasi section menggunakan satu durasi serta easing yang sama agar bergerak selaras.
- Hover hanya digunakan untuk feedback ringan pada warna, opacity, dan posisi kecil; informasi penting tidak boleh bergantung pada hover.
- Focus state selalu terlihat pada link, button, tab, dropdown, pagination, dan kontrol carousel.
- `prefers-reduced-motion: reduce` mengurangi durasi transisi dan menonaktifkan autoplay atau perpindahan besar yang tidak diperlukan.
- Tidak ada animasi dekoratif yang mengalahkan copy atau media utama.

## Accessibility dan content

- Gunakan landmark semantik, heading hierarchy, skip link, accessible name, dan focus state.
- Target sentuh kontrol minimal `44px`.
- Gunakan alt text deskriptif untuk gambar informatif dan alt kosong untuk gambar dekoratif.
- Jangan menambahkan klaim bisnis, statistik, sertifikasi, pelanggan, alamat, atau kontak tanpa persetujuan pengguna.
- Klaim fokus pada 80% kerusakan perangkat hanya digunakan sebagai konten yang telah diberikan pengguna dan harus tetap diperlakukan sebagai klaim yang perlu disetujui untuk publikasi final.
- Konten Indonesia dan Inggris harus mempertahankan struktur informasi yang setara.

## Batasan implementasi

- Gunakan Server Component secara default; Client Component hanya untuk scroll state, browser API, Swiper, atau interaksi menu.
- Gunakan native CSS dan browser behavior sebelum menambah dependency.
- Jangan menambahkan CMS, database, authentication, upload media, library animation, atau carousel baru tanpa kebutuhan produk yang jelas.
- Setiap perubahan visual yang mengubah token, breakpoint, motion, atau hierarchy harus diperbarui di dokumen ini dan diverifikasi pada breakpoint utama.
