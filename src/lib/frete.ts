export interface OpcaoFrete {
  id: "normal" | "expresso";
  nome: string;
  prazoMinDias: number;
  prazoMaxDias: number;
  valor: number;
  gratis: boolean;
}

export interface RegiaoFrete {
  nome: string;
  valorNormal: number;
  prazoMinNormal: number;
  prazoMaxNormal: number;
  valorExpresso: number;
  prazoMinExpresso: number;
  prazoMaxExpresso: number;
}

const REGIOES: Record<string, RegiaoFrete> = {
  sudeste: {
    nome: "Sudeste",
    valorNormal: 19.9,
    prazoMinNormal: 3,
    prazoMaxNormal: 5,
    valorExpresso: 34.9,
    prazoMinExpresso: 1,
    prazoMaxExpresso: 2,
  },
  sul: {
    nome: "Sul",
    valorNormal: 24.9,
    prazoMinNormal: 4,
    prazoMaxNormal: 6,
    valorExpresso: 39.9,
    prazoMinExpresso: 2,
    prazoMaxExpresso: 3,
  },
  centroOeste: {
    nome: "Centro-Oeste",
    valorNormal: 29.9,
    prazoMinNormal: 5,
    prazoMaxNormal: 8,
    valorExpresso: 49.9,
    prazoMinExpresso: 2,
    prazoMaxExpresso: 4,
  },
  nordeste: {
    nome: "Nordeste",
    valorNormal: 34.9,
    prazoMinNormal: 6,
    prazoMaxNormal: 10,
    valorExpresso: 59.9,
    prazoMinExpresso: 3,
    prazoMaxExpresso: 5,
  },
  norte: {
    nome: "Norte",
    valorNormal: 44.9,
    prazoMinNormal: 8,
    prazoMaxNormal: 14,
    valorExpresso: 69.9,
    prazoMinExpresso: 4,
    prazoMaxExpresso: 7,
  },
  padrao: {
    nome: "Brasil",
    valorNormal: 29.9,
    prazoMinNormal: 5,
    prazoMaxNormal: 8,
    valorExpresso: 49.9,
    prazoMinExpresso: 2,
    prazoMaxExpresso: 4,
  },
};

const MAPA_UF_REGIAO: Record<string, keyof typeof REGIOES> = {
  SP: "sudeste",
  RJ: "sudeste",
  MG: "sudeste",
  ES: "sudeste",
  PR: "sul",
  SC: "sul",
  RS: "sul",
  DF: "centroOeste",
  GO: "centroOeste",
  MT: "centroOeste",
  MS: "centroOeste",
  BA: "nordeste",
  PE: "nordeste",
  CE: "nordeste",
  RN: "nordeste",
  PB: "nordeste",
  AL: "nordeste",
  SE: "nordeste",
  PI: "nordeste",
  MA: "nordeste",
  AM: "norte",
  PA: "norte",
  AC: "norte",
  RO: "norte",
  RR: "norte",
  AP: "norte",
  TO: "norte",
};

export const VALOR_MINIMO_FRETE_GRATIS = 400;

export function limparCep(cep: string): string {
  if (!cep) return "";
  return cep.replace(/\D/g, "").slice(0, 8);
}

export function formatarCep(cep: string): string {
  const digitos = limparCep(cep);
  if (digitos.length > 5) {
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  }
  return digitos;
}

export function obterRegiaoPorUf(uf: string): RegiaoFrete {
  const ufNormalizada = uf?.trim().toUpperCase();
  const regiaoKey = MAPA_UF_REGIAO[ufNormalizada] || "padrao";
  return REGIOES[regiaoKey];
}

export function calcularOpcoesFrete(uf: string, subtotal: number): OpcaoFrete[] {
  const regiao = obterRegiaoPorUf(uf);
  const elegivelFreteGratis = subtotal >= VALOR_MINIMO_FRETE_GRATIS;

  const normal: OpcaoFrete = {
    id: "normal",
    nome: "Normal",
    prazoMinDias: regiao.prazoMinNormal,
    prazoMaxDias: regiao.prazoMaxNormal,
    valor: elegivelFreteGratis ? 0 : regiao.valorNormal,
    gratis: elegivelFreteGratis,
  };

  const expresso: OpcaoFrete = {
    id: "expresso",
    nome: "Expresso",
    prazoMinDias: regiao.prazoMinExpresso,
    prazoMaxDias: regiao.prazoMaxExpresso,
    valor: regiao.valorExpresso,
    gratis: false,
  };

  return [normal, expresso];
}
