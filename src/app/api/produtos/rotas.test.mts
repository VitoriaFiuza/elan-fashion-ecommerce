import assert from "node:assert/strict";
import test from "node:test";
import { GET as listar } from "./route";
import { GET as obter } from "./[id]/route";

test("GET /api/produtos devolve a lista do arquivo real", async () => {
  const resposta = await listar();
  assert.equal(resposta.status, 200);
  const corpo = await resposta.json();
  assert.ok(Array.isArray(corpo));
  assert.ok(corpo.length >= 1);
  assert.equal(String(corpo[0].id), "1");
});

test("GET /api/produtos/1 devolve o produto e id ausente devolve 404", async () => {
  const encontrado = await obter(new Request("http://localhost/api/produtos/1"), {
    params: Promise.resolve({ id: "1" }),
  });
  assert.equal(encontrado.status, 200);
  const produto = await encontrado.json();
  assert.equal(String(produto.id), "1");
  assert.equal(typeof produto.nome, "string");

  const ausente = await obter(new Request("http://localhost/api/produtos/999"), {
    params: Promise.resolve({ id: "999" }),
  });
  assert.equal(ausente.status, 404);
  assert.deepEqual(await ausente.json(), { erro: "Produto não encontrado" });
});
