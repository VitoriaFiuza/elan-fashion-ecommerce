"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function Sacola() {
const {
  produtos,
  aumentarQuantidade,
  diminuirQuantidade,
  removerProduto,
} = useCart();
  const total = produtos.reduce(
    (soma, produto) => soma + produto.preco * produto.quantidade,
    0
  );

  return (
    <main className="min-h-screen bg-white px-8 py-10">
      <Link href="/" className="text-2xl font-semibold">
        ÉLAN
      </Link>

      <h1 className="mt-12 mb-8 text-3xl font-medium">
        Minha sacola
      </h1>

      {produtos.length === 0 ? (
        <div>
          <p className="mb-6 text-neutral-600">
            Sua sacola está vazia.
          </p>

          <Link href="/" className="underline">
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <section className="space-y-8">
            {produtos.map((produto) => (
              <div
                key={`${produto.id}-${produto.tamanho}`}
                className="flex gap-6 border-b border-neutral-200 pb-8"
              >
                <Image
                  src={produto.imagem}
                  alt={produto.nome}
                  width={140}
                  height={180}
                  className="object-cover"
                />

                <div>
                  <h2 className="text-lg">{produto.nome}</h2>
                  <p className="mt-2 text-sm text-neutral-600">
                    Tamanho: {produto.tamanho}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
  <span className="text-sm text-neutral-600">
    Quantidade:
  </span>

  <div className="flex items-center border border-neutral-300">
    <button
      type="button"
      onClick={() =>
        diminuirQuantidade(produto.id, produto.tamanho)
      }
      disabled={produto.quantidade <= 1}
      className="px-3 py-2 disabled:opacity-30"
    >
      −
    </button>

    <span className="px-3 text-sm">
      {produto.quantidade}
    </span>

    <button
      type="button"
      onClick={() =>
        aumentarQuantidade(produto.id, produto.tamanho)
      }
      className="px-3 py-2"
    >
      +
    </button>
  </div>
  <button
  type="button"
  onClick={() => removerProduto(produto.id, produto.tamanho)}
  className="mt-3 text-sm text-neutral-500 underline hover:text-black"
>
  Remover
</button>
</div>
                  <p className="mt-4">
                    R$ {(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <aside className="h-fit border border-neutral-200 p-6">
            <h2 className="mb-6 text-xl">Resumo do pedido</h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              Frete calculado na finalização da compra.
            </p>

            <button
              type="button"
              className="mt-8 w-full bg-black py-4 text-sm uppercase tracking-widest text-white"
            >
              Finalizar compra
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}