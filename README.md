# Company Profile

Company profile berbasis Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, form kontak PostgreSQL, serta CMS Media dan FAQ internal.

## Development

```bash
nvm use 24
npm install
npm run db:generate
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Contact form setup

1. Buat project Neon dan salin pooled connection string ke `DATABASE_URL`, lalu direct connection string ke `DIRECT_URL`.
2. Verifikasi domain pengirim pada Resend, buat sending-only API key untuk `RESEND_API_KEY`, lalu isi `RESEND_FROM_EMAIL` dan `RESEND_FROM_NAME`.
3. Buat widget Cloudflare Turnstile untuk route Contact dan pasang site key serta secret key.
4. Buat random secret untuk rate limit dan Vercel Cron.
5. Salin `.env.example` menjadi `.env.local`, lalu isi nilainya tanpa memasukkan secret ke Git.
6. Terapkan migration dengan `npm run db:deploy` setelah Neon tersedia.

`RESEND_FROM_EMAIL` dan `RESEND_FROM_NAME` menjadi nilai awal sebelum pengaturan pertama disimpan dari `/admin/contact/settings`. API key dan seluruh secret tetap hanya berasal dari environment variable.

Tanpa key Turnstile, route Contact tetap dapat dibuka dan kanal email, telepon, serta WhatsApp tetap berfungsi, tetapi submit form dinonaktifkan.

Route kontak:

- Indonesia: `/id/kontak`
- Inggris: `/en/contact`

Admin utama dapat membuka `/admin/contact` untuk membaca dan mengarsipkan submission, mengirim ulang notifikasi gagal atau dilewati, serta mengatur Auto Email dan kanal publik. Editor tidak memiliki akses ke data Contact.

## CMS Media dan FAQ setup

1. Tambahkan `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, `CMS_OWNER_EMAIL`, `CMS_OWNER_NAME`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME`, dan `BLOB_READ_WRITE_TOKEN` ke `.env.local` serta Vercel.
2. Buat Public Vercel Blob store agar gambar published dapat ditampilkan oleh `next/image`.
3. Jalankan `npm run db:deploy` untuk schema Contact, Media, dan FAQ, lalu `npm run db:seed:media` dan `npm run db:seed:faq` untuk konten awal.
4. Buat satu Admin utama dengan email yang sama seperti `CMS_OWNER_EMAIL`:

```bash
npm run cms:create-admin -- --email owner@example.com --name "Afana Owner" --role admin
```

5. Buka `/admin/login`. Admin dapat mengundang Editor dari menu Pengguna; registrasi publik dinonaktifkan.

Set `BETTER_AUTH_URL` ke origin deployment pada setiap environment. Seed Media aman dijalankan ulang dan tidak menggandakan slug.

FAQ dikelola dari `/admin/faq`. Seed FAQ bersifat idempotent dan menerbitkan 20 FAQ bilingual dalam lima kategori; FAQ yang sudah diimpor tidak ditimpa saat seed dijalankan ulang.

## Verification

```bash
npm run db:generate
npm run test:contact
npm run test:cms
npm run test:faq
npm run lint
npx tsc --noEmit
npm run build
```

## Documentation

- [PRODUCT.md](PRODUCT.md) - konteks produk dan batas capability yang telah dikonfirmasi.

- [docs/implementation-plan.md](docs/implementation-plan.md) - rencana implementasi dan handoff SOL ke LUNA.

- [AGENTS.md](AGENTS.md) — aturan implementasi untuk agent.
- [docs/design-system.md](docs/design-system.md) — arah visual dan token design system.
- [docs/hero-standards.md](docs/hero-standards.md) — standar typography dan tinggi seluruh hero.
- [docs/security.md](docs/security.md) — batasan security, privacy, dan future CMS.
- [docs/roadmap.md](docs/roadmap.md) — milestone dan keputusan yang dapat berubah.
- [CHANGELOG.md](CHANGELOG.md) — riwayat perubahan proyek.
