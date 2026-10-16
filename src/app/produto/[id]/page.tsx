"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductImageZoom from "../../../components/ProductImageZoom";
import {
  Produto,
  obterProdutoPorId,
  getProductImageUrl,
  formatarPreco,
} from "../../../services/api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Produtos de contingência caso o backend esteja offline
const PRODUTOS_CONTINGENCIA: Record<string, Produto> = {
  "1": {
    id: 1,
    nome: "Blazer Estruturado",
    descricao: "Blazer de alfaiataria com modelagem estruturada e acabamento impecável.",
    valor: 300,
    imagem: ["000011", "000012", "000013"],
    tamanhos: [40, 42, 44, 46, 52],
  },
  "2": {
    id: 2,
    nome: "Calça de Alfaiataria",
    descricao: "Calça de alfaiataria de cintura alta com caimento impecável e modelagem contemporânea.",
    valor: 459,
    imagem: ["000021", "000022", "000023"],
    tamanhos: [40, 42, 44, 46, 52],
  },
  "3": {
    id: 3,
    nome: "Camisa",
    descricao: "Camisa de alfaiataria elegante com caimento fluido e refinado.",
    valor: 459,
    imagem: ["000031", "000032", "000033"],
    tamanhos: [40, 42, 44, 46, 52],
  },
  "4": {
    id: 4,
    nome: "Vestido",
    descricao: "Vestido de alfaiataria com corte elegante e ajuste primoroso.",
    valor: 459,
    imagem: ["000041", "000042", "000043"],
    tamanhos: [40, 42, 44, 46, 52],
  },
};

