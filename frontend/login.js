const BASE_URL = "https://stock-vite.onrender.com";

const loginBtn   = document.querySelector("#login-btn");
const loginError = document.querySelector("#login-error");

// Se já tiver token válido, vai direto para o inventário
if (localStorage.getItem("token")) {
  window.location.replace("index.html");
}

loginBtn.addEventListener("click", async () => {
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!username || !password) {
    showError("Preencha todos os campos.");
    return;
  }

  try {
    const res  = await fetch(`${BASE_URL}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Erro ao fazer login.");
      return;
    }

    // Salva o token e o papel do usuário
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);

      window.location.replace("index.html");
;
  } catch {
    showError("Servidor indisponível. Tente novamente.");
  }
});

// Permite logar pressionando Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

function showError(msg) {
  loginError.textContent = msg;
  loginError.style.display = "block";
}