# Quadro de tarefas — Elan na Vercel

Objetivo: o site abrir e operar de forma estável na Vercel sem depender de `python app.py` nem de `http://localhost:5000`.

Hoje o Next (porta 3000) já é compatível com a Vercel. A sacola fica no navegador (`localStorage`) e as imagens estão em `public/products/`. O que quebrava no deploy original era a dependência da API Flask e do arquivo `backend/produtos.json`, já que a Vercel opera em ambiente serverless.

Decisão desta leva: catálogo somente leitura, servido diretamente pelo próprio projeto Next (Route Handlers). Operações de criação e edição permanecem no Flask local para desenvolvimento. A loja na Vercel lista e detalha os produtos dinamicamente.

---

## Status Geral

- [x] **1. Catálogo na mesma origem** (Concluído)
- [x] **2. Front deixar de apontar para o Flask** (Concluído)
- [ ] **3. Build, validação e deploy na Vercel** (Em andamento / Próxima ação dos devs)

---

## Tarefas Detalhadas

### 1. Catálogo na mesma origem
**Status:** `CONCLUÍDO` ✅

- [x] Criar rotas de leitura no App Router: `src/app/api/produtos/route.ts` e `src/app/api/produtos/[id]/route.ts`.
- [x] Ler `backend/produtos.json` no servidor com fallback seguro (`src/lib/catalogo.ts`) e responder no mesmo formato da API Flask: lista em `GET /api/produtos` e item em `GET /api/produtos/<id>` (404 se não existir).
- [x] Garantir que falha na leitura ou arquivo vazio retorne lista vazia ou 404, sem quebrar a renderização da página.
- [x] Configurar `outputFileTracingIncludes` no [next.config.ts](file:///c:/Users/bielf/Documents/github/elan-fashion-ecommerce/next.config.ts) para garantir que a Vercel empacote `backend/produtos.json` nas funções serverless.
- [x] Adicionar testes automatizados para leitura de catálogo e rotas (`src/lib/catalogo.test.mts` e `src/app/api/produtos/rotas.test.mts`).

**Critério de aceite:** `GET /api/produtos` e `GET /api/produtos/1` funcionam nativamente no Next sem o Flask ativo.

---

### 2. Front deixar de apontar para o Flask
**Status:** `CONCLUÍDO` ✅

- [x] Em `src/services/api.ts`, trocar a URL base padrão de `http://localhost:5000` para `/api` (mesma origem).
- [x] Manter suporte a `NEXT_PUBLIC_API_URL` como escape caso uma API externa seja utilizada no futuro.
- [x] Remover mensagens que citam "Flask" ou "localhost:5000" em `src/app/page.tsx` e `src/app/produto/[id]/page.tsx`, substituindo por avisos amigáveis de contingência.
- [x] Preservar regras existentes de sacola, checkout, ViaCEP e `formatarPreco`.

**Critério de aceite:** Vitrine e página de detalhes carregam catálogo e funcionam perfeitamente sem o backend Flask em execução.

---

### 3. Build, validação e deploy na Vercel
**Status:** `EM ANDAMENTO / PRÓXIMO PASSO` 🟡

- [ ] **Validar build local**: Rodar `npm run build` na raiz e assegurar que não haja erros de tipo TypeScript, lint ou geração estática/serverless.
- [ ] **Executar testes**: Rodar `npm test` para validar o catálogo e resolução de URLs.
- [ ] **Configuração do projeto na Vercel**:
  - Diretório raiz: `.` (raiz do repositório).
  - Framework Preset: `Next.js`.
  - Variáveis de ambiente: Nenhuma variável obrigatória necessária para o catálogo base.
- [ ] **Smoke Test pós-deploy**:
  - [ ] Página inicial (`/`): produtos listados a partir de `produtos.json` sem cair em fallback.
  - [ ] Detalhe do produto (`/produto/1`): exibição de imagem, preço, seleção de tamanho e botão de compra.
  - [ ] Sacola (`/sacola`) e Checkout: adicionar itens, persistência no `localStorage`, cálculo de total e CEP.
  - [ ] Erro 404 para ID inexistente (`/produto/99999` ou `/api/produtos/99999`).

**Critério de aceite:** Aplicação publicada na Vercel com carregamento rápido, catálogo dinâmico via Route Handlers e sacola 100% funcional no navegador.

---

## Fora desta leva
- Banco de dados em nuvem para persistência de pedidos e pagamentos.
- Rotas de escrita (`POST`, `PUT`, `DELETE` de produtos) na nuvem.
- Migração de endpoints de administração para funções serverless dedicadas.
