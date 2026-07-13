import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "./database.js";

const USERNAME = "adminso";
const PASSWORD = "paralindos@@2022";

const existing = findUserByUsername(USERNAME);

if(existing) {
    console.log("Admin já existe.");
} else {
    const hashed = await bcrypt.hash(PASSWORD, 10)
    createUser(USERNAME, hashed, "admin");
    console.log(`Admin criado com sucesso!`);
    console.log(`Username: ${USERNAME}`);
    console.log(`Password: ${PASSWORD}`);
}