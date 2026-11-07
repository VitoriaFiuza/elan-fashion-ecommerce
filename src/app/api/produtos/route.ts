import { respostaLista } from "../../../lib/catalogo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return respostaLista();
}
