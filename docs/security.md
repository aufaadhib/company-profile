# Security and Privacy

## Current Scope

Proyek memakai dua backend terbatas: form Contact dan CMS Media internal. Pesan Contact disimpan pada Neon PostgreSQL, sedangkan artikel Media memakai revision immutable, Better Auth, role Admin/Editor, dan Vercel Blob.

## Permanent Rules

1. Secret, credential, token, connection string, dan private key hanya boleh berasal dari environment variable atau secret manager. Jangan menulisnya di source code, Markdown, log, screenshot, atau commit.
2. Jangan menerbitkan data pribadi, alamat, nomor telepon, email, CV, atau dokumen pengguna tanpa persetujuan eksplisit.
3. Jangan mengandalkan validasi client-side sebagai kontrol keamanan.
4. Jangan menambahkan backend, database, authentication, atau dynamic data hanya untuk kebutuhan yang belum disepakati.
5. Saat memeriksa repository, jangan menampilkan nilai secret; gunakan `[REDACTED_SECRET]` bila perlu menyebut keberadaannya.

## Contact Form Boundary

1. Form hanya mengumpulkan nama, email, telepon opsional, topik, pesan, locale, dan persetujuan retensi.
2. Semua input divalidasi ulang di Server Action. Turnstile wajib diverifikasi di server sebelum database ditulis.
3. Rate limit memakai HMAC dari IP request dan secret server; IP mentah tidak disimpan.
4. Pesan disimpan maksimal 12 bulan. `expiresAt` memakai buffer satu hari dan Vercel Cron berjalan harian agar penghapusan fisik tidak melewati batas retensi; route dilindungi `CRON_SECRET`.
5. Prisma, Neon, Resend, Turnstile secret, dan database record hanya boleh diakses dari module server-only.
6. Server Action hanya mengembalikan status dan field error yang diperlukan UI; record database tidak dikirim ke client.
7. Nama sender, alamat sender, dan email publik/penerima dapat dikelola Admin dari database; `RESEND_FROM_NAME` dan `RESEND_FROM_EMAIL` hanya menjadi fallback awal. API key tetap di environment dan email pengunjung menjadi Reply-To.
8. Inbox Contact hanya tersedia bagi Admin utama. Editor tidak menerima data pribadi Contact, dan tidak ada endpoint baca publik, file attachment, atau export pesan.
9. Auto Email yang nonaktif menghasilkan status `SKIPPED`; Admin dapat mengirim satu notifikasi manual untuk status `FAILED` atau `SKIPPED`. Archive tidak mengubah batas retensi 12 bulan.
10. Perubahan settings, archive/restore, test email, dan kirim ulang dicatat pada audit log tanpa menyimpan secret atau isi pesan.

## CMS Media Boundary

1. Registrasi publik dinonaktifkan. Satu Admin utama dibuat melalui CLI dan harus cocok dengan `CMS_OWNER_EMAIL`; Editor hanya dibuat oleh Admin.
2. Editor dapat mengelola draft, preview, dan meminta review. Admin mewarisi hak Editor serta dapat publish, unpublish, arsip, restore, dan mengelola Editor.
3. Setiap mutation dan upload memvalidasi session serta role di server. Cookie check pada `proxy.ts` hanya redirect optimistik.
4. Setiap penyimpanan menghasilkan revision immutable. Website publik hanya membaca pointer published; draft, archived content, dan preview tidak memiliki endpoint baca publik.
5. Publication memakai optimistic locking, transaksi, satu featured article, audit log, dan revalidation terbatas untuk route Media bilingual.
6. Upload Blob membatasi JPEG, PNG, WebP, dan AVIF maksimal 8 MB. Server memverifikasi ulang metadata Blob sebelum menyimpan asset record.
7. Password reset dan undangan berlaku satu jam, dikirim melalui Resend, dan reset mencabut session lain.
8. CMS tidak mengelola halaman statis lain, analytics, komentar, atau media deletion.
