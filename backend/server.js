import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getAllProducts,
  insertProduct,
  deleteProduct,
  updateProduct,
  createUser,
  findUserByUsername,
  getAllUsers,
  deleteUser,
} from "./database.js";
import { authenticate, isAdmin, JWT_SECRET } from "./auth.js";

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ── POST /auth/login ──────────────────────────────────────────
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password são obrigatórios." });
  }

  const user = findUserByUsername(username);

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, role: user.role, username: user.username });
});

// ── GET /products — todos podem ver ──────────────────────────
app.get("/products", authenticate, (req, res) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// ── POST /products — admin e operator podem adicionar ─────────
app.post("/products", authenticate, (req, res) => {
  const { name, price, quantity, type } = req.body;

  if (!name || !price || !quantity || !type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const id = insertProduct(name, parseFloat(price), parseInt(quantity), type);
    res.status(201).json({ id, name, price, quantity, type });
  } catch {
    res.status(500).json({ error: "Erro ao salvar produto." });
  }
});

// ── PUT /products/:id — admin e operator podem editar ─────────
app.put("/products/:id", authenticate, (req, res) => {
  const { id }                    = req.params;
  const { name, price, quantity, type } = req.body;

  if (!name || !price || !quantity || !type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const result = updateProduct(parseInt(id), name, parseFloat(price), parseInt(quantity), type);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ id, name, price, quantity, type });
  } catch {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

// ── DELETE /products/:id — apenas admin pode deletar ──────────
app.delete("/products/:id", authenticate, isAdmin, (req, res) => {
  const { id } = req.params;

  try {
    const result = deleteProduct(parseInt(id));
    if (result.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ message: "Produto removido." });
  } catch {
    res.status(500).json({ error: "Erro ao remover produto." });
  }
});

// ── GET /users — apenas admin pode listar usuários ────────────
app.get("/users", authenticate, isAdmin, (req, res) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// ── POST /users — apenas admin pode criar usuários ────────────
app.post("/users", authenticate, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Username, password e role são obrigatórios." });
  }

  if (!["admin", "operator"].includes(role)) {
    return res.status(400).json({ error: "Role inválido. Use: admin ou operator." });
  }

  const existing = findUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: "Username já existe." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const id     = createUser(username, hashed, role);
    res.status(201).json({ id, username, role });
  } catch {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// ── DELETE /users/:id — apenas admin pode deletar usuários ────
app.delete("/users/:id", authenticate, isAdmin, (req, res) => {
  const { id } = req.params;

  try {
    const result = deleteUser(parseInt(id));
    if (result.changes === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário removido." });
  } catch {
    res.status(500).json({ error: "Erro ao remover usuário." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});