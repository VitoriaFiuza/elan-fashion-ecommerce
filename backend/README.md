# Backend Flask - API de Produtos

Backend REST em Python utilizando Flask e persistência de dados em arquivo JSON local.

## 📁 Estrutura de Arquivos

- `app.py`: Servidor Flask com as rotas de GET, POST e DELETE, validações e suporte a CORS.
- `produtos.json`: Banco de dados local em formato JSON.
- `test_api.py`: Suíte de testes automatizados unitários para validação de todas as rotas.
- `requirements.txt`: Dependências do projeto (`flask`, `flask-cors`).

---

## 🚀 Como Executar

1. Instalar as dependências:
   ```bash
   pip install -r requirements.txt
   ```

2. Iniciar o servidor:
   ```bash
   python app.py
   ```
   O servidor estará ativo em: `http://127.0.0.1:5000`

3. Executar os testes automatizados:
   ```bash
   python test_api.py
   ```

---

## 📌 Endpoints da API

### 1. `GET /produtos`
Retorna todos os produtos cadastrados.
- **Resposta**: `200 OK` (Array de objetos)

### 2. `GET /produtos/<id>`
Retorna os detalhes de um produto específico.
- **Resposta Sucesso**: `200 OK`
- **Resposta Erro**: `404 Not Found` se o produto não existir.

### 3. `POST /produtos`
Cadastra um novo produto.
- **Corpo da Requisição (JSON)**:
  ```json
  {
    "id": 5,
    "nome": "Saia Midi",
    "descricao": "Saia midi fluida",
    "valor": 320,
    "imagem": ["0005", "0006"]
  }
  ```
- **Campos obrigatórios**: `id`, `nome`, `descricao`, `valor`.
- `imagem` pode ser uma lista (ex: `["0003", "0004"]` ou `[]`) ou omitido.
- **Resposta Sucesso**: `201 Created`
- **Resposta Erro**: `400 Bad Request` (campos faltando) ou `409 Conflict` (id já existente).

### 4. `PUT /produtos/<id>`
Atualiza os dados de um produto existente pelo ID (pode alterar `nome`, `descricao`, `valor`, `tamanhos`, `imagem`).
- **Corpo da Requisição (JSON)** (todos os campos são opcionais, envie apenas o que deseja atualizar):
  ```json
  {
    "nome": "blazer alfaiataria premium",
    "valor": 349,
    "descricao": "Nova descrição",
    "tamanhos": [40, 42, 44]
  }
  ```
- **Resposta Sucesso**: `200 OK`
- **Resposta Erro**: `404 Not Found` se o produto não existir.

### 5. `DELETE /produtos/<id>`
Remove um produto pelo ID.
- **Resposta Sucesso**: `200 OK` (confirmação e dados do produto removido)
- **Resposta Erro**: `404 Not Found` se o produto não existir.
