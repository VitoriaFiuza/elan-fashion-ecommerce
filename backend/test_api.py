import json
import unittest
import shutil
import os

from app import app, DB_FILE

class TestProdutosAPI(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        # Backup the original database file if it exists
        self.backup_file = DB_FILE + ".bak"
        if os.path.exists(DB_FILE):
            shutil.copyfile(DB_FILE, self.backup_file)

    def tearDown(self):
        # Restore original database file
        if os.path.exists(self.backup_file):
            shutil.copyfile(self.backup_file, DB_FILE)
            os.remove(self.backup_file)

    def test_01_get_todos_produtos(self):
        response = self.client.get("/produtos")
        self.assertEqual(response.status_code, 200)
        dados = json.loads(response.data)
        self.assertIsInstance(dados, list)
        self.assertGreaterEqual(len(dados), 4)
        print("\n[OK] GET /produtos retornou", len(dados), "produtos:")
        for p in dados:
            print(f"  - ID: {p['id']} | Nome: {p['nome']} | R$ {p['valor']} | Imagens: {p.get('imagem')}")

    def test_02_get_produto_por_id(self):
        response = self.client.get("/produtos/1")
        self.assertEqual(response.status_code, 200)
        produto = json.loads(response.data)
        self.assertEqual(produto["nome"], "blazer")
        print("\n[OK] GET /produtos/1 retornou com sucesso:", produto)

        # Teste produto inexistente
        response_404 = self.client.get("/produtos/9999")
        self.assertEqual(response_404.status_code, 404)
        print("[OK] GET /produtos/9999 retornou 404 conforme esperado")

    def test_03_post_produto(self):
        novo = {
            "id": 5,
            "nome": "Saia Midi",
            "descricao": "Saia midi fluida em crepe acetinado",
            "valor": 320,
            "imagem": ["0005", "0006"],
            "tamanhos": [38, 40, 42]
        }
        response = self.client.post("/produtos", json=novo)
        self.assertEqual(response.status_code, 201)
        criado = json.loads(response.data)
        self.assertEqual(criado["id"], 5)
        self.assertEqual(criado["nome"], "Saia Midi")
        self.assertEqual(criado["tamanhos"], [38, 40, 42])
        print("\n[OK] POST /produtos criou produto com sucesso:", criado)

        # Validar persistência via GET
        response_get = self.client.get("/produtos/5")
        self.assertEqual(response_get.status_code, 200)

        # Testar duplicidade de ID
        response_dup = self.client.post("/produtos", json=novo)
        self.assertEqual(response_dup.status_code, 409)
        print("[OK] POST /produtos com ID duplicado retornou 409 conforme esperado")

    def test_04_put_produto(self):
        update_data = {
            "nome": "blazer alfaiataria premium",
            "valor": 349,
            "descricao": "Blazer de alfaiataria com corte impecável",
            "tamanhos": [40, 42, 44]
        }
        response = self.client.put("/produtos/1", json=update_data)
        self.assertEqual(response.status_code, 200)
        resultado = json.loads(response.data)
        self.assertEqual(resultado["produto"]["nome"], "blazer alfaiataria premium")
        self.assertEqual(resultado["produto"]["valor"], 349)
        self.assertEqual(resultado["produto"]["tamanhos"], [40, 42, 44])
        print("\n[OK] PUT /produtos/1 atualizou produto com sucesso:", resultado["produto"])

        # Teste produto inexistente no PUT
        response_404 = self.client.put("/produtos/9999", json=update_data)
        self.assertEqual(response_404.status_code, 404)
        print("[OK] PUT /produtos/9999 retornou 404 conforme esperado")

    def test_05_delete_produto(self):
        response = self.client.delete("/produtos/2")
        self.assertEqual(response.status_code, 200)
        resultado = json.loads(response.data)
        print("\n[OK] DELETE /produtos/2 retornou:", resultado["mensagem"])

        # Verificar se foi realmente deletado
        response_get = self.client.get("/produtos/2")
        self.assertEqual(response_get.status_code, 404)
        print("[OK] GET /produtos/2 após delete retornou 404 confirmando exclusão")

if __name__ == "__main__":
    unittest.main()
