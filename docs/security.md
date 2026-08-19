# Security and Privacy

## Current Scope

Proyek saat ini adalah portfolio publik berbasis Next.js dan belum menggunakan authentication, database, CMS, atau upload media privileged. Jangan menambahkan area tersebut tanpa kebutuhan produk yang jelas dan keputusan di `docs/roadmap.md`.

## Permanent Rules

1. Secret, credential, token, connection string, dan private key hanya boleh berasal dari environment variable atau secret manager. Jangan menulisnya di source code, Markdown, log, screenshot, atau commit.
2. Jangan menerbitkan data pribadi, alamat, nomor telepon, email, CV, atau dokumen pengguna tanpa persetujuan eksplisit.
3. Jangan mengandalkan validasi client-side sebagai kontrol keamanan.
4. Jangan menambahkan backend, database, authentication, atau dynamic data hanya untuk kebutuhan yang belum disepakati.
5. Saat memeriksa repository, jangan menampilkan nilai secret; gunakan `[REDACTED_SECRET]` bila perlu menyebut keberadaannya.

## Future CMS Boundary

Jika CMS diaktifkan, implementasinya harus mengikuti batas berikut:

1. Hanya satu owner yang dapat mengakses CMS melalui Better Auth email/password.
2. PostgreSQL Neon digunakan melalui Prisma; secret tetap dari environment variable dan perubahan schema melalui migration.
3. Alur konten adalah draft, preview owner-only, lalu publish. Draft dan archived revision tidak boleh muncul di situs publik.
4. Publikasi memvalidasi payload, mencatat audit log, mengarsipkan revision published sebelumnya, dan melakukan revalidation terbatas.
5. Media disimpan di Vercel Blob melalui route owner-only dengan validasi MIME dan ukuran. Token Blob tidak pernah dikirim ke client.
6. Server Action, Route Handler, dan operasi privileged wajib memvalidasi input, session, dan permission di server.
7. Prisma Client, environment variable rahasia, dan integrasi privileged hanya boleh diimpor dari modul server-only.
