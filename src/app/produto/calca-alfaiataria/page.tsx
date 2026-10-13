"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

export default function CalcaAlfaiataria() {
  const { adicionarProduto } = useCart();
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(
    null
  );

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
    <main className="min-h-screen bg-white">
      {/* CABEÇALHO */}
      <header className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-black"
        >
          ÉLAN
        </Link>

        <nav className="flex gap-8 text-sm text-neutral-700">
          <Link href="/#novidades">Novidades</Link>
          <Link href="/#roupas">Roupas</Link>
          <Link href="/#vestidos">Vestidos</Link>
          <Link href="/#curve">Curve</Link>
          <Link href="/#sale">Sale</Link>
        </nav>

        <div className="flex gap-5 text-sm text-black">
          <span>Buscar</span>
          <span>Favoritos</span>
          <Link href="/sacola">Sacola</Link>
        </div>
      </header>

      {/* CONTEÚDO DO PRODUTO */}
      <div className="grid grid-cols-[2fr_1fr] gap-10 px-8 py-10">
        {/* GALERIA */}
        <section className="grid grid-cols-2 gap-2">
          <Image
            src="/products/calca-01-frente.png"
            alt="Calça de Alfaiataria Élan - frente"
            width={1200}
            height={1500}
            className="w-full"
            priority
          />

          <Image
            src="/products/calca-01-costas.png"
            alt="Calça de Alfaiataria Élan - costas"
            width={1200}
            height={1500}
            className="w-full"
          />

          <Image
            src="/products/calca-01-detalhe.png"
            alt="Calça de Alfaiataria Élan - detalhe"
            width={1200}
            height={1500}
            className="w-full"
          />
        </section>

        {/* INFORMAÇÕES DO PRODUTO */}
        <section className="px-6">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            ÉLAN
          </p>

          <h1 className="text-3xl font-medium">
            Calça de Alfaiataria Élan
          </h1>

          <p className="mt-4 text-lg">R$ 459,90</p>

          <p className="mt-2 text-sm text-neutral-500">
            ou 6x de R$ 76,65 sem juros
          </p>

          {/* TAMANHOS */}
          <div className="mt-10 border-t border-neutral-200 pt-6">
            <p className="text-sm font-medium">Selecione o tamanho</p>

            <div className="mt-4 flex gap-2">
              {["44", "46", "48", "50", "52"].map((tamanho) => (
                <button
                  key={tamanho}
                  type="button"
                  onClick={() => setTamanhoSelecionado(tamanho)}
                  className={`flex h-11 w-11 items-center justify-center border text-sm transition ${
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
            className="mt-8 w-full bg-black py-4 text-sm uppercase tracking-[0.15em] text-white hover:bg-neutral-800"
          >
            Adicionar à sacola
          </button>

          {/* DESCRIÇÃO */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm leading-6 text-neutral-600">
              Calça de alfaiataria de cintura alta com caimento elegante e
              modelagem sofisticada. Uma peça versátil e atemporal, criada para
              proporcionar conforto e compor produções refinadas.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}