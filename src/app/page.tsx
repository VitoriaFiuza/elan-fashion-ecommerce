import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* CABEÇALHO */}
      <header className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          ÉLAN
        </h1>

        <nav className="flex gap-8 text-sm text-neutral-700">
          <a href="#novidades">Novidades</a>
          <a href="#roupas">Roupas</a>
          <a href="#vestidos">Vestidos</a>
          <a href="#curve">Curve</a>
          <a href="#sale">Sale</a>
        </nav>

        <div className="flex gap-5 text-sm text-black">
          <span>Buscar</span>
          <span>Favoritos</span>
          <Link href="/sacola">Sacola</Link>
        </div>
      </header>

      {/* CAMPANHA PRINCIPAL */}
      <section className="relative w-full">
        
          <Image
          src="/hero-elan.png"
          alt="Campanha ÉLAN - Elegância que acompanha você"
          width={2048}
          height={768}
          priority
          className="h-auto w-full"
        />

        {/* BOTÃO REAL DO SITE */}
        <a
          href="#colecao"
          className="absolute bottom-[8%] left-[7.5%] bg-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
        >
          Conheça a coleção →
        </a>
      </section>
{/* NOVIDADES */}
<section id="novidades" className="px-8 py-20">
  <div className="mb-10 flex items-end justify-between">
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
        Nova coleção
      </p>

      <h2 className="text-4xl font-medium tracking-tight text-black">
        Novidades
      </h2>
    </div>

    <a
      href="#"
      className="text-sm text-black underline underline-offset-4"
    >
      Ver tudo
    </a>
  </div>
  {/* PRODUTOS */}
<div className="grid grid-cols-4 gap-4">
  <a
  href="/produto/blazer-estruturado"
  className="block"
>
  <Image
    src="/products/blazer-01-frente.png"
    alt="Blazer ÉLAN"
    width={800}
    height={1000}
    className="w-full object-cover"
  />

  <div className="mt-4">
    <h3 className="text-sm text-black">
      Blazer Estruturado Élan
    </h3>

    <p className="mt-1 text-sm text-neutral-500">
      R$ 699,90
    </p>
  </div>
</a>

<Link href="/produto/calca-alfaiataria">
    <Image
      src="/products/calca-01-frente.png"
      alt="Calça ÉLAN"
      width={800}
      height={1000}
      className="w-full object-cover"
    />
    <div className="mt-4">
      <h3 className="text-sm text-black">Calça de Alfaiataria Élan</h3>
      <p className="mt-1 text-sm text-neutral-500">R$ 459,90</p>
    </div>
</Link>
  <Link href="/produto/camisa">
    <Image
      src="/products/camisa-01-frente.png"
      alt="Camisa ÉLAN"
      width={800}
      height={1000}
      className="w-full object-cover"
    />
     <div className="mt-4">
    <h3 className="text-sm text-black">Camisa Élan</h3>
    <p className="mt-1 text-sm text-neutral-500">R$ 389,90</p>
  </div>
</Link>

  <Link href="/produto/vestido-preto" className="block">
  <Image
    src="/products/vestido-01-frente.png"
    alt="Vestido ÉLAN"
    width={800}
    height={1000}
    className="w-full object-cover"
  />

  <div className="mt-4">
    <h3 className="text-sm text-black">Vestido Midi Élan</h3>
    <p className="mt-1 text-sm text-neutral-500">R$ 599,90</p>
  </div>
</Link>
</div>
</section>
    </main>
  );
}