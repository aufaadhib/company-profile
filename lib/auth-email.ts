import "server-only";

import { Resend } from "resend";

async function sendAuthEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) throw new Error("RESEND_FROM_EMAIL is not configured.");
  const fromName = process.env.RESEND_FROM_NAME;
  if (!fromName) throw new Error("RESEND_FROM_NAME is not configured.");

  const { error } = await new Resend(apiKey).emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject,
    text,
  });

  if (error) throw new Error("Resend rejected the authentication email.");
}

export function sendPasswordSetupEmail(email: string, name: string, url: string) {
  return sendAuthEmail(
    email,
    "Atur password Afana CMS",
    [
      `Halo ${name},`,
      "",
      "Gunakan tautan berikut untuk mengatur password Afana CMS:",
      url,
      "",
      "Tautan berlaku selama satu jam. Abaikan email ini jika Anda tidak meminta akses.",
    ].join("\n"),
  );
}
