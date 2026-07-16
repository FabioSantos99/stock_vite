# Electronics Stock Controller

Sistema de controle de estoque com autenticação, níveis de acesso e importação de arquivos.

---

## Tecnologias

**Backend**
- Node.js
- Express
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcrypt
- Vitest (testes)

**Frontend**
- HTML, CSS, JavaScript (Vanilla)
- Vite
- SheetJS (importação Excel/CSV)

---

## Estrutura do projeto

```
stock_controller/
├── backend/
│   ├── auth.js            ← middlewares de autenticação
│   ├── database.js        ← tabelas e queries SQLite
│   ├── server.js          ← rotas da API Express
│   ├── seed.js            ← cria o primeiro admin
│   ├── migrate.js         ← migração do banco de dados
│   ├── database.test.js   ← testes automatizados
│   └── package.json
└── frontend/
    ├── index.html         ← página principal (inventário)
    ├── login.html         ← página de login
    ├── users.html         ← página de gerenciamento de usuários
    ├── style.css          ← estilos globais
    ├── main.js            ← inicialização
    ├── authGuard.js       ← proteção de rotas
    ├── login.js           ← lógica do login
    ├── users.js           ← lógica de gerenciamento de usuários
    ├── api.js             ← todas as chamadas HTTP
    ├── addProducts.js     ← adicionar produtos
    ├── editProducts.js    ← editar e deletar produtos
    ├── loadProducts.js    ← carregar produtos ao iniciar
    ├── filter.js          ← filtro por tipo
    ├── search.js          ← busca por nome
    ├── theme.js           ← toggle tema claro/escuro
    └── importProducts.js  ← importar Excel/CSV
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- npm

Verifique se estão instalados:

```bash
node -v
npm -v
```

---

## Instalação e configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/stock-controller.git
cd stock-controller
```

### 2. Configure o backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

### 3. Crie o banco de dados

Se for a **primeira vez** rodando o projeto:

```bash
node migrate.js
```

Resultado esperado:
```
Tabela users criada com sucesso!
Tabelas no banco: products, users
```

### 4. Crie o primeiro admin

```bash
node seed.js
```

Resultado esperado:
```
Admin criado! Username: admin / Password: admin123
```

> **Importante:** troque a senha do admin após o primeiro login.

### 5. Inicie o servidor backend

```bash
npm run dev
```

Resultado esperado:
```
Servidor rodando em http://localhost:3000
```

### 6. Configure o frontend

Abra um **novo terminal** e entre na pasta do frontend:

```bash
cd frontend
npm install
npm run dev
```

O Vite vai abrir o frontend em:
```
http://localhost:5173
```

---

## Como usar

### Login

Acesse `http://localhost:5173` e faça login com as credenciais do admin:

```
Username: admin
Password: admin123
```

### Níveis de acesso

| Ação | Admin | Operator |
|------|-------|----------|
| Ver produtos | ✅ | ✅ |
| Adicionar produto | ✅ | ✅ |
| Editar produto | ✅ | ✅ |
| Deletar produto | ✅ | ❌ |
| Gerenciar usuários | ✅ | ❌ |

### Criar operadores

1. Logue como admin
2. Clique no botão **Users** no header
3. Preencha username, password e selecione o role **Operator**
4. Clique em **Add User**

### Importar produtos via Excel ou CSV

O arquivo precisa ter as colunas na primeira linha:

```
name, price, quantity, type
```

Valores aceitos para `type`: `phone`, `console`, `computer`, `tv`

Exemplo de CSV:
```csv
name,price,quantity,type
PS5,4500,10,console
iPhone 15,5999,5,phone
MacBook,8999,3,computer
Samsung TV,3500,7,tv
```

1. Clique no botão **Import** no header
2. Selecione o arquivo `.xlsx`, `.xls` ou `.csv`
3. Os produtos válidos são importados automaticamente
4. Linhas inválidas são reportadas sem travar a importação

### Exportar produtos

Clique no botão **Export CSV** para baixar todos os produtos em formato CSV.

---

## Rotas da API

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/auth/login` | Público | Faz login e retorna token JWT |
| GET | `/products` | Todos | Lista todos os produtos |
| POST | `/products` | Todos | Cria novo produto |
| PUT | `/products/:id` | Todos | Atualiza produto |
| DELETE | `/products/:id` | Admin | Remove produto |
| GET | `/users` | Admin | Lista todos os usuários |
| POST | `/users` | Admin | Cria novo usuário |
| DELETE | `/users/:id` | Admin | Remove usuário |

---

## Testes

Os testes cobrem todas as funções do banco de dados (`database.js`).

Para rodar:

```bash
cd backend
npm run test
```

Resultado esperado:
```
database.test.js (12 tests)
  ✓ insertProduct (2)
  ✓ getAllProducts (3)
  ✓ deleteProduct (3)
  ✓ updateProduct (4)

Tests  12 passed (12)
```

---

## Rodar os dois servidores sempre

Toda vez que for trabalhar no projeto, abra **dois terminais**:

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

---

## Problemas comuns

**"Servidor indisponível" no login**
→ O backend não está rodando. Verifique se rodou `npm run dev` na pasta `backend`.

**Produtos não carregam**
→ Verifique se o token está salvo no localStorage (F12 → Application → Local Storage).

**"no such table: users"**
→ Rode `node migrate.js` dentro da pasta `backend`.

**"Admin já existe" ao rodar seed.js**
→ O admin já foi criado. Pode fazer login normalmente.
