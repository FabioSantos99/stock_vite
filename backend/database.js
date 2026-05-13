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

// Queries

export const getAllProducts = () => {
    return db.prepare("SELECT * FROM products").all();
};

export const insertProduct = (name, price, quantity, type) => {
    const stmt = db.prepare(
        "INSERT INTO products (name, price, quantity, type) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(name, price, quantity, type);
    return result.lastInsertRowid;
};

export const deleteProduct = (id) => {
    return db.prepare("DELETE FROM products WHERE id = ?").run(id);
};

export const updateProduct = (id, name, price, quantity, type) => {
    return db.prepare( "UPDATE products SET name = ?, price = ?, quantity = ?, type = ? WHERE id = ?").run(name, price, quantity, type, id);
}