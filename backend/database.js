import Database from "better-sqlite3";

const db = new Database("stock.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    price     REAL    NOT NULL,
    quantity  INTEGER NOT NULL,
    type      TEXT    NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    role      TEXT    NOT NULL DEFAULT 'operator' CHECK(role IN ('admin', 'operator'))
  )
`);

// ── Products ──────────────────────────────────────────────────

export const getAllProducts = () => {
  return db.prepare("SELECT * FROM products").all();
};

export const insertProduct = (name, price, quantity, type) => {
  const stmt   = db.prepare(
    "INSERT INTO products (name, price, quantity, type) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(name, price, quantity, type);
  return result.lastInsertRowid;
};

export const deleteProduct = (id) => {
  return db.prepare("DELETE FROM products WHERE id = ?").run(id);
};

export const updateProduct = (id, name, price, quantity, type) => {
  return db
    .prepare(
      "UPDATE products SET name = ?, price = ?, quantity = ?, type = ? WHERE id = ?"
    )
    .run(name, price, quantity, type, id);
};

// ── Users ─────────────────────────────────────────────────────

export const createUser = (username, hashedPassword, role) => {
  const stmt   = db.prepare(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
  );
  const result = stmt.run(username, hashedPassword, role);
  return result.lastInsertRowid;
};

export const findUserByUsername = (username) => {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
};

export const getAllUsers = () => {
  return db.prepare("SELECT id, username, role FROM users").all();
};

export const deleteUser = (id) => {
  return db.prepare("DELETE FROM users WHERE id = ?").run(id);
};