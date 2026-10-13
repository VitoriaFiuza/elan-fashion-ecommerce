"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { produtos } = useCart();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  const total = produtos.reduce(
    (soma, produto) => soma + produto.preco * produto.quantidade,
    0
  );

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function buscarCep(valor: string) {
    const cepLimpo = valor.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCep(true);
    setErroCep("");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao consultar CEP");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErroCep("CEP não encontrado. Confira e tente novamente.");
        return;
      }

      setEndereco(dados.logradouro || "");
      setBairro(dados.bairro || "");
      setCidade(dados.localidade || "");
      setEstado(dados.uf || "");
    } catch {
      setErroCep(
        "Não foi possível consultar o CEP. Preencha o endereço manualmente."
      );
    } finally {
      setBuscandoCep(false);
    }
  }

  function alterarCep(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    const formatado =
      numeros.length > 5
        ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
        : numeros;

    setCep(formatado);
    setErroCep("");

    if (numeros.length === 8) {
      buscarCep(numeros);
    }
  }

  function finalizarPedido(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (produtos.length === 0) {
    alert("Sua sacola está vazia.");
    return;
  }

  const numeroPedido = `ELAN-${Date.now()}`;

  const pedidoDemonstrativo = {
    numero: numeroPedido,
    produtos: produtos.map((produto) => ({ ...produto })),
    total: total,
  };

  sessionStorage.setItem(
    "elan-pedido-demo",
    JSON.stringify(pedidoDemonstrativo)
  );

  router.push("/pedido-confirmado");
}

  const campo =
    "w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black";

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-neutral-200 px-8 py-6">
        <Link href="/" className="text-2xl font-semibold">
          ÉLAN
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-3 text-3xl font-medium">
          Finalizar compra
        </h1>

        <p className="mb-10 text-sm text-neutral-500">
          Confira seu pedido e preencha seus dados para continuar.
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={finalizarPedido} className="space-y-10">
            {/* INFORMAÇÕES PESSOAIS */}
            <section>
              <h2 className="mb-6 border-b pb-4 text-xl">
                Informações pessoais
              </h2>

              <div className="space-y-4">
                <input
                  className={campo}
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <input
                  className={campo}
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  className={campo}
                  type="tel"
                  placeholder="Telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
            </section>

            {/* ENDEREÇO */}
            <section>
              <h2 className="mb-6 border-b pb-4 text-xl">
                Endereço de entrega
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input
                    className={campo}
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => alterarCep(e.target.value)}
                    inputMode="numeric"
                    maxLength={9}
                    required
                  />

                  {buscandoCep && (
                    <p className="mt-2 text-xs text-neutral-500">
                      Buscando endereço...
                    </p>
                  )}

                  {erroCep && (
                    <p className="mt-2 text-xs text-red-600">
                      {erroCep}
                    </p>
                  )}
                </div>

                <input
                  className={`${campo} col-span-2`}
                  placeholder="Rua / Avenida"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                />

                <input
                  className={campo}
                  placeholder="Número"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                />

                <input
                  className={campo}
                  placeholder="Complemento (opcional)"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />

                <input
                  className={`${campo} col-span-2`}
                  placeholder="Bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  required
                />

                <input
                  className={campo}
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                />

                <input
                  className={campo}
                  placeholder="Estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                />
              </div>
            </section>

            {/* PAGAMENTO */}
            <section>
              <h2 className="mb-6 border-b pb-4 text-xl">
                Pagamento
              </h2>

              <p className="text-sm leading-6 text-neutral-500">
                Esta é uma versão demonstrativa do checkout.
                Nenhum pagamento real será processado.
              </p>
            </section>

            <button
              type="submit"
              disabled={produtos.length === 0 || buscandoCep}
              className="w-full bg-black py-4 text-sm uppercase tracking-widest text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              Continuar pedido
            </button>
          </form>

          {/* RESUMO DO PEDIDO */}
          <aside>
            <div className="border border-neutral-200 p-6">
              <h2 className="mb-6 text-xl">
                Resumo do pedido
              </h2>

              {produtos.length === 0 ? (
                <div>
                  <p className="mb-6 text-sm text-neutral-500">
                    Sua sacola está vazia.
                  </p>

                  <Link href="/" className="text-sm underline">
                    Continuar comprando
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {produtos.map((produto) => (
                      <div
                        key={`${produto.id}-${produto.tamanho}`}
                        className="flex gap-4 border-b border-neutral-200 pb-6"
                      >
                        <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-neutral-100">
                          <Image
                            src={produto.imagem}
                            alt={produto.nome}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-sm font-medium">
                            {produto.nome}
                          </h3>

                          <p className="mt-2 text-xs text-neutral-500">
                            Tamanho: {produto.tamanho}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            Quantidade: {produto.quantidade}
                          </p>

                          <p className="mt-3 text-sm">
                            {formatarPreco(
                              produto.preco * produto.quantidade
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatarPreco(total)}</span>
                  </div>

                  <p className="mt-5 text-xs text-neutral-500">
                    Frete a calcular. O valor do frete não está
                    incluído no subtotal.
                  </p>

                  <div className="mt-6 flex justify-between border-t border-neutral-200 pt-5 text-base font-medium">
                    <span>Total dos produtos</span>
                    <span>{formatarPreco(total)}</span>
                  </div>

                  <Link
                    href="/sacola"
                    className="mt-8 inline-block text-sm underline"
                  >
                    Voltar para a sacola
                  </Link>
                </>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-neutral-400">
              Projeto demonstrativo ÉLAN. Nenhuma compra será
              realizada nesta etapa.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}