import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para futuras conexões com o frontend

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "produtos.json")

def carregar_produtos():
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def salvar_produtos(produtos):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(produtos, f, indent=2, ensure_ascii=False)

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "online",
        "endpoints": {
            "GET /produtos": "Lista todos os produtos",
            "GET /produtos/<id>": "Retorna detalhes de um produto específico",
            "POST /produtos": "Cadastra um novo produto (id, nome, descricao, valor, imagem, tamanhos)",
            "PUT /produtos/<id>": "Atualiza campos de um produto (nome, descricao, valor, tamanhos, imagem)",
            "DELETE /produtos/<id>": "Remove um produto pelo ID"
        }
    })

# GET /produtos - Retorna todos os produtos
@app.route("/produtos", methods=["GET"])
def listar_produtos():
    produtos = carregar_produtos()
    return jsonify(produtos), 200

# GET /produtos/<id> - Retorna um produto específico pelo ID
@app.route("/produtos/<id>", methods=["GET"])
def obter_produto(id):
    produtos = carregar_produtos()
    for produto in produtos:
        if str(produto.get("id")) == str(id):
            return jsonify(produto), 200
    return jsonify({"erro": "Produto não encontrado"}), 404

# POST /produtos - Cria um novo produto
@app.route("/produtos", methods=["POST"])
def criar_produto():
    dados = request.get_json(silent=True, force=True)
    if not dados:
        return jsonify({"erro": "O corpo da requisição deve ser um JSON válido"}), 400

    campos_obrigatorios = ["id", "nome", "descricao", "valor"]
    for campo in campos_obrigatorios:
        if campo not in dados:
            return jsonify({"erro": f"Campo obrigatório ausente: {campo}"}), 400

    produtos = carregar_produtos()
    id_novo = dados["id"]

    # Verifica se já existe um produto com o mesmo id
    if any(str(p.get("id")) == str(id_novo) for p in produtos):
        return jsonify({"erro": f"Já existe um produto cadastrado com o id {id_novo}"}), 409

    # Trata o campo imagem (pode vir como lista ou string separada por vírgula)
    imagens = dados.get("imagem", [])
    if isinstance(imagens, str):
        imagens = [img.strip() for img in imagens.split(",") if img.strip()]
    elif not isinstance(imagens, list):
        imagens = []

    # Trata o campo tamanhos (pode vir como 'tamanhos' ou 'tamanho')
    raw_tamanhos = dados.get("tamanhos", dados.get("tamanho", []))
    if isinstance(raw_tamanhos, str):
        raw_tamanhos = [t.strip() for t in raw_tamanhos.split(",") if t.strip()]
    elif not isinstance(raw_tamanhos, list):
        raw_tamanhos = []

    tamanhos = []
    for t in raw_tamanhos:
        try:
            tamanhos.append(int(t))
        except (ValueError, TypeError):
            tamanhos.append(t)

    # Converte ID para número se possível, mantendo tipagem consistente
    try:
        id_final = int(id_novo)
    except (ValueError, TypeError):
        id_final = id_novo

    # Converte valor para float/int
    try:
        valor_final = float(dados["valor"])
        if valor_final.is_integer():
            valor_final = int(valor_final)
    except (ValueError, TypeError):
        return jsonify({"erro": "O campo 'valor' deve ser numérico"}), 400

    novo_produto = {
        "id": id_final,
        "nome": str(dados["nome"]).strip(),
        "descricao": str(dados["descricao"]).strip(),
        "valor": valor_final,
        "imagem": imagens,
        "tamanhos": tamanhos
    }

    produtos.append(novo_produto)
    salvar_produtos(produtos)
    return jsonify(novo_produto), 201

# PUT /produtos/<id> - Atualiza os dados de um produto existente
@app.route("/produtos/<id>", methods=["PUT"])
def atualizar_produto(id):
    dados = request.get_json(silent=True, force=True)
    if not dados:
        return jsonify({"erro": "O corpo da requisição deve ser um JSON válido"}), 400

    produtos = carregar_produtos()
    produto_encontrado = None

    for p in produtos:
        if str(p.get("id")) == str(id):
            produto_encontrado = p
            break

    if not produto_encontrado:
        return jsonify({"erro": "Produto não encontrado"}), 404

    # Atualiza nome se informado
    if "nome" in dados:
        produto_encontrado["nome"] = str(dados["nome"]).strip()

    # Atualiza descricao se informada
    if "descricao" in dados:
        produto_encontrado["descricao"] = str(dados["descricao"]).strip()

    # Atualiza valor se informado
    if "valor" in dados:
        try:
            valor_final = float(dados["valor"])
            if valor_final.is_integer():
                valor_final = int(valor_final)
            produto_encontrado["valor"] = valor_final
        except (ValueError, TypeError):
            return jsonify({"erro": "O campo 'valor' deve ser numérico"}), 400

    # Atualiza tamanhos se informados
    if "tamanhos" in dados or "tamanho" in dados:
        raw_tamanhos = dados.get("tamanhos", dados.get("tamanho", []))
        if isinstance(raw_tamanhos, str):
            raw_tamanhos = [t.strip() for t in raw_tamanhos.split(",") if t.strip()]
        elif not isinstance(raw_tamanhos, list):
            raw_tamanhos = []

        tamanhos = []
        for t in raw_tamanhos:
            try:
                tamanhos.append(int(t))
            except (ValueError, TypeError):
                tamanhos.append(t)

        produto_encontrado["tamanhos"] = tamanhos

    # Atualiza imagens se informadas
    if "imagem" in dados:
        imagens = dados["imagem"]
        if isinstance(imagens, str):
            imagens = [img.strip() for img in imagens.split(",") if img.strip()]
        elif not isinstance(imagens, list):
            imagens = []
        produto_encontrado["imagem"] = imagens

    salvar_produtos(produtos)
    return jsonify({
        "mensagem": "Produto atualizado com sucesso",
        "produto": produto_encontrado
    }), 200

# DELETE /produtos/<id> - Remove um produto pelo ID
@app.route("/produtos/<id>", methods=["DELETE"])
def deletar_produto(id):
    produtos = carregar_produtos()
    produto_remover = None

    for produto in produtos:
        if str(produto.get("id")) == str(id):
            produto_remover = produto
            break

    if not produto_remover:
        return jsonify({"erro": "Produto não encontrado"}), 404

    produtos_atualizados = [p for p in produtos if str(p.get("id")) != str(id)]
    salvar_produtos(produtos_atualizados)

    return jsonify({
        "mensagem": "Produto removido com sucesso",
        "produto": produto_remover
    }), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
