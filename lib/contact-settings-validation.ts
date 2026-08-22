const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\-\s]{7,30}$/;

export type ContactSettingsData = {
  autoEmailEnabled: boolean;
  publicEmail: string;
  showEmail: boolean;
  senderName: string;
  senderEmail: string;
  phone: string;
  showPhone: boolean;
  whatsapp: string;
  showWhatsapp: boolean;
  location: string;
  showLocation: boolean;
};

export type ContactSettingsField = keyof ContactSettingsData;

type ContactSettingsValidationResult =
  | { success: true; data: ContactSettingsData }
  | { success: false; errors: Partial<Record<ContactSettingsField, string>> };

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(formData: FormData, key: string) {
  return formData.getAll(key).includes("true");
}

/** Validates the non-secret Contact configuration submitted by the Admin UI. */
export function validateContactSettingsForm(formData: FormData): ContactSettingsValidationResult {
  const data: ContactSettingsData = {
    autoEmailEnabled: readBoolean(formData, "autoEmailEnabled"),
    publicEmail: readString(formData, "publicEmail").toLowerCase(),
    showEmail: readBoolean(formData, "showEmail"),
    senderName: readString(formData, "senderName").replace(/\s+/g, " "),
    senderEmail: readString(formData, "senderEmail").toLowerCase(),
    phone: readString(formData, "phone"),
    showPhone: readBoolean(formData, "showPhone"),
    whatsapp: readString(formData, "whatsapp"),
    showWhatsapp: readBoolean(formData, "showWhatsapp"),
    location: readString(formData, "location").replace(/\s+/g, " "),
    showLocation: readBoolean(formData, "showLocation"),
  };
  const errors: Partial<Record<ContactSettingsField, string>> = {};

  if (!emailPattern.test(data.publicEmail) || data.publicEmail.length > 254) {
    errors.publicEmail = "Masukkan email publik yang valid.";
  }
  if (data.senderName.length < 2 || data.senderName.length > 100 || /[<>\r\n]/.test(data.senderName)) {
    errors.senderName = "Nama sender harus 2–100 karakter tanpa tanda < atau >.";
  }
  if (!emailPattern.test(data.senderEmail) || data.senderEmail.length > 254) {
    errors.senderEmail = "Masukkan email sender dari domain Resend terverifikasi.";
  }
  if (!phonePattern.test(data.phone)) errors.phone = "Masukkan nomor telepon yang valid.";
  if (!phonePattern.test(data.whatsapp)) errors.whatsapp = "Masukkan nomor WhatsApp yang valid.";
  if (data.location.length < 2 || data.location.length > 150) errors.location = "Lokasi harus 2–150 karakter.";

  return Object.keys(errors).length > 0 ? { success: false, errors } : { success: true, data };
}

function internationalDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export function phoneHref(value: string) {
  return `tel:+${internationalDigits(value)}`;
}

export function whatsappHref(value: string) {
  return `https://wa.me/${internationalDigits(value)}`;
}
