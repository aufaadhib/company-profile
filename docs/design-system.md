# Design System

Dokumen ini menyimpan keputusan visual yang menjadi sumber acuan portfolio. Nilai token yang belum disepakati pengguna tidak boleh dibuat sebagai fakta; catat keputusan final di sini dan implementasikan tokennya di `app/globals.css`.

## Visual Direction

- Bangun portfolio kreatif editorial dengan tipografi kuat, komposisi presisi, dan ruang lega.
- Pertahankan satu elemen visual khas sebagai pusat identitas; elemen lain harus tenang dan mendukung isi.
- Gunakan warna solid yang restrained untuk konteks corporate. Hindari gradien atau dekorasi berlebihan kecuali diputuskan secara eksplisit.
- Overlay gradient hanya digunakan sebagai lapisan keterbacaan di atas media hero; jangan menjadikannya dekorasi utama.
- Gunakan ikon secara hemat. Ikon sederhana dibuat sebagai SVG internal dan tidak digantikan emoji.

## Approved Reference

[Pertamina](https://www.pertamina.com/id) adalah referensi UI yang disetujui pengguna untuk arah corporate UI, kualitas penyajian, hierarki, dan struktur informasi.

Referensi ini bukan sumber untuk menyalin logo, aset, copy, komposisi, atau identitas merek. Adaptasikan prinsipnya menjadi identitas dan konten pengguna sendiri.

## Tokens

Gunakan token global untuk:

- warna dan status;
- typography dan hierarchy heading;
- spacing dan container;
- border, radius, dan shadow;
- easing dan durasi motion;
- breakpoint serta ukuran media.

Hindari nilai acak yang berulang di komponen. Jika sebuah nilai hanya digunakan sekali dan memiliki alasan visual yang jelas, dokumentasi tambahan tidak diperlukan.

## Typography and Layout

- Gunakan Lexend untuk display/navigation dan Source Sans 3 untuk body/utility melalui `next/font/local`; jangan mengimpor font melalui CSS `@import`.
- Gunakan ukuran tipe dan spacing fluid dengan `clamp()` bila membantu transisi antar breakpoint.
- Rancang mobile, tablet, dan desktop sebagai komposisi yang dapat berbeda; jangan hanya mengecilkan layout desktop.
- Periksa desain pada 375px, 768px, 1024px, dan 1440px.

## Hero Signature

- Hero memakai media full-bleed dengan overlay gelap-biru, copy terpusat, header transparan dua tingkat, dan carousel rail di bagian bawah.
- Swiper mengatur slide, keyboard, pagination, autoplay, dan fade transition pada media serta copy.
- Fade menjadi baseline di semua perangkat; reduced motion menonaktifkan autoplay dan tetap menampilkan slide secara langsung.

## About Timeline

- Section perjalanan Afana memakai media full-bleed dengan overlay gelap, copy ringkas, dan rail periode di bagian atas.
- Swiper mendukung pemilihan periode, swipe, keyboard, serta autoplay 25 detik.
- Garis aktif pada rail menunjukkan progres autoplay aktual; reduced motion menonaktifkan autoplay dan menampilkan penanda aktif secara statis.
- Rail periode tampil satu baris pada desktop dan dapat digeser horizontal pada mobile tanpa menyebabkan overflow halaman.

## Component Principles

- Gunakan komponen internal hanya saat pola benar-benar berulang.
- Komponen visual harus memiliki loading, error, focus, reduced-motion, dan responsive behavior yang sesuai bila state tersebut tersedia.
- Konten faktual, data pribadi, testimonial, statistik, dan klaim layanan hanya boleh dimasukkan setelah disetujui pengguna.
