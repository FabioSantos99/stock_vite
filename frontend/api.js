const BASE_URL = "http://localhost:3000";

// Envia o token JWT em toda requisição
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Se receber 401 limpa o localStorage e redireciona para login
const handleUnauthorized = (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "login.html";
  }
};

export const getAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, { headers: authHeaders() });
  handleUnauthorized(res);
  if (!res.ok) throw new Error("Erro ao buscar produtos.");
  return res.json();
};

export const saveProduct = async ({ name, price, quantity, type }) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method:  "POST",
    headers: authHeaders(),
    body:    JSON.stringify({ name, price, quantity, type }),
  });
  handleUnauthorized(res);
  if (!res.ok) throw new Error("Erro ao salvar produto.");
  return res.json();
};

export const removeProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method:  "DELETE",
    headers: authHeaders(),
  });
  handleUnauthorized(res);
  if (res.status === 403) throw new Error("Apenas admins podem deletar produtos.");
  if (!res.ok) throw new Error("Erro ao remover produto.");
};

export const updateProduct = async (id, { name, price, quantity, type }) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method:  "PUT",
    headers: authHeaders(),
    body:    JSON.stringify({ name, price, quantity, type }),
  });
  handleUnauthorized(res);
  if (!res.ok) throw new Error("Erro ao atualizar produto.");
  return res.json();
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  window.location.href = "login.html";
};

// Exportar CSV
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

  const element    = document.createElement("a");
  element.href     = "data:text/csv;charset=utf-8," + encodeURI(csvString);
  element.target   = "_blank";
  element.download = "products.csv";
  element.click();
};

// Só registra o listener se o botão existir (não existe na página de login)
const exportBtn = document.querySelector("#export");
if (exportBtn) {
  exportBtn.addEventListener("click", () => exportData());
}