export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
  <h1 className="text-2xl font-semibold tracking-tight text-black">
    ÉLAN
  </h1>

  <nav className="flex gap-8 text-sm text-neutral-700">
    <a href="#">Novidades</a>
    <a href="#">Roupas</a>
    <a href="#">Vestidos</a>
    <a href="#">Curve</a>
    <a href="#">Sale</a>
  </nav>

  <div className="flex gap-5 text-sm text-black">
    <span>Buscar</span>
    <span>Favoritos</span>
    <span>Sacola</span>
  </div>
</header>
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          Moda feminina
        </p>

        <h1 className="text-6xl font-semibold tracking-tight text-black">
          ÉLAN
        </h1>

        <p className="mt-6 max-w-md text-lg text-neutral-600">
          Elegância que acompanha você.
        </p>

        <button className="mt-8 bg-black px-8 py-3 text-sm uppercase tracking-widest text-white">
          Conheça a coleção
        </button>
      </section>
    </main>
  );
}