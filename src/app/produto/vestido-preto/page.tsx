
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

export default function VestidoPreto() {
 const { adicionarProduto } = useCart(); 
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
  function adicionarASacola() {
  if (!tamanhoSelecionado) {
    alert("Por favor, selecione um tamanho.");
    return;
  }

  adicionarProduto({
   id: "vestido-preto",
nome: "Vestido Preto Élan",
tamanho: tamanhoSelecionado,
preco: 599.90,
imagem: "/products/vestido-01-frente.png",
quantidade: 1,
  });

  alert(`Vestido ÉLAN, tamanho ${tamanhoSelecionado}, adicionado à sacola!`);
}

  return (
    <main className="min-h-screen bg-white">
        <header className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
  <a
    href="/"
    className="text-2xl font-semibold tracking-tight text-black"
  >
    ÉLAN
  </a>

  <nav className="flex gap-8 text-sm text-neutral-700">
    <a href="/#novidades">Novidades</a>
    <a href="/#roupas">Roupas</a>
    <a href="/#vestidos">Vestidos</a>
    <a href="/#curve">Curve</a>
    <a href="/#sale">Sale</a>
  </nav>

  <div className="flex gap-5 text-sm text-black">
    <span>Buscar</span>
    <span>Favoritos</span>
  <Link href="/sacola">Sacola</Link>
  </div>
</header>

      <div className="grid grid-cols-[2fr_1fr] gap-10 px-8 py-10">

        {/* GALERIA */}
        <section className="grid grid-cols-2 gap-2">
          <Image
            src="/products/vestido-01-frente.png"
            alt="Vestido Preto Élan - frente"
            width={1200}
            height={1500}
            className="w-full"
            priority
          />

          <Image
            src="/products/vestido-01-costas.png"
            alt="Vestido Preto Élan - costas"
            width={1200}
            height={1500}
            className="w-full"
          />

          <Image
  src="/products/vestido-01-detalhe.png"
  alt="Vestido Preto Élan - detalhe"
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
            Vestido Preto Élan
          </h1>

          <p className="mt-4 text-lg">
            R$ 599,90
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            ou 6x de R$ 99,98 sem juros
          </p>

          <div className="mt-10 border-t border-neutral-200 pt-6">
            <p className="text-sm font-medium">
              Selecione o tamanho
            </p>

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

          <button
  type="button"
 onClick={adicionarASacola}
  className="mt-8 w-full bg-black py-4 text-sm uppercase tracking-[0.15em] text-white hover:bg-neutral-800"
>
  Adicionar à sacola
</button>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm leading-6 text-neutral-600">
              Vestido preto de comprimento midi com design minimalista e caimento
                elegante. Uma peça sofisticada e atemporal, criada para valorizar
                 a silhueta com conforto e versatilidade.
            </p>
          </div>
        </section>

      </div>

    </main>
  );
}