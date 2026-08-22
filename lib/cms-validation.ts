export const cmsMediaCategories = ["news", "insight", "technology"] as const;

export type CmsMediaCategory = (typeof cmsMediaCategories)[number];
export type CmsLocale = "id" | "en";

export type CmsTranslation = {
  title: string;
  excerpt: string;
  imageAlt: string;
  body: string[];
};

export type MediaRevisionPayload = {
  category: CmsMediaCategory;
  publishedAt: string;
  isFeatured: boolean;
  translations: Record<CmsLocale, CmsTranslation>;
};

export type MediaDraftInput = {
  articleId: string | null;
  slug: string;
  assetId: string | null;
  lockVersion: number;
  payload: MediaRevisionPayload;
};

export type MediaFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

type MediaDraftValidation =
  | { success: true; data: MediaDraftInput }
  | { success: false; errors: Record<string, string> };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readParagraphs(formData: FormData, key: string) {
  const raw = readString(formData, key);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function validateTranslation(locale: CmsLocale, translation: CmsTranslation, errors: Record<string, string>) {
  const prefix = `${locale}.`;
  if (translation.title.length > 160) errors[`${prefix}title`] = "Judul maksimal 160 karakter.";
  if (translation.excerpt.length > 320) errors[`${prefix}excerpt`] = "Ringkasan maksimal 320 karakter.";
  if (translation.imageAlt.length > 180) errors[`${prefix}imageAlt`] = "Alt text maksimal 180 karakter.";
  if (translation.body.length > 50) errors[`${prefix}body`] = "Isi maksimal 50 paragraf.";
  if (translation.body.some((paragraph) => paragraph.length > 5000)) {
    errors[`${prefix}body`] = "Setiap paragraf maksimal 5.000 karakter.";
  }
  if (translation.body.reduce((total, paragraph) => total + paragraph.length, 0) > 50000) {
    errors[`${prefix}body`] = "Total isi maksimal 50.000 karakter.";
  }
}

export function validateMediaDraftForm(formData: FormData): MediaDraftValidation {
  const errors: Record<string, string> = {};
  const articleId = readString(formData, "articleId") || null;
  const assetId = readString(formData, "assetId") || null;
  const slug = readString(formData, "slug").toLowerCase();
  const lockVersionRaw = readString(formData, "lockVersion") || "0";
  const lockVersion = Number(lockVersionRaw);
  const category = readString(formData, "category") as CmsMediaCategory;
  const publishedAt = readString(formData, "publishedAt");

  if (articleId && !UUID_PATTERN.test(articleId)) errors.articleId = "ID artikel tidak valid.";
  if (assetId && !UUID_PATTERN.test(assetId)) errors.assetId = "Gambar belum terdaftar dengan benar.";
  if (!SLUG_PATTERN.test(slug) || slug.length > 160) {
    errors.slug = "Slug wajib berupa huruf kecil, angka, dan tanda hubung, maksimal 160 karakter.";
  }
  if (!Number.isSafeInteger(lockVersion) || lockVersion < 0) errors.lockVersion = "Versi artikel tidak valid.";
  if (!cmsMediaCategories.includes(category)) errors.category = "Pilih kategori artikel.";
  if (publishedAt && (!DATE_PATTERN.test(publishedAt) || Number.isNaN(Date.parse(`${publishedAt}T00:00:00Z`)))) {
    errors.publishedAt = "Tanggal artikel tidak valid.";
  }

  const translations: Record<CmsLocale, CmsTranslation> = {
    id: {
      title: readString(formData, "idTitle"),
      excerpt: readString(formData, "idExcerpt"),
      imageAlt: readString(formData, "idImageAlt"),
      body: readParagraphs(formData, "idBody"),
    },
    en: {
      title: readString(formData, "enTitle"),
      excerpt: readString(formData, "enExcerpt"),
      imageAlt: readString(formData, "enImageAlt"),
      body: readParagraphs(formData, "enBody"),
    },
  };

  validateTranslation("id", translations.id, errors);
  validateTranslation("en", translations.en, errors);

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      articleId,
      slug,
      assetId,
      lockVersion,
      payload: {
        category,
        publishedAt,
        isFeatured: formData.get("isFeatured") === "on",
        translations,
      },
    },
  };
}

export function validateRevisionForPublication(payload: MediaRevisionPayload, assetId: string | null) {
  const errors: Record<string, string> = {};

  if (!assetId) errors.assetId = "Tambahkan gambar sebelum artikel diterbitkan.";
  if (!payload.publishedAt) errors.publishedAt = "Tanggal artikel wajib diisi sebelum diterbitkan.";

  for (const locale of ["id", "en"] as const) {
    const translation = payload.translations[locale];
    if (translation.title.length < 10) errors[`${locale}.title`] = "Judul minimal 10 karakter.";
    if (translation.excerpt.length < 20) errors[`${locale}.excerpt`] = "Ringkasan minimal 20 karakter.";
    if (translation.imageAlt.length < 5) errors[`${locale}.imageAlt`] = "Alt text minimal 5 karakter.";
    if (translation.body.length === 0) errors[`${locale}.body`] = "Tambahkan minimal satu paragraf.";
    validateTranslation(locale, translation, errors);
  }

  return errors;
}

export function isMediaRevisionPayload(value: unknown): value is MediaRevisionPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MediaRevisionPayload>;
  if (!cmsMediaCategories.includes(candidate.category as CmsMediaCategory)) return false;
  if (typeof candidate.publishedAt !== "string" || typeof candidate.isFeatured !== "boolean") return false;
  if (!candidate.translations || typeof candidate.translations !== "object") return false;

  return (["id", "en"] as const).every((locale) => {
    const translation = candidate.translations?.[locale];
    return Boolean(
      translation &&
      typeof translation.title === "string" &&
      typeof translation.excerpt === "string" &&
      typeof translation.imageAlt === "string" &&
      Array.isArray(translation.body) &&
      translation.body.every((paragraph) => typeof paragraph === "string"),
    );
  });
}

