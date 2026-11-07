# Especificação Técnica: Reativação da Sacola e Parada no Pagamento

## 1. Objetivo da Tarefa
Reativar a funcionalidade completa da **Sacola de Compras** no fluxo da aplicação e configurar o fluxo para interromper/parar na etapa de **Pagamento** (checkout), conforme requisito do usuário:
1. Reativar o botão "Adicionar à sacola" na página de produto (`/produto/[id]`), integrando com o `CartContext` existente (`adicionarProduto`).
2. Exibir contador/badge de itens na sacola no cabeçalho ou feedback visual amigável após a adição.
3. Permitir visualizar a sacola (`/sacola`), editar quantidades, remover itens e calcular subtotal.
4. Seguir para a tela de finalização/checkout (`/checkout`), onde o fluxo deve parar no passo de pagamento demonstrando aviso claro de que o checkout/pagamento é o limite do fluxo e não realiza cobrança real.

## 2. Escopo de Arquivos
- **Modificados:**
  - `src/app/produto/[id]/page.tsx`: Conectar `useCart` (`adicionarProduto`), validar tamanho, adicionar item na sacola e redirecionar ou abrir feedback de sucesso para ir à `/sacola`.
  - `src/app/checkout/page.tsx`: Garantir que os dados do pedido sejam validados e a parada/aviso na etapa de pagamento esteja clara e funcional.
  - `docs/TASK_BOARD.md`: Atualizar status do quadro de tarefas.
- **Novos (se necessário para testes):**
  - `src/context/CartContext.test.mts` ou teste de integração do fluxo de sacola.

## 3. Contratos e Interfaces
### Estrutura do item adicionado à sacola (CartContext):
```typescript
interface ProdutoSacola {
  id: string; // ID do produto (ex: String(produto.id))
  nome: string;
  tamanho: string;
  preco: number;
  imagem: string; // URL da imagem principal (getProductImageUrl(produto.imagem[0]))
  quantidade: number;
}
```

### Operação de Adição (`src/app/produto/[id]/page.tsx`):
- `const { adicionarProduto, quantidadeTotal } = useCart();`
- Ao clicar em "Adicionar à sacola":
  - Se nenhum tamanho selecionado: exibir alerta/aviso inline solicitando escolha do tamanho.
  - Se tamanho selecionado:
    - Adicionar ao `CartContext` com dados do produto.
    - Exibir confirmação e permitir ir à `/sacola` ou prosseguir diretamente para a sacola.

### Parada no Próximo Passo (Pagamento):
- No checkout (`/checkout`): o fluxo culmina na seleção/exibição do pagamento ou na confirmação demonstrativa sem transação financeira real, informando com clareza o fechamento da jornada demonstrativa.

## 4. Critérios de Aceite
1. Na página de detalhes (`/produto/[id]`), o botão "Adicionar à sacola" adiciona o produto selecionado com o tamanho escolhido no `CartContext` (persistido no `localStorage`).
2. O contador de peças na sacola é atualizado no cabeçalho e na tela de `/sacola`.
3. Na página `/sacola`, todos os itens adicionados são listados com foto, nome, tamanho, preço unitário e totalizadores.
4. O botão "Finalizar compra" leva para `/checkout`.
5. No `/checkout`, o fluxo para na confirmação/pagamento de forma controlada e sem erros.
6. A suíte de testes automatizados (`npm test`) passa com 100% de sucesso.
