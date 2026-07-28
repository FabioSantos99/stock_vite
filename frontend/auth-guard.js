import { logout } from "./api.js";

// Lê o token imediatamente
const token    = localStorage.getItem("token");
const role     = localStorage.getItem("role");
const username = localStorage.getItem("username");

// Se não tiver token redireciona para login
// e para a execução com return
if (!token) {
  window.location.replace("login.html");
} else {
  const userInfo = document.querySelector("#user-info");
  if (userInfo) {
    userInfo.textContent = `${username} (${role})`;
  }

  if (role === "admin") {
    const usersBtn = document.querySelector("#users-btn");
    if (usersBtn) usersBtn.style.display = "flex";
  } else {
    const style = document.createElement("style");
    style.textContent = ".delete-item { display: none !important; }";
    document.head.appendChild(style);
  }

  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}