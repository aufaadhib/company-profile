import assert from "node:assert/strict";
import test from "node:test";

import { phoneHref, validateContactSettingsForm, whatsappHref } from "../lib/contact-settings-validation.ts";
import { getContactExpiryDate, validateContactForm } from "../lib/contact-validation.ts";

function validForm() {
  const formData = new FormData();
  formData.set("locale", "id");
  formData.set("name", "Afana Visitor");
  formData.set("email", "visitor@example.com");
  formData.set("phone", "+62 813 3109 6250");
  formData.set("topic", "GENERAL");
  formData.set("message", "Saya ingin mengetahui layanan Afana lebih lanjut.");
  formData.set("consent", "accepted");
  formData.set("cf-turnstile-response", "test-token");
  return formData;
}

test("normalizes a valid contact submission", () => {
  const result = validateContactForm(validForm());
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.email, "visitor@example.com");
  assert.equal(result.data.topic, "GENERAL");
});

test("returns bilingual field errors for invalid input", () => {
  const formData = validForm();
  formData.set("locale", "en");
  formData.set("email", "invalid");
  formData.set("message", "short");
  formData.delete("consent");

  const result = validateContactForm(formData);
  assert.equal(result.success, false);
  if (result.success) return;
  assert.match(result.errors?.email ?? "", /valid email/i);
  assert.match(result.errors?.message ?? "", /20 to 2,000/i);
  assert.match(result.errors?.consent ?? "", /required/i);
});

test("identifies the honeypot without processing other fields", () => {
  const formData = validForm();
  formData.set("website", "https://spam.example");
  const result = validateContactForm(formData);
  assert.equal(result.success, false);
  if (result.success) return;
  assert.equal(result.isBot, true);
});

test("sets a one-day cleanup buffer before the 12-month retention limit", () => {
  const createdAt = new Date("2026-08-21T00:00:00.000Z");
  assert.equal(getContactExpiryDate(createdAt).toISOString(), "2027-08-20T00:00:00.000Z");
});

function validSettingsForm() {
  const formData = new FormData();
  formData.set("autoEmailEnabled", "false");
  formData.append("showEmail", "false");
  formData.append("showEmail", "true");
  formData.set("publicEmail", "INFO@AFANA.ID");
  formData.set("senderName", "Afana Contact");
  formData.set("senderEmail", "noreply@yuksappstore.com");
  formData.set("phone", "081331096250");
  formData.set("showPhone", "true");
  formData.set("whatsapp", "+62 813 3109 6250");
  formData.set("showWhatsapp", "true");
  formData.set("location", "Banyuwangi");
  formData.set("showLocation", "true");
  return formData;
}

test("validates and normalizes editable Contact settings", () => {
  const result = validateContactSettingsForm(validSettingsForm());
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.autoEmailEnabled, false);
  assert.equal(result.data.showEmail, true);
  assert.equal(result.data.publicEmail, "info@afana.id");
});

test("rejects an invalid Resend sender", () => {
  const formData = validSettingsForm();
  formData.set("senderName", "Bad <Sender>");
  formData.set("senderEmail", "invalid");
  const result = validateContactSettingsForm(formData);
  assert.equal(result.success, false);
  if (result.success) return;
  assert.ok(result.errors.senderName);
  assert.ok(result.errors.senderEmail);
});

test("builds international phone and WhatsApp links", () => {
  assert.equal(phoneHref("0813 3109 6250"), "tel:+6281331096250");
  assert.equal(whatsappHref("+62 813 3109 6250"), "https://wa.me/6281331096250");
});
