# Pipeline de Subagentes - Fábrica autônoma

Quando o usuário solicitar o comando `/run-feature [descrição]`, execute a cadeia de subagentes:

1. **Subagente Orquestrador (`.antigravity/rules/orchestrator.md`):**
   - Analise o pedido do usuário e leia `docs/ARCHITECTURE.md`.
   - Gere `docs/specs/CURRENT_TASK.md` e atualize `docs/TASK_BOARD.md`.

2. **Subagente Dev Creator (`.antigravity/rules/creator.md`):**
   - Verifique o `.gitignore`.
   - Escreva a implementação técnica e os testes unitários associados.

3. **Subagente Dev Reviewer (`.antigravity/rules/reviewer.md`):**
   - Execute a suíte de testes no terminal do sandbox.
   - **Se aprovado:** Atualize o `README.md` e faça o commit/push no Git.
   - **Se rejeitado:** Registre os logs em `docs/specs/REVIEW_FEEDBACK.md` e invoque o Orquestrador para reajuste.