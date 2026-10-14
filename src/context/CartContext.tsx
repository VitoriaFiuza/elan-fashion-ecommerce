
"use client";

import {
  createContext,
  useContext,
  useEffect,
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
  quantidadeTotal: number;
  adicionarProduto: (produto: ProdutoSacola) => void;
  aumentarQuantidade: (id: string, tamanho: string) => void;
  diminuirQuantidade: (id: string, tamanho: string) => void;
  removerProduto: (id: string, tamanho: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [produtos, setProdutos] = useState<ProdutoSacola[]>([]);
  const [carregado, setCarregado] = useState(false);

  // QUANTIDADE TOTAL DE PEÇAS NA SACOLA
  const quantidadeTotal = produtos.reduce(
    (total, produto) => total + produto.quantidade,
    0
  );

  // CARREGAR PRODUTOS SALVOS
  useEffect(() => {
    try {
      const salvos = localStorage.getItem("elan-sacola");

      if (salvos) {
        setProdutos(JSON.parse(salvos));
      }
    } catch (erro) {
      console.error("Erro ao carregar a sacola:", erro);
    } finally {
      setCarregado(true);
    }
  }, []);

  // SALVAR PRODUTOS AUTOMATICAMENTE
  useEffect(() => {
    if (carregado) {
      localStorage.setItem(
        "elan-sacola",
        JSON.stringify(produtos)
      );
    }
  }, [produtos, carregado]);

  // ADICIONAR PRODUTO À SACOLA
  function adicionarProduto(produto: ProdutoSacola) {
    setProdutos((anteriores) => {
      const existente = anteriores.find(
        (item) =>
          item.id === produto.id &&
          item.tamanho === produto.tamanho
      );

      if (existente) {
        return anteriores.map((item) =>
          item.id === produto.id &&
          item.tamanho === produto.tamanho
            ? {
                ...item,
                quantidade:
                  item.quantidade + produto.quantidade,
              }
            : item
        );
      }

      return [...anteriores, produto];
    });
  }

  // AUMENTAR QUANTIDADE
  function aumentarQuantidade(
    id: string,
    tamanho: string
  ) {
    setProdutos((anteriores) =>
      anteriores.map((item) =>
        item.id === id && item.tamanho === tamanho
          ? {
              ...item,
              quantidade: item.quantidade + 1,
            }
          : item
      )
    );
  }

  // DIMINUIR QUANTIDADE
  function diminuirQuantidade(
    id: string,
    tamanho: string
  ) {
    setProdutos((anteriores) =>
      anteriores.map((item) =>
        item.id === id && item.tamanho === tamanho
          ? {
              ...item,
              quantidade: Math.max(
                1,
                item.quantidade - 1
              ),
            }
          : item
      )
    );
  }

  // REMOVER PRODUTO
  function removerProduto(
    id: string,
    tamanho: string
  ) {
    setProdutos((anteriores) =>
      anteriores.filter(
        (item) =>
          !(
            item.id === id &&
            item.tamanho === tamanho
          )
      )
    );
  }

  return (
    <CartContext.Provider
      value={{
        produtos,
        quantidadeTotal,
        adicionarProduto,
        aumentarQuantidade,
        diminuirQuantidade,
        removerProduto,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ACESSAR A SACOLA EM QUALQUER PÁGINA
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart deve ser usado dentro de CartProvider"
    );
  }

  return context;
}
