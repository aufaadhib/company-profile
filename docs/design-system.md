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

- Standar font, ukuran, line-height, tracking, dan tinggi seluruh hero berada di `docs/hero-standards.md` dan wajib digunakan bersama.
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
- Hero utama dapat memakai `100svh`, sedangkan hero interior memakai komposisi `60svh` sesuai matriks di `docs/hero-standards.md`.
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

Pada desktop, navigasi memiliki primary navigation dan utility navigation. CTA header berada di utility navigation, sejajar dengan link pendukung dan bahasa di sisi kanan. Dropdown menggunakan focus state, hover state, dan panel putih dengan radius serta shadow ringan.

Kontrol pencarian pada primary navigation tetap terlihat pada keadaan header transparan maupun compact setelah scroll, dengan warna yang mengikuti kontras permukaan header.

## Home hero

Hero home adalah media full-bleed dengan tinggi `100svh` dan fokus pada solusi kelistrikan Afana.

- Gambar industri atau infrastruktur kelistrikan menjadi latar utama.
- Dua overlay gelap-biru membantu menjaga keterbacaan copy tanpa menghilangkan konteks gambar.
- Copy utama berada di area kiri bawah pada desktop dan tetap tersusun secara vertikal pada layar kecil.
- Heading besar menyampaikan manfaat utama solusi kelistrikan bagi perlindungan perangkat.
- Rail pagination berada di bagian bawah hero dan berfungsi sebagai penanda slide sekaligus kontrol navigasi.
- Swiper memakai fade transition dengan speed `1200ms`, keyboard navigation, pagination clickable, accessibility labels, dan autoplay `7000ms`.
- Seluruh media hero dimuat eager karena setiap slide full-viewport dapat menjadi kandidat LCP saat autoplay; jumlahnya tetap dibatasi pada aset hero.

## Home sections

Setelah hero, Home membentuk alur corporate editorial yang menghubungkan profil, ruang solusi, cara kerja, keberlanjutan, Media, dan Contact tanpa mengulang komposisi hero interior.

- Teaser profil memakai susunan media dan copy asimetris dengan satu garis oranye sebagai penanda aliran energi.
- Anchor `#bisnis-afana` menampilkan ruang solusi dengan tab Fokus Sistem dan Pendekatan Kerja. Setiap tab berisi empat kartu interaktif: gambar dan judul di depan, lalu ringkasan teknis setelah kartu berputar.
- Ukuran visual kartu solusi diperkecil menjadi 75% dari lebar grid awal pada mobile, tablet, dan desktop; card tetap menempel ke kiri dengan gap desktop yang rapat dan whitespace di sisi kanan, sementara rasio kartu tetap portrait agar hierarki gambar dan judul terjaga.
- Fine pointer membalik kartu saat hover. Keyboard memakai Enter/Space dan perangkat sentuh memakai tap untuk mengunci atau mengembalikan kartu; nama tindakan dan ringkasan tetap tersedia bagi screen reader.
- Permukaan depan card tidak memakai ikon flip dekoratif; affordance tetap tersedia melalui hover, tap, keyboard, dan accessible label.
- Flip memakai satu bidang visual yang menutup ke 90 derajat, menukar konten di titik tengah, lalu membuka kembali. Permukaan depan dan belakang tidak dirender bertumpuk agar tidak menimbulkan artefak pada frame transisi.
- Pergantian tab memakai hinge transition CSS berurutan. Reduced motion meniadakan gerakan besar; mobile memakai horizontal scroll-snap native, medium memakai dua kolom, dan desktop empat kolom.
- Section `#cara-kerja-afana` menampilkan empat langkah dalam rail teknis: memahami kondisi, menstabilkan daya, melindungi perangkat, dan memperpanjang nilai aset.
- Teaser Sustainability memakai foto inspeksi kualitas daya dengan optimizer quality `90` dan mengarahkan pembaca ke route Sustainability aktif.
- Tiga Media terbaru dibaca dari published revision CMS dan ditampilkan melalui boundary Suspense lokal. Skeleton hanya menggantikan grid artikel, sementara heading dan navigasi section tetap tersedia.
- Penutup Home memakai bidang oranye solid sebagai transisi menuju Contact; tidak menambahkan form kedua atau kanal kontak yang terduplikasi.
- Seluruh section tetap memakai container `1440px`, padding responsif `24/40/80px`, heading Lexend, body Source Sans 3, divider teknis, dan target sentuh minimal `44px`.

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
- Artikel published berasal dari CMS Media; label halaman tetap lokal agar UI publik tidak berubah menjadi page builder.

## Dashboard Admin

- Route `/admin` memakai shell terpisah tanpa header/footer publik, dengan sidebar gelap pada desktop dan menu ringkas pada mobile/tablet.
- Arah visualnya adalah control ledger: permukaan terang, divider teknis, Lexend/Source Sans 3, serta aksen oranye yang sama dengan website.
- Elemen khas berupa publication rail untuk kelengkapan Indonesia, Inggris, gambar, dan status workflow; bukan card dekoratif.
- Editor memakai field datar, tab bilingual, blok paragraf yang dapat diurutkan, preview gambar, dan action bar yang jelas pada 375px, 768px, 1024px, serta 1440px.
- Contact Control memakai ledger inbox responsif, detail pesan dengan jejak status, serta halaman settings tanpa card grid. Radio native memilih Auto Email aktif/nonaktif; checkbox native mengatur visibilitas email, telepon, WhatsApp, dan lokasi.
- Inbox Contact menjadi daftar bertumpuk pada mobile dan grid berkolom pada desktop. Status unread, sent, failed, skipped, archived, loading, empty, pending, dan permission harus tetap terbaca tanpa bergantung pada warna.
- Motion dashboard dibatasi pada transisi warna sederhana.

