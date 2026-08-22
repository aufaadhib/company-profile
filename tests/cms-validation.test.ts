import assert from "node:assert/strict";
import test from "node:test";

import { cmsRoles } from "../lib/auth-permissions.ts";
import { validateMediaDraftForm, validateRevisionForPublication } from "../lib/cms-validation.ts";

function validForm() {
  const form = new FormData();
  form.set("slug", "artikel-kelistrikan-afana");
  form.set("assetId", "dbbf6ba5-51fd-4f32-8837-66cddcc8de72");
  form.set("lockVersion", "0");
  form.set("category", "insight");
  form.set("publishedAt", "2026-08-21");
  form.set("idTitle", "Fondasi kelistrikan yang lebih andal");
  form.set("idExcerpt", "Ringkasan artikel kelistrikan Afana yang telah memenuhi batas minimum.");
  form.set("idImageAlt", "Teknisi memeriksa panel kelistrikan");
  form.set("idBody", JSON.stringify(["Paragraf artikel Indonesia."]));
  form.set("enTitle", "A more reliable electrical foundation");
  form.set("enExcerpt", "A concise Afana electrical article summary that meets the minimum limit.");
  form.set("enImageAlt", "Technician inspecting an electrical panel");
  form.set("enBody", JSON.stringify(["English article paragraph."]));
  return form;
}

test("accepts a complete bilingual media draft", () => {
  const result = validateMediaDraftForm(validForm());
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.payload.translations.id.body.length, 1);
  assert.deepEqual(validateRevisionForPublication(result.data.payload, result.data.assetId), {});
});

test("allows incomplete copy to be saved as draft", () => {
  const form = validForm();
  form.set("enTitle", "");
  form.set("enExcerpt", "");
  form.set("enImageAlt", "");
  form.set("enBody", "[]");
  const result = validateMediaDraftForm(form);
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.ok(Object.keys(validateRevisionForPublication(result.data.payload, result.data.assetId)).length >= 4);
});

test("rejects invalid slug and malformed metadata", () => {
  const form = validForm();
  form.set("slug", "Slug Tidak Valid");
  form.set("publishedAt", "21-08-2026");
  form.set("assetId", "not-a-uuid");
  const result = validateMediaDraftForm(form);
  assert.equal(result.success, false);
  if (result.success) return;
  assert.ok(result.errors.slug);
  assert.ok(result.errors.publishedAt);
  assert.ok(result.errors.assetId);
});

test("rejects paragraph payloads beyond the limit", () => {
  const form = validForm();
  form.set("idBody", JSON.stringify(Array.from({ length: 51 }, (_, index) => `Paragraf ${index}`)));
  const result = validateMediaDraftForm(form);
  assert.equal(result.success, false);
  if (result.success) return;
  assert.ok(result.errors["id.body"]);
});

test("keeps account administration restricted to the owner role", () => {
  assert.equal(cmsRoles.admin.authorize({ user: ["create", "ban"] }).success, true);
  assert.equal(cmsRoles.editor.authorize({ user: ["create"] }).success, false);
  assert.equal(cmsRoles.admin.authorize({ user: ["set-role"] }).success, false);
  assert.equal(cmsRoles.admin.authorize({ user: ["delete"] }).success, false);
});
