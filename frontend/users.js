import { logout } from "./api.js";

const BASE_URL  = "http://localhost:3000";
const token     = localStorage.getItem("token");
const role      = localStorage.getItem("role");
const username  = localStorage.getItem("username");

// Protege a página — só admin pode acessar
if (!token) {
  window.location.href = "login.html";
} else if (role !== "admin") {
  alert("Acesso negado. Apenas admins.");
  window.location.href = "index.html";
}

// Mostra usuário logado
const userInfo = document.querySelector("#user-info");
if (userInfo) userInfo.textContent = `${username} (${role})`;

// Logout
const logoutBtn = document.querySelector("#logout-btn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// ── Carregar usuários ─────────────────────────────────────────
const loadUsers = async () => {
  try {
    const res   = await fetch(`${BASE_URL}/users`, { headers: authHeaders() });
    const users = await res.json();
    renderUsers(users);
  } catch {
    console.error("Erro ao carregar usuários.");
  }
};

// ── Renderizar tabela ─────────────────────────────────────────
const renderUsers = (users) => {
  const list = document.querySelector("#user-list");
  list.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.dataset.id = user.id;

    tr.innerHTML = `
      <td>${user.username}</td>
      <td style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">
        ${user.role}
      </td>
      <td style="text-align: center;">
        <button type="button" class="delete-item delete-user">Delete</button>
      </td>
    `;

    list.appendChild(tr);
  });
};

// ── Criar usuário ─────────────────────────────────────────────
const userForm = document.querySelector("#user-form");

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newUsername = document.querySelector("#new-username").value.trim();
  const newPassword = document.querySelector("#new-password").value.trim();
  const newRole     = document.querySelector("#new-role").value;

  if (!newUsername || !newPassword || !newRole) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const res  = await fetch(`${BASE_URL}/users`, {
      method:  "POST",
      headers: authHeaders(),
      body:    JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao criar usuário.");
      return;
    }

    // Limpa o formulário e recarrega a lista
    document.querySelector("#new-username").value = "";
    document.querySelector("#new-password").value = "";
    document.querySelector("#new-role").value      = "";

    await loadUsers();
  } catch {
    alert("Erro ao criar usuário. Verifique se o servidor está rodando.");
  }
});

// ── Deletar usuário ───────────────────────────────────────────
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-user")) return;

  const row = e.target.closest("tr");
  const id  = row.dataset.id;

  if (!confirm("Tem certeza que deseja remover este usuário?")) return;

  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method:  "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Erro ao remover usuário.");
      return;
    }

    row.remove();
  } catch {
    alert("Erro ao remover usuário. Verifique se o servidor está rodando.");
  }
});

// Carrega ao iniciar
loadUsers();