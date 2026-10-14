
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CalcaAlfaiataria() {
  const { adicionarProduto } = useCart();

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<
    string | null
  >(null);

  const [menuAberto, setMenuAberto] = useState(false);

  const fotos = [
    {
      src: "/products/calca-01-frente.png",
      alt: "Calça de Alfaiataria Élan - frente",
    },
    {
      src: "/products/calca-01-costas.png",
      alt: "Calça de Alfaiataria Élan - costas",
    },
    {
      src: "/products/calca-01-detalhe.png",
      alt: "Calça de Alfaiataria Élan - detalhe",
    },
  ];

  function adicionarASacola() {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho.");
      return;
    }

    adicionarProduto({
      id: "calca-alfaiataria",
      nome: "Calça de Alfaiataria Élan",
      tamanho: tamanhoSelecionado,
      preco: 459.9,
      imagem: "/products/calca-01-frente.png",
      quantidade: 1,
    });

    alert(
      `Calça ÉLAN, tamanho ${tamanhoSelecionado}, adicionada à sacola!`
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* CABEÇALHO */}
      <header className="relative flex items-center justify-between border-b border-neutral-200 px-4 py-5 md:px-8">
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="text-2xl md:hidden"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          {menuAberto ? "×" : "☰"}
        </button>

        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight"
        >
          ÉLAN
        </Link>

        <nav className="hidden gap-8 text-sm text-neutral-700 md:flex">
          <Link href="/#novidades">Novidades</Link>
          <Link href="/#roupas">Roupas</Link>
          <Link href="/#vestidos">Vestidos</Link>
          <Link href="/#curve">Curve</Link>
          <Link href="/#sale">Sale</Link>
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <span className="hidden lg:inline">Buscar</span>
          <span className="hidden lg:inline">Favoritos</span>
          <Link href="/sacola">Sacola</Link>
        </div>

        {menuAberto && (
          <nav className="absolute left-0 top-full z-20 flex w-full flex-col gap-5 border-b border-neutral-200 bg-white px-6 py-6 text-sm shadow-sm md:hidden">
            <Link href="/#novidades">Novidades</Link>
            <Link href="/#roupas">Roupas</Link>
            <Link href="/#vestidos">Vestidos</Link>
            <Link href="/#curve">Curve</Link>
            <Link href="/#sale">Sale</Link>
          </nav>
        )}
      </header>

      {/* CONTEÚDO DO PRODUTO */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-6 sm:px-6 md:gap-10 md:px-8 md:py-10 lg:grid-cols-[1fr_1fr]">
        {/* GALERIA */}
        <section className="w-full min-w-0">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={0}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            grabCursor={true}
            
            className="w-full bg-white"

          >
            {fotos.map((foto) => (
              <SwiperSlide key={foto.src}>
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  width={1200}
                  height={1500}
                  
className="block h-[420px] w-full select-none bg-white object-contain sm:h-[550px] lg:h-[650px]"

                  draggable={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* INFORMAÇÕES DO PRODUTO */}
        <section className="w-full lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            ÉLAN
          </p>

          <h1 className="text-2xl font-medium leading-tight sm:text-3xl">
            Calça de Alfaiataria Élan
          </h1>

          <p className="mt-5 text-xl">R$ 459,90</p>

          <p className="mt-2 text-sm text-neutral-500">
            ou 6x de R$ 76,65 sem juros
          </p>

          {/* TAMANHOS */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm font-medium">
              Selecione o tamanho
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["44", "46", "48", "50", "52"].map((tamanho) => (
                <button
                  key={tamanho}
                  type="button"
                  onClick={() => setTamanhoSelecionado(tamanho)}
                  aria-pressed={tamanhoSelecionado === tamanho}
                  className={`flex h-12 w-12 items-center justify-center border text-sm transition ${
                    tamanhoSelecionado === tamanho
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 hover:border-black"
                  }`}
                >
                  {tamanho}
                </button>
              ))}
            </div>
          </div>

          {/* BOTÃO SACOLA */}
          <button
            type="button"
            onClick={adicionarASacola}
            className="mt-8 w-full bg-black px-4 py-5 text-sm uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800"
          >
            Adicionar à sacola
          </button>

          {/* DESCRIÇÃO */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm leading-7 text-neutral-600">
              Calça de alfaiataria de cintura alta com caimento
              elegante e modelagem sofisticada. Uma peça versátil
              e atemporal, criada para proporcionar conforto e
              compor produções refinadas.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
