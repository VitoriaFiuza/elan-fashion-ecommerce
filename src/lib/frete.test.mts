import test from "node:test";
import assert from "node:assert/strict";
import {
  limparCep,
  formatarCep,
  calcularOpcoesFrete,
  obterRegiaoPorUf,
  VALOR_MINIMO_FRETE_GRATIS,
} from "./frete";

test("limparCep higieniza pontos, traços e espaços, limitando a 8 dígitos", () => {
  assert.equal(limparCep("01310-100"), "01310100");
  assert.equal(limparCep(" 01.310-100 "), "01310100");
  assert.equal(limparCep("013101009999"), "01310100");
  assert.equal(limparCep(""), "");
});

test("formatarCep adiciona hífen após 5 dígitos", () => {
  assert.equal(formatarCep("01310100"), "01310-100");
  assert.equal(formatarCep("01310"), "01310");
  assert.equal(formatarCep("013"), "013");
  assert.equal(formatarCep(""), "");
});

test("obterRegiaoPorUf mapeia corretamente os estados", () => {
  assert.equal(obterRegiaoPorUf("SP").nome, "Sudeste");
  assert.equal(obterRegiaoPorUf("sp").nome, "Sudeste");
  assert.equal(obterRegiaoPorUf("RS").nome, "Sul");
  assert.equal(obterRegiaoPorUf("DF").nome, "Centro-Oeste");
  assert.equal(obterRegiaoPorUf("BA").nome, "Nordeste");
  assert.equal(obterRegiaoPorUf("AM").nome, "Norte");
  assert.equal(obterRegiaoPorUf("XX").nome, "Brasil");
});

test("calcularOpcoesFrete calcula opções padrão para subtotal abaixo de R$ 400", () => {
  const opcoesSP = calcularOpcoesFrete("SP", 250);
  assert.equal(opcoesSP.length, 2);

  const normal = opcoesSP.find((o) => o.id === "normal");
  const expresso = opcoesSP.find((o) => o.id === "expresso");

  assert.ok(normal && expresso);
  assert.equal(normal.valor, 19.9);
  assert.equal(normal.gratis, false);
  assert.equal(normal.prazoMinDias, 3);
  assert.equal(normal.prazoMaxDias, 5);

  assert.equal(expresso.valor, 34.9);
  assert.equal(expresso.gratis, false);
});

test("calcularOpcoesFrete concede frete grátis na opção Normal para subtotal >= R$ 400", () => {
  const opcoesSP = calcularOpcoesFrete("SP", VALOR_MINIMO_FRETE_GRATIS);
  const normal = opcoesSP.find((o) => o.id === "normal");
  const expresso = opcoesSP.find((o) => o.id === "expresso");

  assert.ok(normal && expresso);
  assert.equal(normal.valor, 0);
  assert.equal(normal.gratis, true);
  // Expresso continua com cobrança
  assert.equal(expresso.valor, 34.9);
  assert.equal(expresso.gratis, false);
});

test("calcularOpcoesFrete diferencia prazos e valores por região", () => {
  const opcoesSul = calcularOpcoesFrete("RS", 200);
  const normalSul = opcoesSul.find((o) => o.id === "normal");
  assert.equal(normalSul?.valor, 24.9);

  const opcoesNorte = calcularOpcoesFrete("AM", 200);
  const normalNorte = opcoesNorte.find((o) => o.id === "normal");
  assert.equal(normalNorte?.valor, 44.9);
});
