import * as XLSX from "xlsx";
import { saveProduct } from "./api.js";
import { putProducts } from "./addProducts.js";

const importBtn = document.querySelector("#import");
const importInput = document.querySelector("#import-input");

// Campos aceitos no arquivo — mapeia variações de nome para o padrão interno
const FIELD_MAP = {
  name: ["name", "nome", "produto", "product"],
  price: ["price", "preco", "preço", "valor"],
  quantity: ["quantity", "quantidade", "qtd", "qty"],
  type: ["type", "tipo", "categoria", "category"],
};

const VALID_TYPES = ["phone", "console", "computer", "tv"];

importBtn.addEventListener("click", () => importInput.click());

importInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const rows = await parseFile(file);

    if (rows.length === 0) {
      alert("Nenhum produto encontrado no arquivo.");
      return;
    }

    const { valid, invalid } = validateRows(rows);

    if (invalid.length > 0) {
      const lines = invalid.map((r) => `Linha ${r.line}: ${r.reason}`).join("\n");
      alert(`${invalid.length} linha(s) ignorada(s):\n\n${lines}`);
    }

    if (valid.length === 0) {
      alert("Nenhum produto válido para importar.");
      return;
    }

    // Salva cada produto no banco e renderiza na tabela
    let imported = 0;
    for (const row of valid) {
      try {
        const saved = await saveProduct(row);
        putProducts(saved.name, saved.price, saved.quantity, saved.type, saved.id);
        imported++;
      } catch {
        console.error("Erro ao salvar produto:", row);
      }
    }

    alert(`${imported} produto(s) importado(s) com sucesso!`);

  } catch (err) {
    alert("Erro ao ler o arquivo. Verifique se é um Excel ou CSV válido.");
    console.error(err);
  }

  // Limpa o input para permitir importar o mesmo arquivo novamente
  importInput.value = "";
});

// ── Lê o arquivo e retorna array de objetos ───────────────────
const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo."));
    reader.readAsArrayBuffer(file);
  });
};

// ── Normaliza os nomes das colunas usando o FIELD_MAP ─────────
const normalizeRow = (row) => {
  const normalized = {};
  const keys = Object.keys(row).map((k) => k.toLowerCase().trim());

  for (const [field, aliases] of Object.entries(FIELD_MAP)) {
    const match = keys.find((k) => aliases.includes(k));
    if (match) {
      // Pega o valor usando a chave original
      const originalKey = Object.keys(row).find(
        (k) => k.toLowerCase().trim() === match
      );
      normalized[field] = String(row[originalKey]).trim();
    }
  }

  return normalized;
};

// ── Valida cada linha e separa válidas de inválidas ───────────
const validateRows = (rows) => {
  const valid = [];
  const invalid = [];

  rows.forEach((row, index) => {
    const line = index + 2; // linha 1 é o cabeçalho
    const r = normalizeRow(row);

    if (!r.name) {
      invalid.push({ line, reason: "Nome ausente" });
      return;
    }

    if (!r.price || isNaN(parseFloat(r.price)) || parseFloat(r.price) < 0) {
      invalid.push({ line, reason: `Preço inválido (${r.price})` });
      return;
    }

    if (!r.quantity || !Number.isInteger(Number(r.quantity)) || Number(r.quantity) < 0) {
      invalid.push({ line, reason: `Quantidade inválida (${r.quantity})` });
      return;
    }

    if (!r.type || !VALID_TYPES.includes(r.type.toLowerCase())) {
      invalid.push({ line, reason: `Tipo inválido (${r.type}) — use: ${VALID_TYPES.join(", ")}` });
      return;
    }

    valid.push({
      name: r.name,
      price: parseFloat(r.price).toFixed(2),
      quantity: r.quantity,
      type: r.type.toLowerCase(),
    });
  });

  return { valid, invalid };
};