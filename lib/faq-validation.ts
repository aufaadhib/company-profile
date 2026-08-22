export type FaqLocale = "id" | "en";

export type FaqTranslation = {
  question: string;
  answer: string;
};

export type FaqRevisionPayload = {
  translations: Record<FaqLocale, FaqTranslation>;
};

export type FaqDraftInput = {
  faqItemId: string | null;
  categoryId: string;
  lockVersion: number;
  payload: FaqRevisionPayload;
};

export type FaqFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export type FaqCategoryInput = {
  categoryId: string | null;
  slug: string;
  titleId: string;
  titleEn: string;
  lockVersion: number;
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateTranslation(locale: FaqLocale, translation: FaqTranslation, errors: Record<string, string>) {
  if (translation.question.length > 240) errors[`${locale}.question`] = "Pertanyaan maksimal 240 karakter.";
  if (translation.answer.length > 8000) errors[`${locale}.answer`] = "Jawaban maksimal 8.000 karakter.";
}

export function validateFaqDraftForm(formData: FormData): ValidationResult<FaqDraftInput> {
  const errors: Record<string, string> = {};
  const faqItemId = readString(formData, "faqItemId") || null;
  const categoryId = readString(formData, "categoryId");
  const lockVersion = Number(readString(formData, "lockVersion") || "0");
  const translations: FaqRevisionPayload["translations"] = {
    id: { question: readString(formData, "idQuestion"), answer: readString(formData, "idAnswer") },
    en: { question: readString(formData, "enQuestion"), answer: readString(formData, "enAnswer") },
  };

  if (faqItemId && !UUID_PATTERN.test(faqItemId)) errors.faqItemId = "ID FAQ tidak valid.";
  if (!UUID_PATTERN.test(categoryId)) errors.categoryId = "Pilih kategori FAQ.";
  if (!Number.isSafeInteger(lockVersion) || lockVersion < 0) errors.lockVersion = "Versi FAQ tidak valid.";
  validateTranslation("id", translations.id, errors);
  validateTranslation("en", translations.en, errors);

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { faqItemId, categoryId, lockVersion, payload: { translations } } };
}

export function validateFaqForPublication(payload: FaqRevisionPayload) {
  const errors: Record<string, string> = {};
  for (const locale of ["id", "en"] as const) {
    const translation = payload.translations[locale];
    if (translation.question.length < 8) errors[`${locale}.question`] = "Pertanyaan minimal 8 karakter.";
    if (translation.answer.length < 20) errors[`${locale}.answer`] = "Jawaban minimal 20 karakter.";
    validateTranslation(locale, translation, errors);
  }
  return errors;
}

export function validateFaqCategoryForm(formData: FormData): ValidationResult<FaqCategoryInput> {
  const errors: Record<string, string> = {};
  const categoryId = readString(formData, "categoryId") || null;
  const slug = readString(formData, "slug").toLowerCase();
  const titleId = readString(formData, "titleId");
  const titleEn = readString(formData, "titleEn");
  const lockVersion = Number(readString(formData, "lockVersion") || "0");

  if (categoryId && !UUID_PATTERN.test(categoryId)) errors.categoryId = "ID kategori tidak valid.";
  if (!SLUG_PATTERN.test(slug) || slug.length > 100) errors.slug = "Slug wajib berupa huruf kecil, angka, dan tanda hubung, maksimal 100 karakter.";
  if (titleId.length < 2 || titleId.length > 100) errors.titleId = "Nama Indonesia harus 2–100 karakter.";
  if (titleEn.length < 2 || titleEn.length > 100) errors.titleEn = "Nama Inggris harus 2–100 karakter.";
  if (!Number.isSafeInteger(lockVersion) || lockVersion < 0) errors.lockVersion = "Versi kategori tidak valid.";

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { categoryId, slug, titleId, titleEn, lockVersion } };
}

export function isFaqRevisionPayload(value: unknown): value is FaqRevisionPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FaqRevisionPayload>;
  if (!candidate.translations || typeof candidate.translations !== "object") return false;
  return (["id", "en"] as const).every((locale) => {
    const translation = candidate.translations?.[locale];
    return Boolean(translation && typeof translation.question === "string" && typeof translation.answer === "string");
  });
}

export function hasFaqVersionConflict(currentVersion: number, expectedVersion: number) {
  return currentVersion !== expectedVersion;
}
