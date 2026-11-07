"use client";

import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  onImageClick?: () => void;
  zoomScale?: number;
}

export default function ProductImageZoom({
  src,
  alt,
  onImageClick,
  zoomScale = 2.4,
}: ProductImageZoomProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calcula a porcentagem do cursor relativa à imagem (0% a 100%)
    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setBgPos({ x: percentX, y: percentY });
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[420px] w-full overflow-hidden select-none bg-white sm:h-[550px] lg:h-[650px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Botão com a imagem original */}
      <button
        type="button"
        onClick={onImageClick}
        className="block h-full w-full cursor-zoom-in text-left focus:outline-none"
        aria-label={`Ampliar imagem: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1500}
          className={`h-full w-full object-contain transition-opacity duration-200 select-none ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
          draggable={false}
          priority
        />
      </button>

      {/* Camada de Zoom Direto no Hover (aparece imediatamente ao passar o mouse) */}
      <div
        onClick={onImageClick}
        className={`pointer-events-auto absolute inset-0 z-20 cursor-zoom-in transition-opacity duration-150 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          backgroundSize: `${zoomScale * 100}%`,
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      >
        {/* Indicador sutil e elegante */}
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white backdrop-blur-sm shadow-sm select-none">
          Clique p/ tela cheia
        </span>
      </div>
    </div>
  );
}
