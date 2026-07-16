import { logout } from "./api.js";

setTimeout(() => {
  const token    = localStorage.getItem("token");
  const role     = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Mostra nome e papel do usuário no header
  const userInfo = document.querySelector("#user-info");
  if (userInfo) {
    userInfo.textContent = `${username} (${role})`;
  }

  // Admin — mostra botão Users e botão Delete
  if (role === "admin") {
    const usersBtn = document.querySelector("#users-btn");
    if (usersBtn) usersBtn.style.display = "flex";
  } else {
    // Operator — esconde botão Delete
    const style = document.createElement("style");
    style.textContent = ".delete-item { display: none !important; }";
    document.head.appendChild(style);
  }

  // Botão de logout
  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}, 100);