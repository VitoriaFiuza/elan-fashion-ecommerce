
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useCart } from "../../../context/CartContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fotos = [
  {
    src: "/products/blazer-01-frente.png",
    alt: "Blazer Estruturado Élan - frente",
  },
  {
    src: "/products/blazer-01-costas.png",
    alt: "Blazer Estruturado Élan - costas",
  },
  {
    src: "/products/blazer-01-detalhe.png",
    alt: "Blazer Estruturado Élan - detalhe",
  },
];

export default function BlazerEstruturado() {
  const { adicionarProduto, quantidadeTotal } = useCart();

  const [tamanhoSelecionado, setTamanhoSelecionado] =
    useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [confirmacaoMobile, setConfirmacaoMobile] =
    useState(false);
  const [animandoSacola, setAnimandoSacola] = useState(false);

  const [fotoAmpliada, setFotoAmpliada] =
    useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });

  const sacolaRef = useRef<HTMLAnchorElement>(null);
  const galeriaRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const gestoRef = useRef({
    distancia: 0,
    zoomInicial: 1,
    xInicial: 0,
    yInicial: 0,
    posicaoX: 0,
    posicaoY: 0,
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!fotoAmpliada) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setFotoAmpliada(null);
      }
    }

    window.addEventListener("keydown", fecharComEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener(
        "keydown",
        fecharComEscape
      );
    };
  }, [fotoAmpliada]);

  function abrirFoto(src: string) {
    setFotoAmpliada(src);
    setZoom(1);
    setPosicao({ x: 0, y: 0 });
  }

  function fecharFoto() {
    setFotoAmpliada(null);
    setZoom(1);
    setPosicao({ x: 0, y: 0 });
  }

  function distanciaEntreDedos(
    toques: React.TouchList
  ) {
    const dx = toques[0].clientX - toques[1].clientX;
    const dy = toques[0].clientY - toques[1].clientY;
    return Math.hypot(dx, dy);
  }

  function iniciarToque(evento: TouchEvent<HTMLDivElement>) {
    if (evento.touches.length === 2) {
      gestoRef.current.distancia = distanciaEntreDedos(
        evento.touches
      );
      gestoRef.current.zoomInicial = zoom;
    }

    if (evento.touches.length === 1 && zoom > 1) {
      gestoRef.current.xInicial =
        evento.touches[0].clientX;
      gestoRef.current.yInicial =
        evento.touches[0].clientY;
      gestoRef.current.posicaoX = posicao.x;
      gestoRef.current.posicaoY = posicao.y;
    }
  }

  function moverToque(evento: TouchEvent<HTMLDivElement>) {
    if (
      evento.touches.length === 2 &&
      gestoRef.current.distancia > 0
    ) {
      const distanciaAtual = distanciaEntreDedos(
        evento.touches
      );

      const novoZoom = Math.min(
        4,
        Math.max(
          1,
          gestoRef.current.zoomInicial *
            (distanciaAtual / gestoRef.current.distancia)
        )
      );

      setZoom(novoZoom);

      if (novoZoom === 1) {
        setPosicao({ x: 0, y: 0 });
      }
    } else if (
      evento.touches.length === 1 &&
      zoom > 1
    ) {
      setPosicao({
        x:
          gestoRef.current.posicaoX +
          evento.touches[0].clientX -
          gestoRef.current.xInicial,
        y:
          gestoRef.current.posicaoY +
          evento.touches[0].clientY -
          gestoRef.current.yInicial,
      });
    }
  }

  function finalizarToque() {
    gestoRef.current.distancia = 0;
  }

  function animarProdutoAteSacola() {
    const destino = sacolaRef.current;
    const galeria = galeriaRef.current;

    if (!destino || !galeria) return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    // No celular, usamos a confirmação perto do botão.
    if (window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    const imagemAtiva = galeria.querySelector(
      ".swiper-slide-active img"
    ) as HTMLImageElement | null;

    if (!imagemAtiva) return;

    const origem = imagemAtiva.getBoundingClientRect();
    const chegada = destino.getBoundingClientRect();

    const largura = Math.min(90, origem.width * 0.3);
    const altura = largura * 1.25;

    const inicioX =
      origem.left + origem.width / 2 - largura / 2;
    const inicioY =
      origem.top + origem.height / 2 - altura / 2;

    const fimX =
      chegada.left + chegada.width / 2 - largura / 2;
    const fimY =
      chegada.top + chegada.height / 2 - altura / 2;

    const miniatura = document.createElement("img");

    miniatura.src =
      imagemAtiva.currentSrc || imagemAtiva.src;
    miniatura.alt = "";
    miniatura.setAttribute("aria-hidden", "true");

    Object.assign(miniatura.style, {
      position: "fixed",
      left: `${inicioX}px`,
      top: `${inicioY}px`,
      width: `${largura}px`,
      height: `${altura}px`,
      objectFit: "cover",
      borderRadius: "4px",
      pointerEvents: "none",
      zIndex: "9999",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    });

    document.body.appendChild(miniatura);

    const animacao = miniatura.animate(
      [
        {
          transform: "translate(0, 0) scale(1)",
          opacity: 1,
        },
        {
          transform: `translate(${
            (fimX - inicioX) * 0.6
          }px, ${
            (fimY - inicioY) * 0.6 - 60
          }px) scale(0.7)`,
          opacity: 0.9,
          offset: 0.6,
        },
        {
          transform: `translate(${
            fimX - inicioX
          }px, ${fimY - inicioY}px) scale(0.15)`,
          opacity: 0,
        },
      ],
      {
        duration: 750,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );

    animacao.onfinish = () => miniatura.remove();
    animacao.oncancel = () => miniatura.remove();
  }

  function adicionarASacola() {
    if (!tamanhoSelecionado) {
      setMensagem("Selecione um tamanho para continuar.");
      setConfirmacaoMobile(false);
      return;
    }

    adicionarProduto({
      id: "blazer-estruturado",
      nome: "Blazer Estruturado Élan",
      tamanho: tamanhoSelecionado,
      preco: 699.9,
      imagem: "/products/blazer-01-frente.png",
      quantidade: 1,
    });

    animarProdutoAteSacola();

    setMensagem("Produto adicionado à sacola.");
    setConfirmacaoMobile(true);
    setAnimandoSacola(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setMensagem("");
      setConfirmacaoMobile(false);
      setAnimandoSacola(false);
    }, 4000);
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

          <Link
            ref={sacolaRef}
            href="/sacola"
            className={`relative inline-flex items-center gap-2 ${
              animandoSacola ? "animate-pulse" : ""
            }`}
          >
            Sacola

            {quantidadeTotal > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                {quantidadeTotal}
              </span>
            )}
          </Link>
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

      {/* CONTEÚDO */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-6 sm:px-6 md:gap-10 md:px-8 md:py-10 lg:grid-cols-[1fr_1fr]">
        {/* GALERIA */}
        <section ref={galeriaRef} className="w-full min-w-0">
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
                <button
                  type="button"
                  onClick={() => abrirFoto(foto.src)}
                  className="block w-full cursor-zoom-in"
                  aria-label={`Ampliar: ${foto.alt}`}
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    width={1200}
                    height={1500}
                    className="block h-[420px] w-full select-none bg-white object-contain sm:h-[550px] lg:h-[650px]"
                    draggable={false}
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          <p className="mt-4 text-center text-xs text-neutral-500">
            Toque na imagem para ampliar
          </p>
        </section>

        {/* INFORMAÇÕES */}
        <section className="w-full lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            ÉLAN
          </p>

          <h1 className="text-2xl font-medium leading-tight sm:text-3xl">
            Blazer Estruturado Élan
          </h1>

          <p className="mt-5 text-xl">R$ 699,90</p>

          <p className="mt-2 text-sm text-neutral-500">
            ou 6x de R$ 116,65 sem juros
          </p>

          {/* TAMANHOS */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm font-medium">
              Selecione o tamanho
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["44", "46", "48", "50", "52"].map(
                (tamanho) => (
                  <button
                    key={tamanho}
                    type="button"
                    onClick={() =>
                      setTamanhoSelecionado(tamanho)
                    }
                    aria-pressed={
                      tamanhoSelecionado === tamanho
                    }
                    className={`flex h-12 w-12 items-center justify-center border text-sm transition ${
                      tamanhoSelecionado === tamanho
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 hover:border-black"
                    }`}
                  >
                    {tamanho}
                  </button>
                )
              )}
            </div>
          </div>

          {/* BOTÃO DE COMPRA */}
          <button
            type="button"
            onClick={adicionarASacola}
            className="mt-8 w-full bg-black px-4 py-5 text-sm uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800"
          >
            Adicionar à sacola
          </button>

          {/* CONFIRMAÇÃO NO COMPUTADOR */}
          <div
            aria-live="polite"
            className="mt-3 hidden min-h-5 text-center text-sm text-neutral-600 md:block"
          >
            {mensagem}
          </div>

          {/* CONFIRMAÇÃO NO CELULAR */}
          {confirmacaoMobile && tamanhoSelecionado && (
            <div
              role="status"
              className="mt-4 animate-in rounded-md border border-neutral-300 bg-neutral-50 p-4 md:hidden"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm text-white">
                  ✓
                </span>

                <p className="text-sm font-medium">
                  Adicionado à sacola!
                </p>
              </div>

              <p className="mt-3 text-sm text-neutral-700">
                Blazer Estruturado Élan · Tam.{" "}
                {tamanhoSelecionado}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-500">
                  {quantidadeTotal}{" "}
                  {quantidadeTotal === 1
                    ? "peça na sacola"
                    : "peças na sacola"}
                </span>

                <Link
                  href="/sacola"
                  className="border-b border-black pb-1 text-sm font-medium"
                >
                  Ver sacola →
                </Link>
              </div>
            </div>
          )}

          {/* ERRO DE TAMANHO NO CELULAR */}
          {!confirmacaoMobile && mensagem && (
            <p
              role="alert"
              className="mt-3 text-center text-sm text-neutral-600 md:hidden"
            >
              {mensagem}
            </p>
          )}

          {/* DESCRIÇÃO */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm leading-7 text-neutral-600">
              Blazer de alfaiataria com modelagem estruturada
              e acabamento sofisticado. Uma peça versátil
              criada para composições elegantes e atemporais.
            </p>
          </div>
        </section>
      </div>

      {/* VISUALIZADOR DE FOTO AMPLIADA */}
      {fotoAmpliada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fotografia ampliada do produto"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
        >
          <button
            type="button"
            onClick={fecharFoto}
            className="absolute right-5 top-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white"
            aria-label="Fechar fotografia ampliada"
          >
            ×
          </button>

          <div
            className="flex h-full w-full items-center justify-center overflow-hidden"
            style={{ touchAction: "none" }}
            onTouchStart={iniciarToque}
            onTouchMove={moverToque}
            onTouchEnd={finalizarToque}
            onTouchCancel={finalizarToque}
          >
            <Image
              src={fotoAmpliada}
              alt="Fotografia ampliada do blazer"
              width={1200}
              height={1500}
              className="max-h-[85vh] max-w-[95vw] select-none object-contain"
              style={{
                transform: `translate(${posicao.x}px, ${posicao.y}px) scale(${zoom})`,
                transition:
                  "transform 80ms ease-out",
                touchAction: "none",
              }}
              draggable={false}
            />
          </div>

          <p className="pointer-events-none absolute bottom-7 left-0 w-full px-4 text-center text-xs text-white/70 md:hidden">
            Afaste dois dedos para ampliar · Arraste para explorar
          </p>
        </div>
      )}
    </main>
  );
}
