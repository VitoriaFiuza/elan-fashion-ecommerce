"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { quantidadeTotal } = useCart();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
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
        <Link href="/#novidades" className="hover:text-black transition">
          Novidades
        </Link>
        <Link href="/roupas" className="hover:text-black transition">
          Roupas
        </Link>
        <Link href="/vestidos" className="hover:text-black transition">
          Vestidos
        </Link>
      </nav>

      {/* AÇÕES */}
      <div className="flex items-center gap-5 text-sm">
        <span className="hidden md:inline cursor-pointer text-neutral-600 hover:text-black">
          Buscar
        </span>
        <span className="hidden md:inline cursor-pointer text-neutral-600 hover:text-black">
          Favoritos
        </span>
        <Link
          href="/sacola"
          className="relative inline-flex items-center gap-2 font-medium hover:opacity-75 transition"
        >
          Sacola
          {quantidadeTotal > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-semibold text-white">
              {quantidadeTotal}
            </span>
          )}
        </Link>
      </div>

      {/* MENU MOBILE */}
      {menuAberto && (
        <nav className="absolute left-0 top-full w-full border-b border-neutral-200 bg-white px-6 py-6 shadow-sm md:hidden">
          <div className="flex flex-col gap-5 text-sm">
            <Link
              href="/#novidades"
              onClick={() => setMenuAberto(false)}
              className="hover:text-black transition"
            >
              Novidades
            </Link>
            <Link
              href="/roupas"
              onClick={() => setMenuAberto(false)}
              className="hover:text-black transition"
            >
              Roupas
            </Link>
            <Link
              href="/vestidos"
              onClick={() => setMenuAberto(false)}
              className="hover:text-black transition"
            >
              Vestidos
            </Link>
            <Link
              href="/sacola"
              onClick={() => setMenuAberto(false)}
              className="flex items-center justify-between"
            >
              <span>Minha sacola</span>
              {quantidadeTotal > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-semibold text-white">
                  {quantidadeTotal}
                </span>
              )}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
