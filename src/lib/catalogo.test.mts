import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buscarProduto, lerCatalogo, respostaItem, respostaLista, responderProduto } from "./catalogo";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function arquivoTemporario(conteudo: string): string {
  const pasta = mkdtempSync(path.join(tmpdir(), "elan-catalogo-"));
  const arquivo = path.join(pasta, "produtos.json");
  writeFileSync(arquivo, conteudo, "utf-8");
  return arquivo;
}

test("lê a lista do produtos.json do projeto", () => {
  const produtos = lerCatalogo(path.join(raiz, "backend", "produtos.json"));
  assert.ok(produtos.length >= 1);
  assert.equal(String(produtos[0].id), "1");
  assert.equal(typeof produtos[0].nome, "string");
});

test("arquivo ausente vira lista vazia", () => {
  const ausente = path.join(tmpdir(), "elan-catalogo-ausente", "produtos.json");
  assert.deepEqual(lerCatalogo(ausente), []);
});

test("JSON inválido vira lista vazia", () => {
  assert.deepEqual(lerCatalogo(arquivoTemporario("{")), []);
});

test("arquivo vazio vira lista vazia", () => {
  assert.deepEqual(lerCatalogo(arquivoTemporario("")), []);
});

test("conteúdo que não é lista vira lista vazia", () => {
  assert.deepEqual(lerCatalogo(arquivoTemporario('{"id":1}')), []);
});

test("lista vazia permanece vazia", () => {
  assert.deepEqual(lerCatalogo(arquivoTemporario("[]")), []);
});

test("busca produto pelo id numérico ou textual", () => {
  const arquivo = arquivoTemporario(
    JSON.stringify([
      { id: 2, nome: "Calça", descricao: "Alfaiataria", valor: 459, imagem: [], tamanhos: [40] },
    ])
  );
  const produtos = lerCatalogo(arquivo);
  assert.equal(buscarProduto(2, produtos)?.nome, "Calça");
  assert.equal(buscarProduto("2", produtos)?.nome, "Calça");
  assert.equal(buscarProduto("9", produtos), null);
});

test("produto inexistente responde 404 no formato do catálogo", () => {
  const produtos = lerCatalogo(arquivoTemporario("[]"));
  const resposta = responderProduto("1", produtos);
  assert.equal(resposta.status, 404);
  assert.deepEqual(resposta.body, { erro: "Produto não encontrado" });
});

test("GET da lista e do item usam o catálogo real", async () => {
  const lista = await respostaLista().json();
  assert.ok(Array.isArray(lista));
  assert.equal(String(lista[0].id), "1");

  const item = respostaItem("1");
  assert.equal(item.status, 200);
  assert.equal(String((await item.json()).id), "1");

  const ausente = respostaItem("999", []);
  assert.equal(ausente.status, 404);
  assert.deepEqual(await ausente.json(), { erro: "Produto não encontrado" });
});

test("produto existente responde 200 com o item", () => {
  const produtos = lerCatalogo(
    arquivoTemporario(
      JSON.stringify([
        { id: 1, nome: "Blazer", descricao: "Estruturado", valor: 699.9, imagem: ["000011"], tamanhos: [40] },
      ])
    )
  );
  const resposta = responderProduto("1", produtos);
  assert.equal(resposta.status, 200);
  assert.equal("nome" in resposta.body && resposta.body.nome, "Blazer");
});
