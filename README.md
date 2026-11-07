# Elan Fashion - E-Commerce

Loja de moda moderna desenvolvida em Next.js com App Router, TypeScript, Tailwind CSS e integração de catálogo de produtos.

## 🚀 Funcionalidades

- **Vitrine de Produtos**: listagem dinâmica do catálogo com fallback seguro.
- **Página de Detalhes**: visualização de imagens, tamanhos e especificações do produto.
- **Sacola de Compras**: gerenciamento local com persistência no navegador via `localStorage` e simulação funcional de frete e prazos por CEP e região com frete grátis acima de R$ 400.
- **Checkout & Frete**: cálculo e busca de endereço via ViaCEP com validações.
- **Catálogo Integrado**: servido via Route Handlers nativos do Next.js (`/api/produtos`) com suporte a fallback de API externa via `NEXT_PUBLIC_API_URL`.

## 🛠️ Tecnologias

- Next.js 16 (App Router & Turbopack)
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js test runner (`tsx --test`)

## 📦 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado.

### Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar os testes automatizados
npm test

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🧪 Testes

Para rodar a suíte completa de testes automatizados:

```bash
npm test
```

## 📚 Documentação Adicional

- [Arquitetura do Projeto](docs/ARCHITECTURE.md)
- [Quadro de Tarefas e Planejamento Vercel](docs/TASK_BOARD.md)
- [Feedback de Code Review](docs/specs/REVIEW_FEEDBACK.md)
