import { readFileSync } from "node:fs";
import path from "node:path";

export interface ProdutoCatalogo {
  id: number | string;
  nome?: string;
  descricao?: string;
  valor?: number;
  imagem?: string[] | string;
  tamanhos?: Array<string | number> | string;
  [campo: string]: unknown;
}

export function caminhoPadraoCatalogo(): string {
  return path.join(process.cwd(), "backend", "produtos.json");
}

/**
 * Lê o catálogo em disco. Arquivo ausente, JSON inválido ou conteúdo
 * que não seja uma lista viram lista vazia — a loja segue no ar.
 */
export function lerCatalogo(arquivo = caminhoPadraoCatalogo()): ProdutoCatalogo[] {
  try {
    const bruto = readFileSync(arquivo, "utf-8");
    const dados: unknown = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados as ProdutoCatalogo[];
  } catch {
    return [];
  }
}

export function buscarProduto(
  id: number | string,
  produtos: ProdutoCatalogo[] = lerCatalogo()
): ProdutoCatalogo | null {
  const alvo = String(id);
  return produtos.find((produto) => String(produto?.id) === alvo) ?? null;
}

export function respostaLista(produtos: ProdutoCatalogo[] = lerCatalogo()): Response {
  return Response.json(produtos);
}

export function respostaItem(
  id: number | string,
  produtos: ProdutoCatalogo[] = lerCatalogo()
): Response {
  const { status, body } = responderProduto(id, produtos);
  return Response.json(body, { status });
}

export function responderProduto(
  id: number | string,
  produtos: ProdutoCatalogo[] = lerCatalogo()
): {
  status: 200 | 404;
  body: ProdutoCatalogo | { erro: string };
} {
  const produto = buscarProduto(id, produtos);
  if (!produto) {
    return { status: 404, body: { erro: "Produto não encontrado" } };
  }
  return { status: 200, body: produto };
}
