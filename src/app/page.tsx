"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Produto,
  obterProdutoPorId,
  getProductImageUrl,
  formatarPreco,
} from "../services/api";

/**
 * IDs dos produtos exibidos na vitrine da tela inicial.
 * Para alterar qualquer produto exibido na home, basta mudar os IDs nesta lista:
 */
const PRODUTOS_HOME_IDS: Array<number | string> = [1, 2, 3, 4];

// Dados de reserva exibidos caso o backend ainda não tenha sido iniciado pelo usuário
const PRODUTOS_FALLBACK: Produto[] = [
  {
    id: 1,
    nome: "Blazer Estruturado",
    descricao: "Blazer de alfaiataria com modelagem estruturada",
    valor: 300,
    imagem: ["000011", "000012", "000013"],
    tamanhos: [40, 42, 44, 46, 52],
  },
  {
    id: 2,
    nome: "Calça de Alfaiataria",
    descricao: "Calça de alfaiataria de cintura alta com caimento",
    valor: 459,
    imagem: ["000021", "000022", "000023"],
    tamanhos: [40, 42, 44, 46, 52],
  },
  {
    id: 3,
    nome: "Camisa",
    descricao: "Camisa de alfaiataria com caimento elegante",
    valor: 459,
    imagem: ["000031", "000032", "000033"],
    tamanhos: [40, 42, 44, 46, 52],
  },
  {
    id: 4,
    nome: "Vestido",
    descricao: "Vestido de alfaiataria com corte impecável",
    valor: 459,
    imagem: ["000041", "000042", "000043"],
    tamanhos: [40, 42, 44, 46, 52],
  },
];

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoFallback, setUsandoFallback] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarProdutosHome() {
      setCarregando(true);
      try {
        // Busca cada produto individualmente pelo seu ID no backend
        const promises = PRODUTOS_HOME_IDS.map((id) => obterProdutoPorId(id));
        const resultados = await Promise.all(promises);

        if (!ativo) return;

        const produtosValidos = resultados.filter(
          (item): item is Produto => item !== null
        );

        if (produtosValidos.length > 0) {
          setProdutos(produtosValidos);
          setUsandoFallback(false);
        } else {
          // Se o backend estiver desligado no momento, usa fallback para manter layout visual
          setProdutos(PRODUTOS_FALLBACK);
          setUsandoFallback(true);
        }
      } catch (err) {
        console.error("Erro ao carregar produtos na home:", err);
        if (ativo) {
          setProdutos(PRODUTOS_FALLBACK);
          setUsandoFallback(true);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarProdutosHome();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* CABEÇALHO */}
      <header className="relative z-20 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-5 md:px-8">
        {/* BOTÃO MENU MOBILE */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          <span className="h-px w-6 bg-black" />
          <span className="h-px w-6 bg-black" />
          <span className="h-px w-6 bg-black" />
        </button>

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight uppercase"
        >
          ÉLAN
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden gap-8 text-sm text-neutral-700 md:flex">
          <a href="#novidades" className="hover:text-black transition">
            Novidades
          </a>
          <a href="#roupas" className="hover:text-black transition">
            Roupas
          </a>
          <a href="#vestidos" className="hover:text-black transition">
            Vestidos
          </a>
          <a href="#curve" className="hover:text-black transition">
            Curve
          </a>
          <a href="#sale" className="hover:text-black transition">
            Sale
          </a>
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-5 text-sm">
          <span className="hidden md:inline cursor-pointer text-neutral-600 hover:text-black">
            Buscar
          </span>
          <span className="hidden md:inline cursor-pointer text-neutral-600 hover:text-black">
            Favoritos
          </span>
          <Link href="/sacola" className="font-medium hover:opacity-75 transition">
            Sacola
          </Link>
        </div>

        {/* MENU MOBILE */}
        {menuAberto && (
          <nav className="absolute left-0 top-full w-full border-b border-neutral-200 bg-white px-6 py-6 shadow-sm md:hidden">
            <div className="flex flex-col gap-5 text-sm">
              <a
                href="#novidades"
                onClick={() => setMenuAberto(false)}
              >
                Novidades
              </a>
              <a
                href="#roupas"
                onClick={() => setMenuAberto(false)}
              >
                Roupas
              </a>
              <a
                href="#vestidos"
                onClick={() => setMenuAberto(false)}
              >
                Vestidos
              </a>
              <a
                href="#curve"
                onClick={() => setMenuAberto(false)}
              >
                Curve
              </a>
              <a
                href="#sale"
                onClick={() => setMenuAberto(false)}
              >
                Sale
              </a>
              <Link
                href="/sacola"
                onClick={() => setMenuAberto(false)}
              >
                Minha sacola
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* CAMPANHA PRINCIPAL */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[480px] w-full sm:h-[560px] md:h-auto">
          <Image
            src="/hero-elan.png"
            alt="Campanha ÉLAN - Elegância que acompanha você"
            width={2048}
            height={768}
            priority
            className="h-full w-full object-cover object-center md:h-auto"
          />
        </div>

        {/* BOTÃO REAL DO SITE */}
        <a
          href="#novidades"
          className="absolute bottom-8 left-5 bg-black px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800 sm:left-8 md:bottom-[8%] md:left-[7.5%] md:px-8 md:py-4 md:text-sm md:tracking-[0.2em]"
        >
          Conheça a coleção →
        </a>
      </section>

      {/* NOVIDADES */}
      <section
        id="novidades"
        className="scroll-mt-8 px-5 py-12 md:px-8 md:py-20"
      >
        <div className="mb-8 flex items-end justify-between md:mb-10">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500 md:text-xs">
              Nova coleção
            </p>

            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              Novidades
            </h2>
          </div>

          <a
            href="#novidades"
            className="text-xs underline underline-offset-4 md:text-sm text-neutral-600 hover:text-black"
          >
            Ver tudo
          </a>
        </div>

        {/* ALERTA INFORMATIVO SE ESTIVER SEM BACKEND */}
        {usandoFallback && !carregando && (
          <div className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            Aviso: O backend Flask (porta 5000) não respondeu no momento. Exibindo dados integrados de demonstração.
          </div>
        )}

        {/* PRODUTOS CARREGADOS DINAMICAMENTE */}
        <div
          id="produtos"
          className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-6 lg:grid-cols-4"
        >
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
                      {/* NOME DO PRODUTO */}
                      <h3 className="text-sm font-medium leading-5 capitalize text-neutral-900 group-hover:underline group-hover:underline-offset-4">
                        {produto.nome}
                      </h3>

                      {/* DESCRIÇÃO DO PRODUTO */}
                      {produto.descricao && (
                        <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                          {produto.descricao}
                        </p>
                      )}

                      {/* VALOR DO PRODUTO */}
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
