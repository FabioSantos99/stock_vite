const BASE_URL = "http://localhost:3000";

// ── Buscar todos os produtos ──────────────────────────────────
export const getAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Erro ao buscar produtos.");
  return res.json();
};

// ── Salvar produto ────────────────────────────────────────────
export const saveProduct = async ({ name, price, quantity, type }) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, quantity, type }),
  });
  if (!res.ok) throw new Error("Erro ao salvar produto.");
  return res.json(); // retorna { id, name, price, quantity, type }
};

// ── Remover produto ───────────────────────────────────────────
export const removeProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao remover produto.");
};

// ── Atualizar produto ─────────────────────────────────────────
export const updateProduct = async (id, { name, price, quantity, type }) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, quantity, type }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar produto.");
  return res.json();
};

// ── Exportar CSV ──────────────────────────────────────────────
const sanitizeCsvValue = (value) => {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportData = async () => {
  const products = await getAllProducts();

  const csvString = [
    ["Name", "Price", "Quantity", "Type"],
    ...products.map((p) => [p.name, p.price, p.quantity, p.type]),
  ]
    .map((row) => row.map(sanitizeCsvValue).join(","))
    .join("\n");

  const element = document.createElement("a");
  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
  element.target = "_blank";
  element.download = "products.csv";
  element.click();
};

const exportBtn = document.querySelector("#export");
exportBtn.addEventListener("click", () => exportData());