"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "../../context/CartContext";
import {
  formatarCep,
  limparCep,
  calcularOpcoesFrete,
  type OpcaoFrete,
  VALOR_MINIMO_FRETE_GRATIS,
} from "../../lib/frete";

export default function Sacola() {
  const {
    produtos,
    aumentarQuantidade,
    diminuirQuantidade,
    removerProduto,
  } = useCart();

  const [cep, setCep] = useState("");
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");
  const [localidadeEntrega, setLocalidadeEntrega] = useState<string | null>(null);
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[]>([]);
  const [opcaoSelecionadaId, setOpcaoSelecionadaId] = useState<string | null>(null);
  const [mensagemIndisponivel, setMensagemIndisponivel] = useState("");

  const cepValido = limparCep(cep).length === 8 && opcoesFrete.length > 0 && !erroFrete;

  const subtotal = produtos.reduce(
    (soma, produto) =>
      soma + produto.preco * produto.quantidade,
    0
  );

  const quantidadeTotal = produtos.reduce(
    (soma, produto) => soma + produto.quantidade,
    0
  );

  // Recalcular valores de frete se o subtotal mudar e já tivermos opções
  const freteAtualizadoOpcoes = opcoesFrete.map((op) => {
    if (op.id === "normal") {
      const gratis = subtotal >= VALOR_MINIMO_FRETE_GRATIS;
      return {
        ...op,
        gratis,
        valor: gratis ? 0 : op.valor || 19.9,
      };
    }
    return op;
  });

  const opcaoSelecionada = freteAtualizadoOpcoes.find(
    (op) => op.id === opcaoSelecionadaId
  );

  const valorFrete = opcaoSelecionada ? opcaoSelecionada.valor : 0;
  const total = subtotal + valorFrete;

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleCepChange(valor: string) {
    const formatado = formatarCep(valor);
    setCep(formatado);
    setErroFrete("");
    setMensagemIndisponivel("");
    if (limparCep(valor).length !== 8) {
      setOpcoesFrete([]);
      setLocalidadeEntrega(null);
      setOpcaoSelecionadaId(null);
    }
  }

  function handleFinalizarCompra() {
    if (!cepValido) {
      return;
    }
    setMensagemIndisponivel(
      "estamos melhorando o site! Area de concluir compra ainda não esta disponivel"
    );
  }

  async function consultarFrete(e?: FormEvent) {
    if (e) {
      e.preventDefault();
    }

    const digitos = limparCep(cep);
    if (digitos.length !== 8) {
      setErroFrete("Informe um CEP válido com 8 dígitos.");
      return;
    }

    setCarregandoFrete(true);
    setErroFrete("");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${digitos}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Erro na consulta do CEP");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErroFrete("CEP não encontrado. Confira os números e tente novamente.");
        setOpcoesFrete([]);
        setLocalidadeEntrega(null);
        setOpcaoSelecionadaId(null);
        return;
      }

      const uf = dados.uf || "SP";
      const localidade = [dados.localidade, dados.uf]
        .filter(Boolean)
        .join(" - ");

      const opcoes = calcularOpcoesFrete(uf, subtotal);
      setOpcoesFrete(opcoes);
      setLocalidadeEntrega(localidade);

      // Seleciona a opção normal por padrão
      setOpcaoSelecionadaId("normal");
    } catch {
      // Fallback em caso de indisponibilidade externa: calcula com base no padrão nacional
      const opcoesFallback = calcularOpcoesFrete("BR", subtotal);
      setOpcoesFrete(opcoesFallback);
      setLocalidadeEntrega("Brasil");
      setOpcaoSelecionadaId("normal");
      setErroFrete(
        "Não foi possível obter endereço detalhado, calculamos pelo padrão regional."
      );
    } finally {
      setCarregandoFrete(false);
    }
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
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)] lg:gap-12">
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

            {/* RESUMO DO PEDIDO E CÁLCULO DE FRETE */}
            <aside className="border border-neutral-200 p-5 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-medium">
                Resumo do pedido
              </h2>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-600">
                  Subtotal ({quantidadeTotal}{" "}
                  {quantidadeTotal === 1 ? "peça" : "peças"})
                </span>

                <span className="font-medium">{formatarPreco(subtotal)}</span>
              </div>

              {/* CALCULAR FRETE */}
              <div className="mt-6 border-t border-neutral-200 pt-5">
                <label
                  htmlFor="cep-sacola"
                  className="block text-xs uppercase tracking-wider text-neutral-600 mb-2 font-medium"
                >
                  Calcular frete e prazo
                </label>

                <form
                  onSubmit={consultarFrete}
                  className="flex gap-2"
                >
                  <input
                    id="cep-sacola"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={carregandoFrete || limparCep(cep).length !== 8}
                    className="shrink-0 bg-neutral-900 px-4 py-2 text-xs uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {carregandoFrete ? "..." : "Calcular"}
                  </button>
                </form>

                {erroFrete && (
                  <p className="mt-2 text-xs text-red-600 leading-relaxed">
                    {erroFrete}
                  </p>
                )}

                {localidadeEntrega && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Entrega para: <span className="font-medium text-neutral-800">{localidadeEntrega}</span>
                  </p>
                )}

                {/* OPÇÕES DE FRETE CALCULADAS */}
                {freteAtualizadoOpcoes.length > 0 && (
                  <div className="mt-4 space-y-2 border border-neutral-200 p-3 bg-neutral-50/50">
                    <p className="text-xs font-medium text-neutral-700">
                      Selecione a opção de entrega:
                    </p>
                    {freteAtualizadoOpcoes.map((opcao) => {
                      const isSelected = opcaoSelecionadaId === opcao.id;
                      return (
                        <label
                          key={opcao.id}
                          className={`flex items-center justify-between p-2.5 border cursor-pointer transition text-xs ${
                            isSelected
                              ? "border-black bg-white shadow-xs"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="opcao-frete"
                              value={opcao.id}
                              checked={isSelected}
                              onChange={() => setOpcaoSelecionadaId(opcao.id)}
                              className="accent-black"
                            />
                            <div>
                              <p className="font-medium text-neutral-900">
                                {opcao.nome}
                              </p>
                              <p className="text-[11px] text-neutral-500">
                                {opcao.prazoMinDias} a {opcao.prazoMaxDias} dias úteis
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            {opcao.gratis ? (
                              <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px]">
                                Grátis
                              </span>
                            ) : (
                              <span className="font-medium text-neutral-900">
                                {formatarPreco(opcao.valor)}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* LINHA DO FRETE NO RESUMO */}
              <div className="mt-4 flex items-center justify-between gap-4 text-sm border-t border-neutral-100 pt-4">
                <span className="text-neutral-600">Frete</span>

                {opcaoSelecionada ? (
                  opcaoSelecionada.gratis ? (
                    <span className="text-xs font-semibold text-emerald-700 uppercase">
                      Grátis
                    </span>
                  ) : (
                    <span>{formatarPreco(opcaoSelecionada.valor)}</span>
                  )
                ) : (
                  <span className="text-xs text-neutral-500">
                    A calcular
                  </span>
                )}
              </div>

              {/* TOTAL FINAL */}
              <div className="mt-5 border-t border-neutral-200 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-base">
                    Total
                  </span>

                  <span className="text-xl font-medium">
                    {formatarPreco(total)}
                  </span>
                </div>

                {subtotal < VALOR_MINIMO_FRETE_GRATIS ? (
                  <p className="mt-3 text-xs leading-5 text-neutral-500">
                    Faltam {formatarPreco(VALOR_MINIMO_FRETE_GRATIS - subtotal)} para você garantir <strong className="text-neutral-800">Frete Grátis</strong> (Normal).
                  </p>
                ) : (
                  <p className="mt-3 text-xs leading-5 text-emerald-700 font-medium">
                    Parabéns! Você ganhou Frete Grátis na entrega Normal.
                  </p>
                )}
              </div>

              {mensagemIndisponivel && (
                <div
                  role="alert"
                  className="mt-6 border border-amber-300 bg-amber-50 p-4 text-center text-xs leading-5 text-amber-900"
                >
                  <p className="font-medium">{mensagemIndisponivel}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleFinalizarCompra}
                disabled={!cepValido}
                className="mt-8 block w-full bg-black px-4 py-5 text-center text-sm uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
              >
                Finalizar compra
              </button>

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
