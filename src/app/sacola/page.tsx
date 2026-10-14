
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
    (soma, produto) =>
      soma + produto.preco * produto.quantidade,
    0
  );

  const quantidadeTotal = produtos.reduce(
    (soma, produto) => soma + produto.quantidade,
    0
  );

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* CABEÇALHO */}
      <header className="border-b border-neutral-200 px-4 py-5 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight"
          >
            ÉLAN
          </Link>

          <Link
            href="/"
            className="text-xs text-neutral-600 transition hover:text-black sm:text-sm"
          >
            Continuar comprando
          </Link>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mb-8 border-b border-neutral-200 pb-6 md:mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
            ÉLAN
          </p>

          <h1 className="text-2xl font-medium sm:text-3xl">
            Minha sacola
          </h1>

          {quantidadeTotal > 0 && (
            <p className="mt-3 text-sm text-neutral-500">
              {quantidadeTotal}{" "}
              {quantidadeTotal === 1 ? "peça" : "peças"} na sua sacola
            </p>
          )}
        </div>

        {produtos.length === 0 ? (
          /* SACOLA VAZIA */
          <section className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">
              Sua sacola está vazia.
            </p>

            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
              Explore a coleção ÉLAN e descubra peças
              atemporais para compor seu estilo.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block bg-black px-8 py-4 text-sm uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800"
            >
              Explorar coleção
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:gap-12">
            {/* LISTA DE PRODUTOS */}
            <section className="min-w-0">
              {produtos.map((produto) => (
                <article
                  key={`${produto.id}-${produto.tamanho}`}
                  className="flex gap-4 border-b border-neutral-200 py-6 first:pt-0 sm:gap-6"
                >
                  {/* FOTO DO PRODUTO */}
                  <div className="w-28 shrink-0 sm:w-36 md:w-40">
                    <Image
                      src={produto.imagem}
                      alt={produto.nome}
                      width={320}
                      height={400}
                      className="h-auto w-full bg-neutral-100 object-cover"
                    />
                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="text-sm font-medium leading-6 sm:text-lg">
                      {produto.nome}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                      Tamanho: {produto.tamanho}
                    </p>

                    <p className="mt-3 text-sm font-medium sm:text-base">
                      {formatarPreco(
                        produto.preco * produto.quantidade
                      )}
                    </p>

                    {/* QUANTIDADE */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-neutral-500">
                        Quantidade
                      </p>

                      <div className="inline-flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() =>
                            diminuirQuantidade(
                              produto.id,
                              produto.tamanho
                            )
                          }
                          disabled={produto.quantidade <= 1}
                          aria-label={`Diminuir quantidade de ${produto.nome}`}
                          className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="flex h-10 min-w-9 items-center justify-center text-sm">
                          {produto.quantidade}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            aumentarQuantidade(
                              produto.id,
                              produto.tamanho
                            )
                          }
                          aria-label={`Aumentar quantidade de ${produto.nome}`}
                          className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* REMOVER */}
                    <button
                      type="button"
                      onClick={() =>
                        removerProduto(
                          produto.id,
                          produto.tamanho
                        )
                      }
                      className="mt-4 self-start text-xs text-neutral-500 underline underline-offset-4 transition hover:text-black sm:text-sm"
                    >
                      Remover produto
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {/* RESUMO DO PEDIDO */}
            <aside className="border border-neutral-200 p-5 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-medium">
                Resumo do pedido
              </h2>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-600">
                  Subtotal ({quantidadeTotal}{" "}
                  {quantidadeTotal === 1 ? "peça" : "peças"})
                </span>

                <span>{formatarPreco(total)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-600">
                  Frete
                </span>

                <span className="text-xs text-neutral-500">
                  A calcular
                </span>
              </div>

              <div className="mt-6 border-t border-neutral-200 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">
                    Subtotal
                  </span>

                  <span className="text-lg font-medium">
                    {formatarPreco(total)}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  O valor do frete será calculado na
                  finalização da compra.
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-8 block w-full bg-black px-4 py-5 text-center text-sm uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800"
              >
                Finalizar compra
              </Link>

              <Link
                href="/"
                className="mt-5 block text-center text-sm text-neutral-600 underline underline-offset-4 hover:text-black"
              >
                Continuar comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
