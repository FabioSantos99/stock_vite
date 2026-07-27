import "dotenv/config";

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
  ? { rejectUnauthorized: false }
  : false,
});

// Cria as tabelas se nao existirem

const initDB = async () => {
  await pool.query(`
     CREATE TABLE IF NOT EXISTS products (
      id        SERIAL PRIMARY KEY,
      name      TEXT    NOT NULL,
      price     NUMERIC NOT NULL,
      quantity  INTEGER NOT NULL,
      type      TEXT    NOT NULL
    )
  `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      username  TEXT    NOT NULL UNIQUE,
      password  TEXT    NOT NULL,
      role      TEXT    NOT NULL DEFAULT 'operator'
                CHECK(role IN ('admin', 'operator'))
    )
  `);

  console.log("Banco de dados pronto.");
};

initDB();

// ── Products ──────────────────────────────────────────────────

export const getAllProducts = async () => {

  const result = await pool.query("SELECT * FROM products ORDER BY id");
  return result.rows;

};

export const insertProduct = async (name, price, quantity, type) => {
  const result   = await pool.query(
    "INSERT INTO products (name, price, quantity, type) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, price, quantity, type]
  );

  return result.rows[0].id;
};

export const deleteProduct = async (id) => {
  const result =  await pool.query("DELETE FROM products WHERE id = $1",
    [id]
  );
  return result.rowCount;
};

export const updateProduct = async (id, name, price, quantity, type) => {
  return db
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, quantity = $3, type = $3 WHERE id = $5",
      [name, price, quantity, type, id]
    );
    return result.rowCount;
};

// ── Users ─────────────────────────────────────────────────────

export const createUser = async (username, hashedPassword, role) => {
   const result = await pool.query(
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
    [username, hashedPassword, role]
  );
    return result.rows[0].id;
};

export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
};

export const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, username, role FROM users ORDER BY id"
  );
  return result.rows;
};

export const deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1",
    [id]
  );
  return result.rowCount;
};