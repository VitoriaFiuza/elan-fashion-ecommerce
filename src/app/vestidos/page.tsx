"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  Produto,
  listarProdutos,
  getProductImageUrl,
  formatarPreco,
} from "../../services/api";
import { filtrarVestidos } from "../../lib/filtro-produtos";

const VESTIDOS_FALLBACK: Produto[] = [
  {
    id: 4,
    nome: "Vestido",
    descricao: "Vestido de alfaiataria com corte impecável",
    valor: 459,
    imagem: ["000041", "000042", "000043"],
    tamanhos: [40, 42, 44, 46, 52],
  },
];

export default function PaginaVestidos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoFallback, setUsandoFallback] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarVestidos() {
      setCarregando(true);
      try {
        const todosProdutos = await listarProdutos();

        if (!ativo) return;

        if (todosProdutos.length > 0) {
          const vestidosFiltrados = filtrarVestidos(todosProdutos);
          setProdutos(vestidosFiltrados);
          setUsandoFallback(false);
        } else {
          setProdutos(VESTIDOS_FALLBACK);
          setUsandoFallback(true);
        }
      } catch (err) {
        console.error("Erro ao carregar vestidos:", err);
        if (ativo) {
          setProdutos(VESTIDOS_FALLBACK);
          setUsandoFallback(true);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarVestidos();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="scroll-mt-8 px-5 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex items-end justify-between md:mb-10">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500 md:text-xs">
              Coleção ÉLAN
            </p>
            <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
              Vestidos
            </h1>
          </div>
          <span className="text-xs text-neutral-500 md:text-sm">
            {!carregando && `${produtos.length} ${produtos.length === 1 ? "peça" : "peças"}`}
          </span>
        </div>

        {usandoFallback && !carregando && (
          <div className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            Aviso: o catálogo não respondeu. Exibindo dados de demonstração.
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-6 lg:grid-cols-4">
          {carregando
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="aspect-[4/5] w-full bg-neutral-200 rounded-sm" />
                  <div className="mt-4 h-4 w-3/4 bg-neutral-200 rounded" />
                  <div className="mt-2 h-3 w-1/2 bg-neutral-200 rounded" />
                  <div className="mt-2 h-4 w-1/3 bg-neutral-200 rounded" />
                </div>
              ))
            : produtos.map((produto) => {
                const imagemCapa = getProductImageUrl(produto.imagem?.[0]);

                return (
                  <Link
                    key={produto.id}
                    href={`/produto/${produto.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={imagemCapa}
                        alt={produto.nome}
                        width={800}
                        height={1000}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 md:mt-4">
                      <h2 className="text-sm font-medium leading-5 capitalize text-neutral-900 group-hover:underline group-hover:underline-offset-4">
                        {produto.nome}
                      </h2>

                      {produto.descricao && (
                        <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                          {produto.descricao}
                        </p>
                      )}

                      <p className="mt-1.5 text-sm font-medium text-neutral-900">
                        {formatarPreco(produto.valor)}
                      </p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </section>
    </main>
  );
}
