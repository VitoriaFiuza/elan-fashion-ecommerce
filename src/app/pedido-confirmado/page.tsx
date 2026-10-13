"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProdutoPedido = {
  id: string;
  nome: string;
  tamanho: string;
  preco: number;
  imagem: string;
  quantidade: number;
};

type PedidoDemonstrativo = {
  numero: string;
  produtos: ProdutoPedido[];
  total: number;
};

export default function PedidoConfirmado() {
  const [pedido, setPedido] = useState<PedidoDemonstrativo | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem("elan-pedido-demo");

      if (salvo) {
        setPedido(JSON.parse(salvo));
      }
    } catch (erro) {
      console.error("Erro ao carregar pedido:", erro);
    } finally {
      setCarregado(true);
    }
  }, []);

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (!carregado) {
    return (
      <main className="min-h-screen bg-white p-10 text-center">
        Carregando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-neutral-200 px-8 py-6">
        <Link href="/" className="text-2xl font-semibold">
          ÉLAN
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {pedido ? (
          <>
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-black text-3xl">
                ✓
              </div>

              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
                ÉLAN
              </p>

              <h1 className="text-3xl font-medium">
                Seu pedido foi registrado na demonstração
              </h1>

              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Obrigada por escolher a ÉLAN.
                Esta é uma simulação de compra para apresentação
                do projeto.
              </p>

              <p className="mt-5 text-sm">
                Pedido demonstrativo nº{" "}
                <span className="font-semibold">{pedido.numero}</span>
              </p>
            </div>

            <div className="border border-neutral-200 p-6 md:p-10">
              <h2 className="mb-8 text-xl">
                Resumo do pedido
              </h2>

              <div className="space-y-6">
                {pedido.produtos.map((produto) => (
                  <div
                    key={`${produto.id}-${produto.tamanho}`}
                    className="flex gap-5 border-b border-neutral-200 pb-6"
                  >
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-neutral-100">
                      <Image
                        src={produto.imagem}
                        alt={produto.nome}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">
                        {produto.nome}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-500">
                        Tamanho: {produto.tamanho}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        Quantidade: {produto.quantidade}
                      </p>

                      <p className="mt-4 text-sm">
                        {formatarPreco(
                          produto.preco * produto.quantidade
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between text-lg font-medium">
                <span>Total dos produtos</span>
                <span>{formatarPreco(pedido.total)}</span>
              </div>

              <p className="mt-4 text-xs text-neutral-500">
                Frete não incluído. Nenhum pagamento foi processado.
              </p>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/"
                className="inline-block bg-black px-12 py-4 text-sm uppercase tracking-widest text-white hover:bg-neutral-800"
              >
                Continuar comprando
              </Link>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <h1 className="text-3xl font-medium">
              Nenhum pedido demonstrativo encontrado
            </h1>

            <p className="mt-4 text-neutral-500">
              Finalize uma simulação de compra para visualizar
              a confirmação.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block bg-black px-10 py-4 text-sm text-white"
            >
              Voltar à loja
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}