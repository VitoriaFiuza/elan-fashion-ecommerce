import assert from "node:assert/strict";
import test from "node:test";
import { resolverBaseApi, urlCatalogo } from "./api";

test("sem variável de ambiente a base é /api", () => {
  assert.equal(resolverBaseApi(undefined), "/api");
  assert.equal(resolverBaseApi(""), "/api");
  assert.equal(resolverBaseApi("   "), "/api");
});

test("NEXT_PUBLIC_API_URL continua como escape e perde barra final", () => {
  assert.equal(resolverBaseApi("http://localhost:5000"), "http://localhost:5000");
  assert.equal(resolverBaseApi("http://localhost:5000/"), "http://localhost:5000");
  assert.equal(resolverBaseApi("https://api.exemplo.com///"), "https://api.exemplo.com");
});

test("monta a lista e o item na mesma origem", () => {
  assert.equal(urlCatalogo(undefined, "/api"), "/api/produtos");
  assert.equal(urlCatalogo(1, "/api"), "/api/produtos/1");
  assert.equal(urlCatalogo("2", "http://localhost:5000"), "http://localhost:5000/produtos/2");
});
