import test from "node:test";
import assert from "node:assert/strict";
import { filtrarRoupas, filtrarVestidos } from "./filtro-produtos";
import { Produto } from "../services/api";

const PRODUTOS_TESTE: Produto[] = [
  {
    id: 1,
    nome: "Blazer Estruturado",
    descricao: "Blazer alfaiataria",
    valor: 300,
    imagem: ["000011"],
    tamanhos: [40, 42],
  },
  {
    id: 2,
    nome: "Calça de Alfaiataria",
    descricao: "Calça reta",
    valor: 459,
    imagem: ["000021"],
    tamanhos: [40],
  },
  {
    id: 3,
    nome: "Camisa de Seda",
    descricao: "Camisa fluida",
    valor: 250,
    imagem: ["000031"],
    tamanhos: [38, 40],
  },
  {
    id: 4,
    nome: "Vestido Midi Floral",
    descricao: "Vestido elegante",
    valor: 499,
    imagem: ["000041"],
    tamanhos: [40, 42],
  },
  {
    id: 5,
    nome: "VESTIDO LONGO FESTA",
    descricao: "Vestido para noite",
    valor: 650,
    imagem: ["000042"],
    tamanhos: [42],
  },
  {
    id: 6,
    nome: "Mini vestido de linho",
    descricao: "Vestido casual",
    valor: 320,
    imagem: ["000043"],
    tamanhos: [38],
  },
];

test("filtrarRoupas exclui todos os vestidos e mantém outras peças de roupa", () => {
  const roupas = filtrarRoupas(PRODUTOS_TESTE);

  assert.equal(roupas.length, 3);
  assert.deepEqual(
    roupas.map((p) => p.nome),
    ["Blazer Estruturado", "Calça de Alfaiataria", "Camisa de Seda"]
  );
  assert.ok(roupas.every((p) => !p.nome.toLowerCase().includes("vestido")));
});

test("filtrarVestidos retorna apenas itens que contenham 'vestido' independente de maiúsculas/minúsculas", () => {
  const vestidos = filtrarVestidos(PRODUTOS_TESTE);

  assert.equal(vestidos.length, 3);
  assert.deepEqual(
    vestidos.map((p) => p.nome),
    ["Vestido Midi Floral", "VESTIDO LONGO FESTA", "Mini vestido de linho"]
  );
  assert.ok(vestidos.every((p) => p.nome.toLowerCase().includes("vestido")));
});

test("filtrarRoupas e filtrarVestidos lidam corretamente com listas vazias", () => {
  assert.deepEqual(filtrarRoupas([]), []);
  assert.deepEqual(filtrarVestidos([]), []);
});
