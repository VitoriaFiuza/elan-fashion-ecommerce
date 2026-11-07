import assert from "node:assert/strict";
import test from "node:test";

interface ProdutoSacola {
  id: string;
  nome: string;
  tamanho: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

// Lógica de manipulação de sacola conforme implementada no CartContext
function adicionarProduto(
  anteriores: ProdutoSacola[],
  produto: ProdutoSacola
): ProdutoSacola[] {
  const existente = anteriores.find(
    (item) => item.id === produto.id && item.tamanho === produto.tamanho
  );

  if (existente) {
    return anteriores.map((item) =>
      item.id === produto.id && item.tamanho === produto.tamanho
        ? {
            ...item,
            quantidade: item.quantidade + produto.quantidade,
          }
        : item
    );
  }

  return [...anteriores, produto];
}

function aumentarQuantidade(
  anteriores: ProdutoSacola[],
  id: string,
  tamanho: string
): ProdutoSacola[] {
  return anteriores.map((item) =>
    item.id === id && item.tamanho === tamanho
      ? {
          ...item,
          quantidade: item.quantidade + 1,
        }
      : item
  );
}

function diminuirQuantidade(
  anteriores: ProdutoSacola[],
  id: string,
  tamanho: string
): ProdutoSacola[] {
  return anteriores.map((item) =>
    item.id === id && item.tamanho === tamanho
      ? {
          ...item,
          quantidade: Math.max(1, item.quantidade - 1),
        }
      : item
  );
}

function removerProduto(
  anteriores: ProdutoSacola[],
  id: string,
  tamanho: string
): ProdutoSacola[] {
  return anteriores.filter(
    (item) => !(item.id === id && item.tamanho === tamanho)
  );
}

function calcularQuantidadeTotal(produtos: ProdutoSacola[]): number {
  return produtos.reduce((total, item) => total + item.quantidade, 0);
}

function calcularSubtotal(produtos: ProdutoSacola[]): number {
  return produtos.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

test("adiciona novo produto na sacola e calcula totais corretamente", () => {
  let sacola: ProdutoSacola[] = [];

  const item1: ProdutoSacola = {
    id: "1",
    nome: "Blazer Estruturado",
    tamanho: "42",
    preco: 300,
    imagem: "/products/000011.png",
    quantidade: 1,
  };

  sacola = adicionarProduto(sacola, item1);
  assert.equal(sacola.length, 1);
  assert.equal(calcularQuantidadeTotal(sacola), 1);
  assert.equal(calcularSubtotal(sacola), 300);

  // Adicionando mesmo produto e mesmo tamanho incrementa quantidade
  sacola = adicionarProduto(sacola, item1);
  assert.equal(sacola.length, 1);
  assert.equal(sacola[0].quantidade, 2);
  assert.equal(calcularQuantidadeTotal(sacola), 2);
  assert.equal(calcularSubtotal(sacola), 600);
});

test("mesmo produto com tamanhos diferentes cria entradas distintas", () => {
  let sacola: ProdutoSacola[] = [
    {
      id: "1",
      nome: "Blazer Estruturado",
      tamanho: "40",
      preco: 300,
      imagem: "/products/000011.png",
      quantidade: 1,
    },
  ];

  const itemTam42: ProdutoSacola = {
    id: "1",
    nome: "Blazer Estruturado",
    tamanho: "42",
    preco: 300,
    imagem: "/products/000011.png",
    quantidade: 1,
  };

  sacola = adicionarProduto(sacola, itemTam42);
  assert.equal(sacola.length, 2);
  assert.equal(calcularQuantidadeTotal(sacola), 2);
  assert.equal(calcularSubtotal(sacola), 600);
});

test("aumentar, diminuir e remover itens atualiza corretamente a sacola", () => {
  let sacola: ProdutoSacola[] = [
    {
      id: "2",
      nome: "Calça de Alfaiataria",
      tamanho: "44",
      preco: 459,
      imagem: "/products/000021.png",
      quantidade: 2,
    },
  ];

  // Aumentar
  sacola = aumentarQuantidade(sacola, "2", "44");
  assert.equal(sacola[0].quantidade, 3);
  assert.equal(calcularSubtotal(sacola), 459 * 3);

  // Diminuir
  sacola = diminuirQuantidade(sacola, "2", "44");
  assert.equal(sacola[0].quantidade, 2);

  // Diminuir além de 1 não permite zero
  sacola = diminuirQuantidade(sacola, "2", "44");
  sacola = diminuirQuantidade(sacola, "2", "44");
  assert.equal(sacola[0].quantidade, 1);

  // Remover
  sacola = removerProduto(sacola, "2", "44");
  assert.equal(sacola.length, 0);
  assert.equal(calcularQuantidadeTotal(sacola), 0);
  assert.equal(calcularSubtotal(sacola), 0);
});
