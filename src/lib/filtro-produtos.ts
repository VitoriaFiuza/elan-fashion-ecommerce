import { Produto } from "../services/api";

/**
 * Retorna itens cujo nome NÃO contenha "vestido" (insensível a maiúsculas/minúsculas).
 */
export function filtrarRoupas(produtos: Produto[]): Produto[] {
  return produtos.filter(
    (p) => !p.nome.toLowerCase().includes("vestido")
  );
}

/**
 * Retorna itens cujo nome contenha "vestido" (insensível a maiúsculas/minúsculas).
 */
export function filtrarVestidos(produtos: Produto[]): Produto[] {
  return produtos.filter(
    (p) => p.nome.toLowerCase().includes("vestido")
  );
}
