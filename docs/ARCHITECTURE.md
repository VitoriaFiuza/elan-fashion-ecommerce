# Arquitetura — Elan Fashion

Loja de moda com interface em português (pt-BR) e preços em BRL. A aplicação opera de forma nativa e autônoma na Vercel (Next.js App Router + Route Handlers) ou com suporte a backend Flask para desenvolvimento local.

## Visão geral

```
Navegador
   │
   ▼
Next.js (src/, porta 3000 / Vercel Serverless)
   │  src/services/api.ts
   ├───────────────────────────────┐
   │ (Padrão: mesma origem)        │ (Opcional / escape)
   ▼                               ▼
Route Handlers Next.js           Flask (backend/app.py, porta 5000)
(src/app/api/produtos)             │
   │                               ▼
   ▼                             backend/produtos.json
backend/produtos.json
```

A sacola fica só no navegador (`CartContext` + `localStorage`). O backend guarda o catálogo, não o pedido.

## Frontend & Backend Integrado

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 e Swiper.

| Rota | Arquivo | Função |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Vitrine |
| `/produto/[id]` | `src/app/produto/[id]/page.tsx` | Detalhe do produto |
| `/sacola` | `src/app/sacola/page.tsx` | Sacola |
| `/checkout` | `src/app/checkout/page.tsx` | Checkout |
| `/pedido-confirmado` | `src/app/pedido-confirmado/page.tsx` | Confirmação |
| `/api/produtos` | `src/app/api/produtos/route.ts` | Endpoint de catálogo (GET) |
| `/api/produtos/[id]` | `src/app/api/produtos/[id]/route.ts` | Endpoint de item por ID (GET) |

- `src/app/layout.tsx` envolve a árvore com `CartProvider`.
- `src/context/CartContext.tsx` guarda itens (id, nome, tamanho, preço, imagem, quantidade).
- `src/components/` reúne a UI compartilhada (ex.: zoom da imagem).
- Imagens públicas em `/products/`. Um nome sem extensão vira `.png` (`000011` → `/products/000011.png`).

Chamadas ao catálogo passam por `src/services/api.ts`. A base padrão é `/api` (mesma origem, servida pelas rotas do App Router) com fallback suportado via `NEXT_PUBLIC_API_URL`. Se a API estiver fora ou o catálogo vazio, a página segue: lista vazia ou produto nulo, sem derrubar a tela. Preço na tela usa `formatarPreco`.

## Backend Flask (Desenvolvimento / Administração)

Flask em `backend/app.py`, CORS liberado, persistência em `backend/produtos.json`.

Produto: `id`, `nome`, `descricao`, `valor`, `imagem` (lista de strings), `tamanhos`.

| Método | Rota | Uso |
| --- | --- | --- |
| GET | `/produtos` | Lista o catálogo |
| GET | `/produtos/<id>` | Um produto (404 se não existir) |
| POST | `/produtos` | Cria (201). Obrigatórios: `id`, `nome`, `descricao`, `valor`. 409 se o id já existe |
| PUT | `/produtos/<id>` | Atualiza campos enviados |
| DELETE | `/produtos/<id>` | Remove |

## Como subir

```bash
npm run dev                  # site em http://localhost:3000
npm test                     # executa a suíte de testes unitários e de integração
cd backend && python app.py  # API Flask opcional em http://127.0.0.1:5000
cd backend && python test_api.py
```
