# Especificação Técnica: Menu Funcional e Categorias de Roupas / Vestidos

## Objetivo da Tarefa
Tornar a navegação do cabeçalho totalmente funcional de acordo com os requisitos:
1. **Remoção de Itens Inativos:** Remover as opções "Curve" e "Sale" dos menus (desktop e mobile).
2. **Novidades:** Apontar para a página inicial (`/` ou `/#novidades`), exibindo a vitrine principal.
3. **Roupas:** Criar/configurar rota dedicada (`/roupas`) ou filtro que liste as peças de vestuário que **não** sejam vestidos (ex: Blazers, Calças, Camisas).
4. **Vestidos:** Criar/configurar rota dedicada (`/vestidos`) que liste **apenas** vestidos (ex: Peças cujo nome contenha "vestido").
5. **Consistência Visual e Header Compartilhado:** Manter o layout e identidade visual idênticos ao padrão do site (tipografia, espaçamento, comportamento de sacola e menu mobile). Unificar o cabeçalho preferencialmente em componente reutilizável (`src/components/Header.tsx` ou similar) para que as páginas (`/`, `/roupas`, `/vestidos`, `/produto/[id]`) compartilhem o mesmo menu funcional e coerente.

---

## Escopo de Arquivos

### Criar:
- `src/components/Header.tsx`: Componente de cabeçalho unificado com links para `Novidades` (`/`), `Roupas` (`/roupas`), `Vestidos` (`/vestidos`), Sacola e menu mobile responsivo.
- `src/app/roupas/page.tsx`: Página de listagem contendo apenas roupas que não sejam vestidos.
- `src/app/vestidos/page.tsx`: Página de listagem contendo apenas vestidos.
- `src/lib/filtro-produtos.ts` (ou funções utilitárias no serviço): Funções de filtragem por categoria para permitir testes unitários limpos.
- `src/lib/filtro-produtos.test.mts`: Testes unitários para regras de separação de "roupas sem vestidos" e "apenas vestidos".

### Modificar:
- `src/app/page.tsx`: Atualizar navegação desktop/mobile para usar a nova estrutura de menu (sem Curve/Sale, apontando para `/`, `/roupas`, `/vestidos`).
- `src/app/produto/[id]/page.tsx`: Alinhar navegação desktop/mobile para a nova estrutura de menu.
- `docs/ARCHITECTURE.md`: Registrar as novas rotas (`/roupas` e `/vestidos`) na tabela de rotas do App Router.
- `docs/TASK_BOARD.md`: Atualizar status para Task #05 em progresso.

---

## Contratos e Interfaces

### Regra de Filtragem de Produtos:
```typescript
export function filtrarRoupas(produtos: Produto[]): Produto[] {
  // Retorna itens cuja categoria/nome NÃO seja vestido
  return produtos.filter(
    (p) => !p.nome.toLowerCase().includes("vestido")
  );
}

export function filtrarVestidos(produtos: Produto[]): Produto[] {
  // Retorna itens cujo nome/descrição represente vestido
  return produtos.filter(
    (p) => p.nome.toLowerCase().includes("vestido")
  );
}
```

### Estrutura de Navegação (Links):
- **Novidades:** `/` (ou `/#novidades`)
- **Roupas:** `/roupas`
- **Vestidos:** `/vestidos`
- Itens removidos: `Curve`, `Sale`

---

## Critérios de Aceite e Testes

1. **Menu Desktop e Mobile:**
   - Não devem mais existir links para "Curve" ou "Sale" no header desktop ou drawer mobile.
   - Os links presentes devem ser: "Novidades", "Roupas", "Vestidos", além do acesso à "Sacola".

2. **Página de Roupas (`/roupas`):**
   - Deve exibir a grade de produtos mantendo a mesma estilização da home (grid, tipografia, cards, badges de preço formatado).
   - Não deve conter vestidos (ex.: item ID 4 "vestido" filtrado para fora).
   - Se o catálogo retornar itens, deve listar apenas blazer, calça, camisa, etc.

3. **Página de Vestidos (`/vestidos`):**
   - Deve exibir a grade de produtos mantendo a mesma estilização da home.
   - Deve conter apenas itens identificados como vestidos (ex.: ID 4 "vestido").

4. **Tratamento de Contingência / Fallback:**
   - Ambas as páginas devem respeitar o fallback gracioso caso a API/backend não responda, exibindo os dados mockados correspondentes sem quebrar a tela.

5. **Suíte de Testes:**
   - Teste unitário cobrindo `filtrarRoupas` e `filtrarVestidos` com diferentes variações de nomes (maiúsculas/minúsculas).
   - Execução completa do `npm test` aprovada com zero falhas.