export default function PaginaProduto() {
  const params = useParams();
  const id = params?.id as string;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [usandoContingencia, setUsandoContingencia] = useState(false);

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mensagemSacola, setMensagemSacola] = useState("");

  // Foto ampliada em tela cheia e zoom
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });

  const galeriaRef = useRef<HTMLElement>(null);
  const gestoRef = useRef({
    distancia: 0,
    zoomInicial: 1,
    xInicial: 0,
    yInicial: 0,
    posicaoX: 0,
    posicaoY: 0,
  });

  // Busca os dados do produto no backend
  useEffect(() => {
    let ativo = true;

    async function carregar() {
      if (!id) return;
      setCarregando(true);
      setErro(null);

      try {
        const dados = await obterProdutoPorId(id);
        if (!ativo) return;

        if (dados) {
          setProduto(dados);
          setUsandoContingencia(false);
        } else if (PRODUTOS_CONTINGENCIA[id]) {
          // Fallback gracioso se o backend Flask ainda não estiver em execução
          setProduto(PRODUTOS_CONTINGENCIA[id]);
          setUsandoContingencia(true);
        } else {
          setErro("Produto não encontrado no catálogo.");
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        if (ativo) {
          if (PRODUTOS_CONTINGENCIA[id]) {
            setProduto(PRODUTOS_CONTINGENCIA[id]);
            setUsandoContingencia(true);
          } else {
            setErro("Não foi possível carregar as informações do produto.");
          }
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [id]);

  // Bloqueia scroll ao abrir foto ampliada
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
      window.removeEventListener("keydown", fecharComEscape);
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

  function distanciaEntreDedos(toques: React.TouchList) {
    const dx = toques[0].clientX - toques[1].clientX;
    const dy = toques[0].clientY - toques[1].clientY;
    return Math.hypot(dx, dy);
  }

  function iniciarToque(evento: TouchEvent<HTMLDivElement>) {
    if (evento.touches.length === 2) {
      gestoRef.current.distancia = distanciaEntreDedos(evento.touches);
      gestoRef.current.zoomInicial = zoom;
    }

    if (evento.touches.length === 1 && zoom > 1) {
      gestoRef.current.xInicial = evento.touches[0].clientX;
      gestoRef.current.yInicial = evento.touches[0].clientY;
      gestoRef.current.posicaoX = posicao.x;
      gestoRef.current.posicaoY = posicao.y;
    }
  }

  function moverToque(evento: TouchEvent<HTMLDivElement>) {
    if (evento.touches.length === 2 && gestoRef.current.distancia > 0) {
      const distanciaAtual = distanciaEntreDedos(evento.touches);
      const novoZoom = Math.min(
        4,
        Math.max(1, gestoRef.current.zoomInicial * (distanciaAtual / gestoRef.current.distancia))
      );

      setZoom(novoZoom);
      if (novoZoom === 1) {
        setPosicao({ x: 0, y: 0 });
      }
    } else if (evento.touches.length === 1 && zoom > 1) {
      setPosicao({
        x: gestoRef.current.posicaoX + evento.touches[0].clientX - gestoRef.current.xInicial,
        y: gestoRef.current.posicaoY + evento.touches[0].clientY - gestoRef.current.yInicial,
      });
    }
  }

  function finalizarToque() {
    gestoRef.current.distancia = 0;
  }

  // O carrinho permanece não funcional conforme solicitado
  function lidarComAdicionarSacola() {
    if (!tamanhoSelecionado) {
      setMensagemSacola("Por favor, selecione um tamanho antes de continuar.");
      return;
    }
    setMensagemSacola("Aviso: Funcionalidade de sacola temporariamente desativada para ajustes posteriores.");
    setTimeout(() => {
      setMensagemSacola("");
    }, 4500);
  }

  // Prepara fotos do produto associadas aos números/nomes vindos do backend
  const fotos =
    produto && produto.imagem && produto.imagem.length > 0
      ? produto.imagem.map((img, index) => ({
          src: getProductImageUrl(img),
          alt: `${produto.nome} - imagem ${index + 1}`,
        }))
      : [
          {
            src: "/products/000011.png",
            alt: produto?.nome || "Produto",
          },
        ];

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
          className="text-2xl font-semibold tracking-tight uppercase"
        >
          ÉLAN
        </Link>

        <nav className="hidden gap-8 text-sm text-neutral-700 md:flex">
          <Link href="/#novidades" className="hover:text-black transition">
            Novidades
          </Link>
          <Link href="/#roupas" className="hover:text-black transition">
            Roupas
          </Link>
          <Link href="/#vestidos" className="hover:text-black transition">
            Vestidos
          </Link>
          <Link href="/#curve" className="hover:text-black transition">
            Curve
          </Link>
          <Link href="/#sale" className="hover:text-black transition">
            Sale
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <span className="hidden lg:inline cursor-pointer text-neutral-600 hover:text-black">
            Buscar
          </span>
          <span className="hidden lg:inline cursor-pointer text-neutral-600 hover:text-black">
            Favoritos
          </span>
          <Link
            href="/sacola"
            className="relative inline-flex items-center gap-2 hover:opacity-75 transition font-medium"
          >
            Sacola
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

      {/* ESTADO DE CARREGANDO */}
      {carregando && (
        <div className="mx-auto flex min-h-[60vh] max-w-[1400px] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
            <p className="text-sm uppercase tracking-wider text-neutral-500">
              Carregando produto...
            </p>
          </div>
        </div>
      )}

      {/* ESTADO DE ERRO */}
      {!carregando && erro && !produto && (
        <div className="mx-auto flex min-h-[60vh] max-w-[1400px] flex-col items-center justify-center px-4 text-center">
          <h2 className="text-2xl font-medium tracking-tight text-neutral-800">
            Produto indisponível
          </h2>
          <p className="mt-2 text-sm text-neutral-500">{erro}</p>
          <Link
            href="/"
            className="mt-6 border border-black px-6 py-3 text-xs uppercase tracking-widest text-black hover:bg-black hover:text-white transition"
          >
            Voltar para a página inicial
          </Link>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL DO PRODUTO */}
      {!carregando && produto && (
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-6 sm:px-6 md:gap-10 md:px-8 md:py-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* GALERIA DE FOTOS ASSOCIADAS DO PRODUTO */}
          <section ref={galeriaRef} className="w-full min-w-0">
            {usandoContingencia && (
              <div className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                Aviso: Backend Flask não detectado em localhost:5000. Exibindo dados de demonstração integrados.
              </div>
            )}

            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              spaceBetween={0}
              navigation
              pagination={{ clickable: true }}
              loop={fotos.length > 1}
              grabCursor={true}
              className="w-full bg-white shadow-sm"
            >
              {fotos.map((foto, index) => (
                <SwiperSlide key={`${foto.src}-${index}`}>
                  <ProductImageZoom
                    src={foto.src}
                    alt={foto.alt}
                    onImageClick={() => abrirFoto(foto.src)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <p className="mt-4 text-center text-xs text-neutral-500">
              Passe o mouse para zoom · Clique para ver em tela cheia
            </p>
          </section>

          {/* INFORMAÇÕES DO PRODUTO */}
          <section className="w-full lg:sticky lg:top-8 lg:self-start lg:pl-6">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
              ÉLAN · Coleção Atemporal
            </p>

            {/* NOME DO PRODUTO */}
            <h1 className="text-2xl font-medium leading-tight sm:text-3xl capitalize">
              {produto.nome}
            </h1>

            {/* VALOR DO PRODUTO */}
            <p className="mt-5 text-2xl font-medium tracking-tight">
              {formatarPreco(produto.valor)}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              ou 6x de {formatarPreco(produto.valor / 6)} sem juros
            </p>

            {/* SELEÇÃO DE TAMANHO */}
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium">Selecione o tamanho</p>
                  {tamanhoSelecionado && (
                    <span className="text-xs text-neutral-500 font-normal">
                      · Tam: <strong>{tamanhoSelecionado}</strong>
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-500 underline cursor-pointer hover:text-black transition">
                  Guia de medidas
                </span>
              </div>

              {produto.tamanhos && produto.tamanhos.length > 0 ? (
                <div className="mt-4 max-h-[160px] overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2.5">
                    {produto.tamanhos.map((tamanho) => {
                      const strTamanho = String(tamanho);
                      const selecionado = tamanhoSelecionado === strTamanho;
                      return (
                        <button
                          key={strTamanho}
                          type="button"
                          onClick={() => {
                            setTamanhoSelecionado(strTamanho);
                            setMensagemSacola("");
                          }}
                          aria-pressed={selecionado}
                          className={`flex min-h-11 min-w-11 items-center justify-center rounded-xs border px-3 text-xs md:text-sm font-medium transition select-none ${
                            selecionado
                              ? "border-black bg-black text-white shadow-xs"
                              : "border-neutral-300 hover:border-black text-neutral-800 bg-white"
                          }`}
                        >
                          {strTamanho}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-neutral-500">
                  Tamanho único / Sob consulta
                </p>
              )}
            </div>

            {/* BOTÃO ADICIONAR À SACOLA (NÃO FUNCIONAL POR ENQUANTO) */}
            <div className="mt-8">
              <button
                type="button"
                onClick={lidarComAdicionarSacola}
                className="w-full bg-black px-4 py-5 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-neutral-800 active:scale-[0.99]"
              >
                Adicionar à sacola
              </button>

              {mensagemSacola && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-3 rounded border border-neutral-300 bg-neutral-50 p-3 text-center text-xs text-neutral-700 animate-fadeIn"
                >
                  {mensagemSacola}
                </div>
              )}
            </div>

            {/* DESCRIÇÃO DO PRODUTO */}
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-3">
                Descrição do Produto
              </h3>
              <p className="text-sm leading-7 text-neutral-600">
                {produto.descricao ||
                  "Peça confeccionada com matérias-primas de alta qualidade e modelagem impecável, garantindo conforto e sofisticação."}
              </p>
            </div>

            {/* DETALHES ADICIONAIS */}
            <div className="mt-6 border-t border-neutral-200 pt-6 text-xs text-neutral-500 space-y-2">
              <p>• Frete grátis em compras acima de R$ 499</p>
              <p>• Primeira troca grátis em até 30 dias</p>
            </div>
          </section>
        </div>
      )}

      {/* VISUALIZADOR DE FOTO EM TELA CHEIA */}
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
            className="absolute right-5 top-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 transition"
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
              alt="Fotografia ampliada"
              width={1200}
              height={1500}
              className="max-h-[85vh] max-w-[95vw] select-none object-contain"
              style={{
                transform: `translate(${posicao.x}px, ${posicao.y}px) scale(${zoom})`,
                transition: "transform 80ms ease-out",
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
