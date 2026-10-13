
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);

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
          className="text-2xl font-semibold tracking-tight"
        >
          ÉLAN
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden gap-8 text-sm text-neutral-700 md:flex">
          <a href="#novidades">Novidades</a>
          <a href="#roupas">Roupas</a>
          <a href="#vestidos">Vestidos</a>
          <a href="#curve">Curve</a>
          <a href="#sale">Sale</a>
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-5 text-sm">
          <span className="hidden md:inline">Buscar</span>
          <span className="hidden md:inline">Favoritos</span>
          <Link href="/sacola" className="font-medium">
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
            href="#produtos"
            className="text-xs underline underline-offset-4 md:text-sm"
          >
            Ver tudo
          </a>
        </div>

        {/* PRODUTOS */}
        <div
          id="produtos"
          className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-5 lg:grid-cols-4"
        >
          {/* BLAZER */}
          <Link
            href="/produto/blazer-estruturado"
            className="block"
          >
            <Image
              src="/products/blazer-01-frente.png"
              alt="Blazer Estruturado Élan"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />

            <div className="mt-3 md:mt-4">
              <h3 className="text-sm leading-5">
                Blazer Estruturado Élan
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                R$ 699,90
              </p>
            </div>
          </Link>

          {/* CALÇA */}
          <Link
            href="/produto/calca-alfaiataria"
            className="block"
          >
            <Image
              src="/products/calca-01-frente.png"
              alt="Calça de Alfaiataria Élan"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />

            <div className="mt-3 md:mt-4">
              <h3 className="text-sm leading-5">
                Calça de Alfaiataria Élan
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                R$ 459,90
              </p>
            </div>
          </Link>

          {/* CAMISA */}
          <Link href="/produto/camisa" className="block">
            <Image
              src="/products/camisa-01-frente.png"
              alt="Camisa Élan"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />

            <div className="mt-3 md:mt-4">
              <h3 className="text-sm leading-5">
                Camisa Élan
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                R$ 389,90
              </p>
            </div>
          </Link>

          {/* VESTIDO */}
          <Link
            href="/produto/vestido-preto"
            className="block"
          >
            <Image
              src="/products/vestido-01-frente.png"
              alt="Vestido Midi Élan"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />

            <div className="mt-3 md:mt-4">
              <h3 className="text-sm leading-5">
                Vestido Midi Élan
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                R$ 599,90
              </p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
