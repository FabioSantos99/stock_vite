import "dotenv/config";
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
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
 

// ── POST /auth/login ──────────────────────────────────────────
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password são obrigatórios." });
  }

  const user = await findUserByUsername(username);

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

// ── GET /products ─────────────────────────────────────────────
app.get("/products", authenticate, async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// ── POST /products ────────────────────────────────────────────
app.post("/products", authenticate, async (req, res) => {
  const { name, price, quantity, type } = req.body;

  if (!name || !price || !quantity || !type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const id = await insertProduct(name, parseFloat(price), parseInt(quantity), type);
    res.status(201).json({ id, name, price, quantity, type });
  } catch {
    res.status(500).json({ error: "Erro ao salvar produto." });
  }
});

// ── PUT /products/:id ─────────────────────────────────────────
app.put("/products/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, type } = req.body;

  if (!name || !price || !quantity || !type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const rowCount = await updateProduct(parseInt(id), name, parseFloat(price), parseInt(quantity), type);
    if (rowCount === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ id, name, price, quantity, type });
  } catch {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

// ── DELETE /products/:id — apenas admin ───────────────────────
app.delete("/products/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const rowCount = await deleteProduct(parseInt(id));
    if (rowCount === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ message: "Produto removido." });
  } catch {
    res.status(500).json({ error: "Erro ao remover produto." });
  }
});

// ── GET /users — apenas admin ─────────────────────────────────
app.get("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// ── POST /users — apenas admin ────────────────────────────────
app.post("/users", authenticate, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Username, password e role são obrigatórios." });
  }

  if (!["admin", "operator"].includes(role)) {
    return res.status(400).json({ error: "Role inválido. Use: admin ou operator." });
  }

  const existing = await findUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: "Username já existe." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const id     = await createUser(username, hashed, role);
    res.status(201).json({ id, username, role });
  } catch {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// ── DELETE /users/:id — apenas admin ─────────────────────────
app.delete("/users/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const rowCount = await deleteUser(parseInt(id));
    if (rowCount === 0) {
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