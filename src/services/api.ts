export interface Produto {
  id: number | string;
  nome: string;
  descricao: string;
  valor: number;
  imagem: string[];
  tamanhos: Array<string | number>;
}

/**
 * Base do catálogo. Sem NEXT_PUBLIC_API_URL, as chamadas ficam na mesma origem (`/api`).
 * A variável continua como escape se a API voltar a ser externa.
 */
export function resolverBaseApi(valor = process.env.NEXT_PUBLIC_API_URL): string {
  const base = valor?.trim();
  if (!base) return "/api";
  return base.replace(/\/+$/, "");
}

export const API_BASE_URL = resolverBaseApi();

export function urlCatalogo(id?: number | string, base = API_BASE_URL): string {
  if (id === undefined) return `${base}/produtos`;
  return `${base}/produtos/${encodeURIComponent(String(id))}`;
}

/**
 * Converte o identificador da imagem para a rota pública correta em /products.
 * Exemplo: "000011" -> "/products/000011.png"
 */
export function getProductImageUrl(imgName?: string): string {
  if (!imgName) {
    return "/products/000011.png";
  }

  // Se já for uma URL completa ou já começar com '/', mantém
  if (
    imgName.startsWith("http://") ||
    imgName.startsWith("https://") ||
    imgName.startsWith("/")
  ) {
    return imgName;
  }

  // Se já tiver extensão, anexa o caminho
  if (imgName.includes(".")) {
    return `/products/${imgName}`;
  }

  // Caso padrão: adiciona a extensão .png
  return `/products/${imgName}.png`;
}

/**
 * Formata um número para moeda Real (BRL).
 */
export function formatarPreco(valor: number): string {
  if (typeof valor !== "number" || isNaN(valor)) {
    return "R$ 0,00";
  }
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Busca um produto específico pelo ID (GET /produtos/:id).
 */
export async function obterProdutoPorId(
  id: number | string
): Promise<Produto | null> {
  try {
    const res = await fetch(urlCatalogo(id), {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Produto ID ${id} não encontrado ou backend fora do ar (Status: ${res.status}).`);
      return null;
    }

    const dados = await res.json();
    return normalizarProduto(dados);
  } catch (erro) {
    console.error(`Erro ao buscar produto ${id} do backend:`, erro);
    return null;
  }
}

/**
 * Busca todos os produtos do catálogo (GET /produtos).
 */
export async function listarProdutos(): Promise<Produto[]> {
  try {
    const res = await fetch(urlCatalogo(), {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const dados = await res.json();
    if (!Array.isArray(dados)) return [];
    return dados.map(normalizarProduto);
  } catch (erro) {
    console.error("Erro ao listar produtos do backend:", erro);
    return [];
  }
}

/**
 * Garante que a estrutura do produto do backend venha no formato esperado pelo frontend.
 */
function normalizarProduto(item: Record<string, unknown>): Produto {
  let imagens: string[] = [];

  if (Array.isArray(item.imagem)) {
    imagens = item.imagem.map(String);
  } else if (typeof item.imagem === "string") {
    imagens = item.imagem
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  // Trata o campo tamanhos (pode vir como 'tamanhos' ou 'tamanho', array ou string)
  const rawTamanhos = item.tamanhos ?? item.tamanho ?? [];
  let tamanhos: Array<string | number> = [];

  if (Array.isArray(rawTamanhos)) {
    tamanhos = rawTamanhos;
  } else if (typeof rawTamanhos === "string") {
    tamanhos = rawTamanhos
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  return {
    id: (item.id as string | number) ?? "",
    nome: typeof item.nome === "string" ? item.nome : "Produto sem nome",
    descricao: typeof item.descricao === "string" ? item.descricao : "",
    valor: Number(item.valor) || 0,
    imagem: imagens,
    tamanhos: tamanhos,
  };
}
