"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ProdutoSacola = {
  id: string;
  nome: string;
  tamanho: string;
  preco: number;
  imagem: string;
  quantidade: number;
};

type CartContextType = {
  produtos: ProdutoSacola[];
  adicionarProduto: (produto: ProdutoSacola) => void;
  aumentarQuantidade: (id: string, tamanho: string) => void;
  diminuirQuantidade: (id: string, tamanho: string) => void;
  removerProduto: (id: string, tamanho: string) => void;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<ProdutoSacola[]>([]);

  function adicionarProduto(produto: ProdutoSacola) {
    setProdutos((anteriores) => {
      const existente = anteriores.find(
        (item) =>
          item.id === produto.id && item.tamanho === produto.tamanho
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
    });
  }
function aumentarQuantidade(id: string, tamanho: string) {
  setProdutos((anteriores) =>
    anteriores.map((item) =>
      item.id === id && item.tamanho === tamanho
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    )
  );
}

function diminuirQuantidade(id: string, tamanho: string) {
  setProdutos((anteriores) =>
    anteriores.map((item) =>
      item.id === id && item.tamanho === tamanho
        ? { ...item, quantidade: Math.max(1, item.quantidade - 1) }
        : item
    )
  );
}

function removerProduto(id: string, tamanho: string) {
  setProdutos((anteriores) =>
    anteriores.filter(
      (item) => !(item.id === id && item.tamanho === tamanho)
    )
  );
}
  return (
<CartContext.Provider
  value={{
    produtos,
    adicionarProduto,
    aumentarQuantidade,
    diminuirQuantidade,
    removerProduto,
  }}
>      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}