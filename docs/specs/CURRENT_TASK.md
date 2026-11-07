# Especificação Técnica: Cálculo de Frete na Sacola (Task #06)

## Objetivo da Tarefa
Implementar o cálculo funcional de frete na página de sacola/carrinho (`src/app/sacola/page.tsx`), permitindo que o usuário digite um CEP válido (com máscara ou 8 dígitos), consulte o endereço/região e obtenha opções de frete simuladas baseadas em regras de negócio determinísticas (por região/UF ou faixa de CEP) e política de frete grátis para compras acima de R$ 400.
O usuário pode selecionar uma das opções de frete (ex: Normal / Expresso) e o valor selecionado deve ser somado dinamicamente ao valor total do resumo do pedido na sacola.

## Escopo de Arquivos
- **Criar:** `src/lib/frete.ts` (funções puras de cálculo, sanitização de CEP, regras de prazo e valor por UF/região, regras de frete grátis).
- **Criar:** `src/lib/frete.test.mts` (testes unitários com a suíte de testes do projeto).
- **Modificar:** `src/app/sacola/page.tsx` (interface com campo de CEP, botão/gatilho de cálculo, listagem de opções com radio/botão para seleção de frete, feedback de erro/carregamento, e atualização dinâmica do total no resumo do pedido).
- **Modificar:** `package.json` (incluir `src/lib/frete.test.mts` no script `test`).

## Contratos e Interfaces (`src/lib/frete.ts`)
```typescript
export interface OpcaoFrete {
  id: string; // 'economico' | 'expresso'
  nome: string; // 'Normal' | 'Expresso'
  prazoDias: number; // ex: 5
  valor: number; // ex: 25.00 (ou 0 se frete grátis elegível)
  gratis: boolean;
}

export interface ResultadoFrete {
  valido: boolean;
  uf?: string;
  cidade?: string;
  logradouro?: string;
  opcoes: OpcaoFrete[];
  erro?: string;
}

export function limparCep(cep: string): string;
export function formatarCep(cep: string): string;
export function calcularOpcoesFrete(uf: string, subtotal: number): OpcaoFrete[];
```

## Regras de Negócio do Frete
1. **Sanitização de CEP:** Somente dígitos, exatamente 8 caracteres numéricos para consulta válida.
2. **Tabela de Frete por Região:**
   - **Sudeste (SP, RJ, MG, ES):**
     - Normal: R$ 19,90 (prazo: 3 a 5 dias úteis)
     - Expresso: R$ 34,90 (prazo: 1 a 2 dias úteis)
   - **Sul (PR, SC, RS):**
     - Normal: R$ 24,90 (prazo: 4 a 6 dias úteis)
     - Expresso: R$ 39,90 (prazo: 2 a 3 dias úteis)
   - **Centro-Oeste (DF, GO, MT, MS):**
     - Normal: R$ 29,90 (prazo: 5 a 8 dias úteis)
     - Expresso: R$ 49,90 (prazo: 2 a 4 dias úteis)
   - **Nordeste (BA, PE, CE, RN, PB, AL, SE, PI, MA):**
     - Normal: R$ 34,90 (prazo: 6 a 10 dias úteis)
     - Expresso: R$ 59,90 (prazo: 3 a 5 dias úteis)
   - **Norte (AM, PA, AC, RO, RR, AP, TO):**
     - Normal: R$ 44,90 (prazo: 8 a 14 dias úteis)
     - Expresso: R$ 69,90 (prazo: 4 a 7 dias úteis)
   - **Demais / Desconhecido:**
     - Normal: R$ 29,90 (prazo: 7 dias úteis)
     - Expresso: R$ 49,90 (prazo: 3 dias úteis)
3. **Frete Grátis:** Subtotal a partir de R$ 400,00 concede frete grátis na modalidade Normal (R$ 0,00). A opção Expresso permanece paga com seu valor padrão.
4. **Comportamento na Sacola:**
   - Se nenhuma opção de frete foi calculada/selecionada: Frete exibido como "A calcular", Subtotal e Total são iguais.
   - Ao calcular o frete com CEP válido: seleciona por padrão a modalidade "Normal" (mais econômica ou grátis).
   - O usuário pode alternar entre "Normal" e "Expresso".
   - O Total a pagar no Resumo do Pedido reflete Subtotal + Frete selecionado.
   - O botão "Finalizar compra" continua levando ao checkout.

## Critérios de Aceite e Testes
1. `limparCep` e `formatarCep` formatam e higienizam entradas numéricas e com máscara.
2. `calcularOpcoesFrete` calcula valores e prazos corretos para diferentes UFs (ex: SP no Sudeste, RS no Sul, BA no Nordeste, etc.).
3. `calcularOpcoesFrete` zera o frete normal quando subtotal >= 400 (frete grátis), mas mantém expresso pago.
4. A UI da sacola permite digitar CEP, exibe indicador de carregamento e mensagens de erro caso o CEP seja inválido ou não encontrado.
5. A UI da sacola atualiza dinamicamente o valor do frete e o total final quando uma opção de frete é escolhida.
