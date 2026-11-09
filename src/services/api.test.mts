import assert from "node:assert/strict";
import test from "node:test";
import { resolverBaseApi, urlCatalogo, ordenarImagensProduto, normalizarProduto } from "./api";

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

test("ordenarImagensProduto ordena imagens alfanumericamente em ordem crescente", () => {
  const desordenadas = ["000013", "000011", "000012"];
  assert.deepEqual(ordenarImagensProduto(desordenadas), ["000011", "000012", "000013"]);
});

test("normalizarProduto garante imagens ordenadas em ordem crescente", () => {
  const produto = normalizarProduto({
    id: 1,
    nome: "Teste",
    imagem: ["000013.png", "000011.png", "000012.png"],
  });
  assert.deepEqual(produto.imagem, ["000011.png", "000012.png", "000013.png"]);
});