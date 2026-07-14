// Script para criar o primeiro admin
// Rode uma vez: node seed.js

import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "./database.js";

const USERNAME = "admin";
const PASSWORD = "admin123"; // troque para uma senha forte

const existing = findUserByUsername(USERNAME);

if (existing) {
  console.log("Admin já existe.");
} else {
  const hashed = await bcrypt.hash(PASSWORD, 10);
  createUser(USERNAME, hashed, "admin");
  console.log(`Admin criado com sucesso!`);
  console.log(`Username: ${USERNAME}`);
  console.log(`Password: ${PASSWORD}`);
}