## Sustainability

Halaman Sustainability menggunakan arah technical sustainability editorial yang menjelaskan kontribusi Afana melalui kualitas daya, perlindungan perangkat, pemeliharaan, dan kesinambungan operasi.

- Route bilingual menggunakan `/id/keberlanjutan` dan `/en/sustainability`.
- Hero memakai foto industri full-bleed setinggi `60svh` dengan ruang copy di sisi kiri.
- Elemen khas halaman adalah alur empat tahap berbasis HTML/CSS: memahami kondisi, menstabilkan daya, melindungi perangkat, dan memperpanjang nilai aset. Mobile dan tablet memakai panel datar tanpa shadow, sedangkan desktop memakai rail horizontal dengan node oranye tanpa divider vertikal panjang.
- Alur nilai energi memakai dua kolom pada medium dan empat kolom mulai `1280px`, agar teks langkah tetap terbaca pada lebar `1024px`.
- Copy versi awal bersifat draft aspiratif; angka dampak, target, sertifikasi, dan klaim faktual tidak boleh ditambahkan tanpa persetujuan pengguna.
- Halaman menggunakan aset gambar khusus di `public/images/sustainability` dan tetap mengikuti aturan `next/image`, ukuran responsif, alt text, dan lazy loading di bawah fold.
- Foto inspeksi pada Fokus Keberlanjutan memakai kualitas optimizer `90` untuk mempertahankan detail panel dan kabel yang rapat.

## Contact

Halaman Contact memakai route `/id/kontak` dan `/en/contact` dengan mode persuade yang tetap tenang dan teknis.

- Hero interior memakai tinggi `60svh` dengan minimum `512px` dan skala `.hero-title` bersama.
- Signature visual adalah connection ledger berupa SVG geometris presisi dengan node oranye; bukan ilustrasi, peta, grid dekoratif, atau foto generik.
- Kanal email, telepon, WhatsApp, dan lokasi disusun sebagai baris editorial dengan divider, bukan kumpulan card identik.
- Form memakai field datar dengan border bawah, label tetap terlihat, pending/error/success state, consent, dan Turnstile.
- Client Component dibatasi pada form. Route, hero, kanal langsung, dan metadata tetap Server Component.
- Tanpa konfigurasi Turnstile, tombol submit nonaktif dengan penjelasan yang jelas; kanal langsung tetap dapat dipakai.
- Nilai awal yang disetujui: `info@afana.id`, `081331096250`, dan Banyuwangi. Admin dapat memperbarui atau menyembunyikan kanal tersebut; jangan menambahkan alamat rinci, peta, jam operasional, atau waktu respons tanpa input pengguna.

## FAQ

Halaman FAQ memakai route bilingual `/id/faq` dan `/en/faq` dengan pola Search Desk.

- Hero interior menggunakan tinggi `60svh` dan minimum `512px`, dengan connection grid teknis sebagai signature visual tanpa aset foto tambahan.
- Pencarian dan filter kategori memakai query GET `q` dan `category`, sehingga state dapat dibagikan, dibuka ulang, dan tetap berfungsi tanpa Client Component.
- Daftar pertanyaan menggunakan accordion native `details/summary`; pertanyaan, jawaban, filter, empty state, dan CTA Contact tersedia setara dalam Indonesia dan Inggris.
- Desktop memakai sidebar pencarian sticky dan ledger FAQ di kanan. Mobile menyusun pencarian, filter, lalu pertanyaan secara vertikal tanpa horizontal overflow.
- JSON-LD `FAQPage` hanya ditampilkan pada URL dasar tanpa filter dan hanya berisi revision published dari kategori aktif.
- Konten FAQ berasal dari CMS revision immutable. Seed awal berisi 20 FAQ bilingual yang disetujui pengguna, dengan jawaban konservatif tanpa klaim harga, SLA, sertifikasi, atau spesifikasi yang belum dikonfirmasi.

## Halaman About

Halaman About menyajikan profil Afana melalui urutan informasi yang jelas:

1. Hero profil perusahaan.
2. Tab section: Profil Afana, Latar Belakang, Visi & Misi, Fokus Solusi, dan Peran Afana.
3. Profil perusahaan dengan body copy rata kiri-kanan dan gambar teknisi rounded.
4. Timeline perjalanan Afana.
5. Visi & Misi dalam satu section dengan dua blok konten.
6. Fokus pada Solusi Kelistrikan.
7. Makna Logo dengan susunan pengantar, daftar makna warna, daftar makna simbol, dan satu aset lockup logo Afana di bagian bawah.

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
- Semua tombol aktif menggunakan cursor pointer melalui baseline global; tombol disabled tidak diperlakukan sebagai pointer.

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
- Database digunakan untuk form Contact, CMS Media, dan CMS FAQ yang telah disetujui. Jangan memperluas CMS ke halaman lain tanpa kebutuhan produk yang jelas.
- Setiap perubahan visual yang mengubah token, breakpoint, motion, atau hierarchy harus diperbarui di dokumen ini dan diverifikasi pada breakpoint utama.
