import express from "express";
import cors from "cors";
import {
  getAllProducts,
  insertProduct,
  deleteProduct,
  updateProduct,
} from "./database.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ── GET /products — busca todos os produtos ───────────────────
app.get("/products", (req, res) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// ── POST /products — adiciona novo produto ────────────────────
app.post("/products", (req, res) => {
  const { name, price, quantity, type } = req.body;

  if (!name || !price || !quantity || !type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const id = insertProduct(name, parseFloat(price), parseInt(quantity), type);
    res.status(201).json({ id, name, price, quantity, type });
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar produto." });
  }
});

// ── DELETE /products/:id — remove produto por ID ─────────────
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  try {
    const result = deleteProduct(parseInt(id));
    if (result.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.status(200).json({ message: "Produto removido." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover produto." });
  }
});

// ── PUT /products/:id — atualiza produto por ID ───────────────
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, type } = req.body;

  if (!name || !price || !quantity || !type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const result = updateProduct(
      parseInt(id),
      name,
      parseFloat(price),
      parseInt(quantity),
      type
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.status(200).json({ id, name, price, quantity, type });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});