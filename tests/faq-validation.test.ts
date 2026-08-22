import assert from "node:assert/strict";
import test from "node:test";

import {
  hasFaqVersionConflict,
  isFaqRevisionPayload,
  validateFaqCategoryForm,
  validateFaqDraftForm,
  validateFaqForPublication,
  type FaqRevisionPayload,
} from "../lib/faq-validation.ts";

const categoryId = "123e4567-e89b-42d3-a456-426614174000";

function completePayload(): FaqRevisionPayload {
  return {
    translations: {
      id: { question: "Bagaimana cara menghubungi tim Afana?", answer: "Gunakan halaman kontak untuk menyampaikan pertanyaan kepada tim Afana." },
      en: { question: "How can I contact the Afana team?", answer: "Use the contact page to send your question to the Afana team." },
    },
  };
}

test("draft FAQ accepts incomplete bilingual copy but validates IDs and version", () => {
  const formData = new FormData();
  formData.set("categoryId", categoryId);
  formData.set("lockVersion", "0");
  const result = validateFaqDraftForm(formData);
  assert.equal(result.success, true);

  formData.set("categoryId", "not-a-uuid");
  formData.set("lockVersion", "-1");
  const invalid = validateFaqDraftForm(formData);
  assert.equal(invalid.success, false);
  if (!invalid.success) {
    assert.equal(Boolean(invalid.errors.categoryId), true);
    assert.equal(Boolean(invalid.errors.lockVersion), true);
  }
});

test("publication requires complete Indonesian and English question and answer", () => {
  assert.deepEqual(validateFaqForPublication(completePayload()), {});
  const incomplete = completePayload();
  incomplete.translations.en.answer = "Short";
  const errors = validateFaqForPublication(incomplete);
  assert.equal(Boolean(errors["en.answer"]), true);
});

test("payload guard rejects malformed translations", () => {
  assert.equal(isFaqRevisionPayload(completePayload()), true);
  assert.equal(isFaqRevisionPayload({ translations: { id: { question: "A", answer: "B" } } }), false);
});

test("category validation normalizes slug and requires both titles", () => {
  const formData = new FormData();
  formData.set("slug", "  General-Info  ");
  formData.set("titleId", "Informasi Umum");
  formData.set("titleEn", "General Information");
  formData.set("lockVersion", "0");
  const result = validateFaqCategoryForm(formData);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.slug, "general-info");
});

test("optimistic version conflict is detected", () => {
  assert.equal(hasFaqVersionConflict(4, 3), true);
  assert.equal(hasFaqVersionConflict(4, 4), false);
});
