import Database from "better-sqlite3";

const db = new Database("stock.db");


const tableExists = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='users'`)
    .get();

if (tableExists) {
    console.log("Tablea users já existe. Nada a fazer.");
} else {
    db.exec(`
        CREATE TABLE users (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        username  TEXT    NOT NULL UNIQUE,
        password  TEXT    NOT NULL,
        role      TEXT    NOT NULL DEFAULT 'operator' CHECK(role IN ('admin', 'operator'))
        )
    `);
    console.log("Tabela users criada com sucesso!");
}

// Mostra as tabelas existentes para confirmar
const tables = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
    .all();

console.log("Tabelas no banco:", tables.map((t) => t.name).join(", "));

db.close();