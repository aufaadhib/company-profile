# Hero Standards

Dokumen ini adalah sumber kebenaran untuk typography dan tinggi seluruh hero publik Afana. Implementasi class bersama berada di `app/globals.css`.

## Font roles

| Role | Class | Font | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Breadcrumb | `.hero-breadcrumb` | Source Sans 3 | `clamp(14px, 0.83rem + 0.2vw, 16px)` | 500 | `1.5` | normal |
| Eyebrow | `.hero-eyebrow` | Source Sans 3 | `clamp(12px, 0.7rem + 0.2vw, 14px)` | 600 | `1.4` | `0.16em` |
| Metadata | `.hero-meta` | Source Sans 3 | `clamp(12px, 0.7rem + 0.2vw, 14px)` | 600 | `1.4` | `0.12em` |
| Title | `.hero-title` | Lexend | `clamp(44px, 2.25rem + 2vw, 68px)` | 600 | `0.98` | `-0.04em` |
| Description | `.hero-description` | Source Sans 3 | `clamp(16px, 0.95rem + 0.2vw, 18px)` | 400 | `1.75` | normal |
| Action | `.hero-action` | Source Sans 3 | `14px` | 600 | `20px` | normal |
| Carousel label | `.hero-pagination__label` | Source Sans 3 | `12px` | 600 | `1` | `0.12em` |

Seluruh hero memakai skala judul yang sama. Hero title memakai `text-wrap: balance`; description memakai `text-wrap: pretty`. Jangan menambahkan ukuran heading per halaman kecuali standar ini diubah terlebih dahulu.

## Title reference sizes

| Viewport | Computed title size |
| --- | --- |
| `375px` | `44px` |
| `768px` | `51.4px` |
| `1024px` | `56.5px` |
| `1204px` | `60.1px` |
| `1440px` | `64.8px` |
| `1600px` ke atas | maksimum `68px` |

## Height composition

| Hero | Height | Reason |
| --- | --- | --- |
| Home | `100svh`, minimum `640px` pada desktop | Carousel brand tetap full-screen; minimum desktop melindungi copy dan pagination pada viewport pendek. |
| Media listing | Minimum `100svh`, content-led | Carousel berita memenuhi viewport tanpa memotong judul, ringkasan, atau CTA dari CMS. |
| About | `60svh`, minimum `512px` | Interior landing lebih ringkas agar konten berikutnya cepat terlihat. |
| Sustainability | `60svh`, minimum `512px` | Menghindari pengulangan komposisi full-screen dan mempercepat transisi ke isi. |
| Business | `60svh`, minimum `512px` | Menyamakan ritme hero interior dengan Sustainability sambil menempatkan produk sebagai konteks utama. |
| Contact | `60svh`, minimum `512px` | Interior conversion page dengan transisi cepat menuju kanal dan form. |
| FAQ | `60svh`, minimum `512px` | Interior information desk yang segera mengantar pembaca ke pencarian dan accordion. |
| Media article | Content-led, minimum `max(60svh, 512px)` | Judul artikel dapat memanjang tanpa terpotong. |

## Responsive rules

- Semua hero tetap mobile-first dan diperiksa pada `375px`, `768px`, `1024px`, dan `1440px`.
- Jangan mengurangi body hero di bawah `16px` atau label di bawah `12px`.
- Tinggi hero adalah minimum, bukan maksimum. Hero wajib tumbuh mengikuti copy pada viewport pendek, browser zoom, dan locale dengan teks lebih panjang.
- `.hero-safe-content` menyediakan safe area `112px` pada mobile/tablet dan `144px` pada desktop terhadap header awal yang fixed.
- Gunakan minimum `100svh` untuk hero full-screen agar mengikuti viewport mobile modern tanpa mengunci overflow konten.
- Hero image tetap memakai ruang yang dicadangkan, overlay kontras, dan `sizes="100vw"` bila full-bleed.
- Carousel autoplay dinonaktifkan ketika `prefers-reduced-motion` aktif.
