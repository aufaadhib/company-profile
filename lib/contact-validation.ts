export const contactTopics = [
  "GENERAL",
  "ELECTRICAL_SOLUTIONS",
  "PARTNERSHIP",
  "PROCUREMENT",
  "CAREER",
  "MEDIA",
] as const;

export type ContactLocale = "id" | "en";
export type ContactTopicValue = (typeof contactTopics)[number];
export type ContactFieldName = "name" | "email" | "phone" | "topic" | "message" | "consent" | "turnstile";

export type ContactFormState = {
  status: "idle" | "error" | "success" | "warning";
  message: string;
  fieldErrors?: Partial<Record<ContactFieldName, string>>;
};

export type ContactInput = {
  name: string;
  email: string;
  phone: string | null;
  topic: ContactTopicValue;
  message: string;
  locale: ContactLocale;
  turnstileToken: string;
};

type ContactValidationResult =
  | { success: true; data: ContactInput }
  | { success: false; isBot: boolean; locale: ContactLocale; errors: ContactFormState["fieldErrors"] };

const topicSet = new Set<string>(contactTopics);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\-\s]{7,30}$/;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function copy(locale: ContactLocale) {
  return locale === "id"
    ? {
        name: "Masukkan nama antara 2 dan 100 karakter.",
        email: "Masukkan alamat email yang valid.",
        phone: "Gunakan format nomor telepon yang valid.",
        topic: "Pilih topik pesan.",
        message: "Pesan harus berisi 20 sampai 2.000 karakter.",
        consent: "Persetujuan penggunaan data diperlukan.",
        turnstile: "Selesaikan verifikasi keamanan.",
      }
    : {
        name: "Enter a name between 2 and 100 characters.",
        email: "Enter a valid email address.",
        phone: "Use a valid phone number format.",
        topic: "Choose a message topic.",
        message: "The message must contain 20 to 2,000 characters.",
        consent: "Consent to use the submitted data is required.",
        turnstile: "Complete the security verification.",
      };
}

/** Validates and normalizes untrusted public contact form data. */
export function validateContactForm(formData: FormData): ContactValidationResult {
  const locale: ContactLocale = readString(formData, "locale") === "en" ? "en" : "id";
  const honeypot = readString(formData, "website").trim();

  if (honeypot) {
    return { success: false, isBot: true, locale, errors: {} };
  }

  const messages = copy(locale);
  const errors: ContactFormState["fieldErrors"] = {};
  const name = readString(formData, "name").trim().replace(/\s+/g, " ");
  const email = readString(formData, "email").trim().toLowerCase();
  const rawPhone = readString(formData, "phone").trim();
  const topic = readString(formData, "topic");
  const message = readString(formData, "message").trim();
  const consent = readString(formData, "consent") === "accepted";
  const turnstileToken = readString(formData, "cf-turnstile-response").trim();

  if (name.length < 2 || name.length > 100) errors.name = messages.name;
  if (email.length > 254 || !emailPattern.test(email)) errors.email = messages.email;
  if (rawPhone && !phonePattern.test(rawPhone)) errors.phone = messages.phone;
  if (!topicSet.has(topic)) errors.topic = messages.topic;
  if (message.length < 20 || message.length > 2000) errors.message = messages.message;
  if (!consent) errors.consent = messages.consent;
  if (!turnstileToken || turnstileToken.length > 2048) errors.turnstile = messages.turnstile;

  if (Object.keys(errors).length > 0) {
    return { success: false, isBot: false, locale, errors };
  }

  return {
    success: true,
    data: {
      name,
      email,
      phone: rawPhone || null,
      topic: topic as ContactTopicValue,
      message,
      locale,
      turnstileToken,
    },
  };
}

/** Returns the exact retention boundary used by the database cleanup job. */
export function getContactExpiryDate(createdAt: Date) {
  const expiresAt = new Date(createdAt);
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);
  expiresAt.setUTCDate(expiresAt.getUTCDate() - 1);
  return expiresAt;
}
