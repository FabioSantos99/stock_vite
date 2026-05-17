import { describe, it, expect, beforeEach, afterAll } from "vitest";
import Database from "better-sqlite3";

// ── Cria um banco em memória só para testes ───────────────────
// Assim os testes não afetam o stock.db real
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    price     REAL    NOT NULL,
    quantity  INTEGER NOT NULL,
    type      TEXT    NOT NULL
  )
`);

// Recria as funções apontando para o banco de teste
const getAllProducts = () => {
  return db.prepare("SELECT * FROM products").all();
};

const insertProduct = (name, price, quantity, type) => {
  const stmt = db.prepare(
    "INSERT INTO products (name, price, quantity, type) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(name, price, quantity, type);
  return result.lastInsertRowid;
};

const deleteProduct = (id) => {
  return db.prepare("DELETE FROM products WHERE id = ?").run(id);
};

const updateProduct = (id, name, price, quantity, type) => {
  return db
    .prepare(
      "UPDATE products SET name = ?, price = ?, quantity = ?, type = ? WHERE id = ?"
    )
    .run(name, price, quantity, type, id);
};

// ── Limpa a tabela antes de cada teste ───────────────────────
beforeEach(() => {
  db.prepare("DELETE FROM products").run();
});

// ── Fecha o banco após todos os testes ────────────────────────
afterAll(() => {
  db.close();
});

// ─────────────────────────────────────────────────────────────
describe("insertProduct", () => {
  it("deve inserir um produto e retornar o ID gerado", () => {
    const id = insertProduct("PS5", 4500, 10, "console");
    expect(id).toBe(1);
  });

  it("deve inserir múltiplos produtos com IDs diferentes", () => {
    const id1 = insertProduct("PS5", 4500, 10, "console");
    const id2 = insertProduct("iPhone 15", 5999, 5, "phone");
    expect(id1).not.toBe(id2);
  });
});

// ─────────────────────────────────────────────────────────────
describe("getAllProducts", () => {
  it("deve retornar array vazio quando não há produtos", () => {
    const products = getAllProducts();
    expect(products).toEqual([]);
  });

  it("deve retornar todos os produtos inseridos", () => {
    insertProduct("PS5", 4500, 10, "console");
    insertProduct("iPhone 15", 5999, 5, "phone");

    const products = getAllProducts();
    expect(products).toHaveLength(2);
  });

  it("deve retornar os dados corretos do produto", () => {
    insertProduct("MacBook", 8999, 3, "computer");

    const products = getAllProducts();
    const product  = products[0];

    expect(product.name).toBe("MacBook");
    expect(product.price).toBe(8999);
    expect(product.quantity).toBe(3);
    expect(product.type).toBe("computer");
  });
});

// ─────────────────────────────────────────────────────────────
describe("deleteProduct", () => {
  it("deve remover o produto do banco", () => {
    const id = insertProduct("PS5", 4500, 10, "console");
    deleteProduct(id);

    const products = getAllProducts();
    expect(products).toHaveLength(0);
  });

  it("deve retornar changes=0 quando o ID não existe", () => {
    const result = deleteProduct(999);
    expect(result.changes).toBe(0);
  });

  it("deve remover apenas o produto correto", () => {
    const id1 = insertProduct("PS5", 4500, 10, "console");
    insertProduct("iPhone 15", 5999, 5, "phone");

    deleteProduct(id1);

    const products = getAllProducts();
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe("iPhone 15");
  });
});

// ─────────────────────────────────────────────────────────────
describe("updateProduct", () => {
  it("deve atualizar os dados do produto", () => {
    const id = insertProduct("PS4", 1200, 5, "console");
    updateProduct(id, "PS5", 4500, 10, "console");

    const products = getAllProducts();
    const product  = products[0];

    expect(product.name).toBe("PS5");
    expect(product.price).toBe(4500);
    expect(product.quantity).toBe(10);
  });

  it("deve retornar changes=1 quando atualiza com sucesso", () => {
    const id     = insertProduct("PS4", 1200, 5, "console");
    const result = updateProduct(id, "PS5", 4500, 10, "console");
    expect(result.changes).toBe(1);
  });

  it("deve retornar changes=0 quando o ID não existe", () => {
    const result = updateProduct(999, "PS5", 4500, 10, "console");
    expect(result.changes).toBe(0);
  });

  it("não deve afetar outros produtos ao atualizar", () => {
    const id1 = insertProduct("PS4", 1200, 5, "console");
    insertProduct("iPhone 15", 5999, 5, "phone");

    updateProduct(id1, "PS5", 4500, 10, "console");

    const products = getAllProducts();
    expect(products[1].name).toBe("iPhone 15");
  });
});