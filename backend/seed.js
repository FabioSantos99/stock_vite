import "dotenv/config";
import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "./database.js";

const USERNAME = "admin";
const PASSWORD = "admin123";

const existing = await findUserByUsername(USERNAME);

if (existing) {
  console.log("Admin já existe.");
} else {
  const hashed = await bcrypt.hash(PASSWORD, 10);
  await createUser(USERNAME, hashed, "admin");
  console.log(`Admin criado! Username: ${USERNAME} / Password: ${PASSWORD}`);
}

process.exit(0);